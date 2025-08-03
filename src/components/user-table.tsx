'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { User } from '@/types';

interface UserCardTableProps {
  users: User[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onDeleteSelected: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDeleteUser: (id: number) => void;
  onEditUser: (user: User) => void;
}

export function UserCardTable({
  users,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteSelected,
  currentPage,
  totalPages,
  onPageChange,
  onDeleteUser,
  onEditUser,
}: UserCardTableProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      const isIndeterminate =
        selectedIds.length > 0 && selectedIds.length < users.length;
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedIds, users.length]);

  const handleToggleSelectAll = () => {
    const isAllSelected =
      users.length > 0 && users.every((user) => selectedIds.includes(user.id));
    onToggleSelectAll(!isAllSelected);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={onDeleteSelected}
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={selectedIds.length === 0}
        >
          Delete Selected ({selectedIds.length})
        </Button>
      </div>

      <div className="overflow-y-auto h-[530px]">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 w-10">
                <input
                  type="checkbox"
                  ref={selectAllRef}
                  checked={users.length > 0 && users.every(user => selectedIds.includes(user.id))}
                  onChange={handleToggleSelectAll}
                />
              </th>
              <th className="px-4 py-2 w-20">User ID</th>
              <th className="px-4 py-2 w-40">Username</th>
              <th className="px-4 py-2 w-40">Nickname</th>
              <th className="px-4 py-2 w-56">Email</th>
              <th className="px-4 py-2 w-36">Joined Date</th>
              <th className="px-4 py-2 w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => onToggleSelect(user.id)}
                    />
                  </td>
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.nickname}</td>
                  <td className="px-4 py-2 truncate">{user.email}</td>
                  <td className="px-4 py-2">{user.createdAt?.slice(0, 10)}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-100"
                      onClick={() => onEditUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteUser(user.id)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              Array.from({ length: 10 }).map((_, idx) => (
                <tr key={'empty-' + idx} className="border-t">
                  <td className="px-2 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
