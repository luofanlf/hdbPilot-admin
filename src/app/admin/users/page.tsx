'use client';

import { useEffect, useState } from 'react';
import { UserCardTable } from '@/components/user-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EditUserDialog from '@/components/EditUserDialog';
import { User } from '@/types';

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const pageSize = 10;

  const fetchUsers = async (page: number, keyword = '') => {
    const res = await fetch('/api/admin/user/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageNum: page, pageSize, keyword }),
    });

    const data = await res.json();
    const pageData = data.data;

    setUsers(pageData.records);
    setCurrentPage(pageData.current);
    setTotalPages(pageData.pages);

    // 可选：翻页时清空当前选中状态（如需保留可注释）
    // setSelectedIds([]);
  };

  useEffect(() => {
    fetchUsers(currentPage, searchKeyword);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = () => {
    fetchUsers(1, searchKeyword);
    setCurrentPage(1);
    // 可选：搜索后清空选中状态
    // setSelectedIds([]);
  };

  const handleDeleteUser = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/user/${id}`, { method: 'DELETE' });
      const result = await res.json();

      if (result.code === 0 && result.data === true) {
        alert('User deleted successfully.');
        fetchUsers(currentPage, searchKeyword);
        setSelectedIds((prev) => prev.filter((uid) => uid !== id));
      } else {
        alert(result.message || 'Failed to delete user.');
      }
    } catch (error) {
      console.error('Delete user failed', error);
      alert('Error occurred while deleting user.');
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // 全选时，累加当前页所有用户 id 到 selectedIds
  // 取消全选时，移除当前页所有用户 id
  const handleToggleSelectAll = (checked: boolean) => {
    const currentPageUserIds = users.map(user => user.id);
    if (checked) {
      // 合并之前已选 ids 和当前页 ids，避免重复
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageUserIds])));
    } else {
      // 移除当前页用户 ids
      setSelectedIds((prev) => prev.filter(id => !currentPageUserIds.includes(id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(`Delete ${selectedIds.length} selected users?`);
    if (!confirmed) return;

    try {
      const res = await fetch('/api/admin/user/delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedIds),
      });

      const result = await res.json();
      if (result.code === 0 && result.data === true) {
        alert('Users deleted successfully.');
        fetchUsers(currentPage, searchKeyword);
        setSelectedIds([]);
      } else {
        alert(result.message || 'Failed to delete users.');
      }
    } catch (error) {
      console.error('Bulk delete failed', error);
      alert('Error occurred during bulk delete.');
    }
  };

  const handleOpenEdit = (user: any) => {
    setUserToEdit(user);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (editedUser: any) => {
    try {
      const res = await fetch('/api/admin/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });

      const result = await res.json();
      if (result.code === 0 && result.data === true) {
        alert('User updated successfully.');
        fetchUsers(currentPage, searchKeyword);
      } else {
        alert(result.message || 'Failed to update user.');
      }
    } catch (err) {
      alert('Error occurred during update.');
    } finally {
      setEditDialogOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Manage Users</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search by username or email..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-64"
          />
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </div>
      </div>

      <UserCardTable
        users={users}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleOpenEdit}
      />

      <EditUserDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        user={userToEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
