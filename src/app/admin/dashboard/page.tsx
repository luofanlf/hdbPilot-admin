"use client";

import React, { useEffect, useState } from 'react';
import { Property } from '@/types';

interface PageResponse<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
}

const PendingPropertyTable: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/property/list_pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageNum: current,
          pageSize: pageSize,
          keyword: keyword,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data: PageResponse<Property> = await response.json();
      setProperties(data.records);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching pending properties:', err);
      setError('Failed to load data. Please try again.');
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: number, approved: boolean) => {
    try {
      const response = await fetch('/api/admin/property/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, approved }),
      });

      if (!response.ok) {
        throw new Error('Review failed');
      }

      fetchData(); // Refresh list
    } catch (err) {
      console.error('Error reviewing property:', err);
      alert('Failed to review. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [current, keyword]);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pending Property Listings</h2>

      <input
        type="text"
        placeholder="Search by title or town..."
        className="border p-2 mb-4 w-full"
        value={keyword}
        onChange={(e) => {
          setCurrent(1);
          setKeyword(e.target.value);
        }}
      />

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <table className="min-w-full table-auto border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Town</th>
            <th className="px-3 py-2">Address</th>
            <th className="px-3 py-2">Bedrooms</th>
            <th className="px-3 py-2">Bathrooms</th>
            <th className="px-3 py-2">Resale Price</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center py-4">Loading...</td>
            </tr>
          ) : properties.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">No pending listings found.</td>
            </tr>
          ) : (
            properties.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-4">{p.listingTitle}</td>
                <td className="px-3 py-4">{p.town}</td>
                <td className="px-3 py-4">{`${p.block} ${p.streetName} ${p.postalCode}`}</td>
                <td className="px-3 py-4">{p.bedroomNumber}</td>
                <td className="px-3 py-4">{p.bathroomNumber}</td>
                <td className="px-3 py-4">${p.resalePrice}</td>
                <td className="px-3 py-4 text-yellow-600 font-medium">{p.status}</td>
                <td className="px-3 py-4 flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleReview(p.id, true)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          disabled={current === 1}
          onClick={() => setCurrent((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {current} of {Math.ceil(total / pageSize)}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          disabled={current >= Math.ceil(total / pageSize)}
          onClick={() => setCurrent((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingPropertyTable;
