'use client';

import { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;                 // Current page number
  totalPages: number;                  // Total number of pages
  onPageChange: (page: number) => void; // Callback when page changes
}

// Pagination component
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Value in the input box, initialized as the string of currentPage
  const [inputValue, setInputValue] = useState(currentPage.toString());
  const [error, setError] = useState(''); // Error message

  // Update input value whenever currentPage changes
  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  // Handle changes in the input box
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update input value
    setError(''); // Clear error message
  };

  // Handle Enter key press for page jump
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNum = Number(inputValue);
      // Validate input value
      if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
        setError(`Please enter a number between 1 and ${totalPages}`);
      } else {
        setError('');
        onPageChange(pageNum); // Trigger page change
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1 py-2 border-t">
      <div className="flex items-center space-x-2">
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 text-blue-700 border-blue-500 hover:bg-blue-50"
        >
          Prev
        </button>

        {/* Page input box */}
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-16 px-2 py-1 border rounded text-center"
          min={1}
          max={totalPages}
        />

        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 text-blue-700 border-blue-500 hover:bg-blue-50"
        >
          Next
        </button>
      </div>

      {/* Error message display */}
      {error && <p className="text-red-500 text-xs">{error}</p>}

      {/* Page info display */}
      <p className="text-sm text-gray-600 mt-1">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}
