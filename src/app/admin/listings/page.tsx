
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Property = {
  id: number;
  listingTitle: string;
  town: string;
  block: string;
  streetName: string;
  postalCode: string;
  bedroomNumber: number;
  bathroomNumber: number;
  resalePrice: number;
  status: string;
};

export default function PropertyManagerPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchTown, setSearchTown] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const pageSize = 10;

  // 获取房源列表
  const fetchProperties = async (page: number, title = '', town = '') => {
    const params = {
      pageNum: page,
      pageSize,
      listingTitle: title,
      town: town,
    };
    const res = await fetch('/api/property/search?' + new URLSearchParams(params as any).toString());
    const data = await res.json();
    const pageData = data.data;
    setProperties(pageData.records || []);
    setCurrentPage(pageData.current || 1);
    setTotalPages(pageData.pages || 1);
  };

  useEffect(() => {
    fetchProperties(currentPage, searchTitle, searchTown);
  }, [currentPage, searchTitle, searchTown]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = () => {
    fetchProperties(1, searchTitle, searchTown);
    setCurrentPage(1);
  };

  const handleDeleteProperty = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/property/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.code === 0 && result.data === true) {
        alert('Delete successful');
        fetchProperties(currentPage, searchTitle, searchTown);
        setSelectedIds((prev) => prev.filter((pid) => pid !== id));
      } else {
        alert(result.message || 'Delete failed');
      }
    } catch (error) {
      alert('Error occurred while deleting');
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (checked: boolean) => {
    const currentPagePropertyIds = properties.map(p => p.id);
    if (checked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPagePropertyIds])));
    } else {
      setSelectedIds((prev) => prev.filter(id => !currentPagePropertyIds.includes(id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(`Are you sure you want to delete the selected ${selectedIds.length} listings?`);
    if (!confirmed) return;
    try {
      const res = await fetch('/api/property/delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedIds),
      });
      const result = await res.json();
      if (result.code === 0 && result.data === true) {
        alert('Batch delete successful');
        fetchProperties(currentPage, searchTitle, searchTown);
        setSelectedIds([]);
      } else {
        alert(result.message || 'Batch delete failed');
      }
    } catch (error) {
      alert('Error occurred during batch delete');
    }
  };

  const handleOpenEdit = (property: Property) => {
    setPropertyToEdit(property);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (editedProperty: Property) => {
    try {
      const res = await fetch(`/api/property/${editedProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProperty),
      });
      const result = await res.json();
      if (result.code === 0 && result.data) {
        alert('Listing updated successfully');
        fetchProperties(currentPage, searchTitle, searchTown);
      } else {
        alert(result.message || 'Update failed');
      }
    } catch (_err) {
      alert('Error occurred during update');
    } finally {
      setEditDialogOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow flex flex-col md:flex-row md:items-center justify-between px-6 py-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Manage Listings</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <Input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-56"
          />
          <Input
            type="text"
            placeholder="Search by region"
            value={searchTown}
            onChange={(e) => setSearchTown(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-56"
          />
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            Search
          </Button>
        </div>
      </div>

      <div>
        <table className="w-full border-separate border-spacing-y-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 rounded-l-lg">
                <input
                  type="checkbox"
                  checked={properties.length > 0 && properties.every(p => selectedIds.includes(p.id))}
                  onChange={e => handleToggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Region</th>
              <th className="px-3 py-2">Address</th>
              <th className="px-3 py-2">Bedrooms</th>
              <th className="px-3 py-2">Bathrooms</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => (
              <tr key={p.id} className="bg-white shadow rounded-lg">
                <td className="px-3 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => handleToggleSelect(p.id)}
                  />
                </td>
                <td className="px-3 py-4 font-semibold text-gray-800">{p.listingTitle}</td>
                <td className="px-3 py-4">{p.town}</td>
                <td className="px-3 py-4">{`${p.block} ${p.streetName} ${p.postalCode}`}</td>
                <td className="px-3 py-4">{p.bedroomNumber}</td>
                <td className="px-3 py-4">{p.bathroomNumber}</td>
                <td className="px-3 py-4">${p.resalePrice}</td>
                <td className="px-3 py-4">{p.status}</td>
                <td className="px-3 py-4 flex gap-2">
                  <Button size="sm" onClick={() => handleOpenEdit(p)} className="bg-blue-500 text-white">Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteProperty(p.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-6">
          <Button variant="destructive" onClick={handleDeleteSelected} disabled={selectedIds.length === 0}>
            Delete Selected
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {editDialogOpen && propertyToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[400px]">
            <h2 className="text-lg font-bold mb-4">Edit Listing</h2>
            <div className="space-y-2">
              <Input
                value={propertyToEdit.listingTitle}
                onChange={e => setPropertyToEdit({ ...propertyToEdit, listingTitle: e.target.value })}
                placeholder="Title"
              />
              <Input
                value={propertyToEdit.town}
                onChange={e => setPropertyToEdit({ ...propertyToEdit, town: e.target.value })}
                placeholder="Region"
              />
              <Input
                value={propertyToEdit.block}
                onChange={e => setPropertyToEdit({ ...propertyToEdit, block: e.target.value })}
                placeholder="Block"
              />
              <Input
                value={propertyToEdit.streetName}
                onChange={e => setPropertyToEdit({ ...propertyToEdit, streetName: e.target.value })}
                placeholder="Street"
              />
              <Input
                value={propertyToEdit.postalCode}
                onChange={e => setPropertyToEdit({ ...propertyToEdit, postalCode: e.target.value })}
                placeholder="Postal Code"
              />
              <Input
                type="number"
                value={propertyToEdit.resalePrice}
                onChange={e => setPropertyToEdit({ ...propertyToEdit, resalePrice: Number(e.target.value) })}
                placeholder="Price"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => handleSaveEdit(propertyToEdit)}>Save</Button>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
      );
}