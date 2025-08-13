'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Property } from '@/types';
import Image from 'next/image';

interface PageResponse<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
}

const hdbTowns = [
  "Ang Mo Kio", "Bedok", "Bishan", "Bukit Batok", "Bukit Merah", "Bukit Panjang", "Bukit Timah",
  "Central Area", "Choa Chu Kang", "Clementi", "Geylang", "Hougang", "Jurong East", "Jurong West",
  "Kallang/Whampoa", "Marine Parade", "Pasir Ris", "Punggol", "Queenstown", "Sembawang", "Sengkang",
  "Serangoon", "Tampines", "Toa Payoh", "Woodlands", "Yishun"
];

const PendingPropertyTable: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoverImgUrl, setHoverImgUrl] = useState<string | null>(null);
  const [hoverImgPos, setHoverImgPos] = useState<{ x: number; y: number } | null>(null);

  const [sellerIdKeyword, setSellerIdKeyword] = useState('');
  const [addressKeyword, setAddressKeyword] = useState('');
  const [filterTown, setFilterTown] = useState('');
  const [filterBedroom, setFilterBedroom] = useState('');
  const [filterBathroom, setFilterBathroom] = useState('');

  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/property/list_pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageNum: current,
          pageSize,
          sellerId: sellerIdKeyword,
          address: addressKeyword,
          town: filterTown,
          bedroomNumber: filterBedroom || null,
          bathroomNumber: filterBathroom || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();

      const page: PageResponse<Property> = result.data ?? {
        records: [],
        total: 0,
        current: 1,
        size: pageSize,
      };

      setProperties(page.records);
      setTotal(page.total);
    } catch (err) {
      console.error('Error fetching pending properties:', err);
      setError('Failed to load data. Please try again.');
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, sellerIdKeyword, addressKeyword, filterTown, filterBedroom, filterBathroom]);

  const handleSearch = () => {
    setCurrent(1);
    fetchData();
  };

  const handleReview = async (id: number, approved: boolean) => {
    try {
      const response = await fetch('/api/admin/property/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });
      if (!response.ok) throw new Error('Review failed');
      fetchData();
    } catch (err) {
      console.error('Error reviewing property:', err);
      alert('Failed to review. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  const handleMouseEnter = (event: React.MouseEvent, url: string) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setHoverImgUrl(url);
    setHoverImgPos({ x: rect.right + 10, y: rect.top });
  };

  const handleMouseLeave = () => {
    setHoverImgUrl(null);
    setHoverImgPos(null);
  };

  const openViewer = (images: string[], startIndex: number) => {
    setViewerImages(images);
    setViewerIndex(startIndex);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setViewerImages([]);
    setViewerIndex(0);
  };

  const prevImage = () => {
    setViewerIndex((prev) => (prev - 1 + viewerImages.length) % viewerImages.length);
  };

  const nextImage = () => {
    setViewerIndex((prev) => (prev + 1) % viewerImages.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') prevImage();
    else if (event.key === 'ArrowRight') nextImage();
    else if (event.key === 'Escape') closeViewer();
  };

  return (
    <div className="p-6 bg-white rounded shadow overflow-x-auto relative">
      <h2 className="text-xl font-bold mb-4">Pending Property Listings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <input
          type="text"
          placeholder="Seller ID"
          className="border p-2 rounded"
          value={sellerIdKeyword}
          onChange={(e) => setSellerIdKeyword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="border p-2 rounded"
          value={addressKeyword}
          onChange={(e) => setAddressKeyword(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterTown}
          onChange={(e) => setFilterTown(e.target.value)}
        >
          <option value="">All Towns</option>
          {hdbTowns.map((town) => (
            <option key={town} value={town}>{town}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={filterBedroom}
          onChange={(e) => setFilterBedroom(e.target.value)}
        >
          <option value="">All Bedrooms</option>
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <select
          className="border p-2 rounded"
          value={filterBathroom}
          onChange={(e) => setFilterBathroom(e.target.value)}
        >
          <option value="">All Bathrooms</option>
          {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <button
          className="col-span-full md:col-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="min-w-[1200px]">
        <table className="min-w-full table-auto border border-collapse text-sm whitespace-nowrap">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Seller ID</th>
              <th className="px-3 py-2">Town</th>
              <th className="px-3 py-2">Address</th>
              <th className="px-3 py-2">Bedrooms</th>
              <th className="px-3 py-2">Bathrooms</th>
              <th className="px-3 py-2">Unit Info</th>
              <th className="px-3 py-2">Flat Model</th>
              <th className="px-3 py-2">Resale Price</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Updated</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="text-center py-4">Loading...</td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-4">No pending listings found.</td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">
                    {p.imageList && p.imageList.length > 0 ? (
                      <div className="relative">
                        <Image
                          src={p.imageList[0].imageUrl}
                          alt="Property thumbnail"
                          className="w-12 h-12 object-cover rounded cursor-pointer transition-transform hover:scale-105"
                          onMouseEnter={(e) => handleMouseEnter(e, p.imageList[0].imageUrl)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => openViewer(p.imageList.map(img => img.imageUrl), 0)}
                        />
                        {/* Display image count if more than 1 image */}
                        {p.imageList.length > 1 && (
                          <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {p.imageList.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">{p.listingTitle}</td>
                  <td className="px-3 py-2">{p.sellerId}</td>
                  <td className="px-3 py-2">{p.town}</td>
                  <td className="px-3 py-2">{`${p.block} ${p.streetName} ${p.postalCode}`}</td>
                  <td className="px-3 py-2">{p.bedroomNumber}</td>
                  <td className="px-3 py-2">{p.bathroomNumber}</td>
                  <td className="px-3 py-2">{`${p.storey} / ${p.floorAreaSqm} m² / ${p.topYear}`}</td>
                  <td className="px-3 py-2">{p.flatModel}</td>
                  <td className="px-3 py-2">${p.resalePrice?.toLocaleString()}</td>
                  <td className="px-3 py-2 text-yellow-600">{p.status}</td>
                  <td className="px-3 py-2">{formatDate(p.updatedAt)}</td>
                  <td className="px-3 py-2 space-x-1">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleReview(p.id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleReview(p.id, false)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={current === 1}
          onClick={() => setCurrent((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>Page {current} of {Math.ceil(total / pageSize)} (Total: {total})</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={current >= Math.ceil(total / pageSize)}
          onClick={() => setCurrent((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Hover preview image */}
      {hoverImgUrl && hoverImgPos && (
        <div
          className="fixed z-40 border border-gray-300 rounded shadow-lg bg-white"
          style={{
            top: hoverImgPos.y,
            left: hoverImgPos.x,
            width: 300,
            height: 200,
          }}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={hoverImgUrl}
            alt="Preview"
            className="w-full h-full object-contain rounded"
            draggable={false}
          />
        </div>
      )}

      {/* Full-screen image viewer */}
      {viewerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 z-10"
            onClick={closeViewer}
            title="Close (ESC)"
          >
            ×
          </button>
          
          {/* Main image container */}
          <div className="flex items-center justify-center w-full h-full relative px-16">
            {/* Previous button */}
            {viewerImages.length > 1 && (
              <button
                className="absolute left-4 text-white text-4xl font-bold px-4 py-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all"
                onClick={prevImage}
                title="Previous image (←)"
              >
                ‹
              </button>
            )}
            
            {/* Main image */}
            <Image
              src={viewerImages[viewerIndex]}
              alt={`Property image ${viewerIndex + 1}`}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded shadow-lg"
            />
            
            {/* Next button */}
            {viewerImages.length > 1 && (
              <button
                className="absolute right-4 text-white text-4xl font-bold px-4 py-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all"
                onClick={nextImage}
                title="Next image (→)"
              >
                ›
              </button>
            )}
          </div>
          
          {/* Image counter and navigation dots */}
          <div className="mt-6 text-center">
            <div className="text-white text-lg mb-3">
              {viewerIndex + 1} / {viewerImages.length}
            </div>
            
            {/* Navigation dots for multiple images */}
            {viewerImages.length > 1 && viewerImages.length <= 10 && (
              <div className="flex justify-center space-x-2">
                {viewerImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === viewerIndex 
                        ? 'bg-white' 
                        : 'bg-gray-500 hover:bg-gray-300'
                    }`}
                    onClick={() => setViewerIndex(index)}
                    title={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">
            Use ← → keys or click buttons to navigate • ESC to close
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPropertyTable;