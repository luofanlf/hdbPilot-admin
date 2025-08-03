'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, ChangeEvent } from "react";
import { User } from "@/types";

// Editable form type excludes createdAt
export type EditableUser = {
  id: number;
  username: string;
  nickname: string;
  email: string;
};

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => void;  // 注意这里用 User 类型匹配 AdminUserPage 的 onSave
}

export default function EditUserDialog({
  open,
  onClose,
  user,
  onSave,
}: EditUserDialogProps) {
  // 初始表单，使用 User 类型的可选字段构造，避免 null 报错
  const [formData, setFormData] = useState<User>({
    id: 0,
    username: '',
    nickname: '',
    email: '',
    createdAt: '',  // 需要给默认值避免 undefined 报错
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username || '',
        nickname: user.nickname || '',
        email: user.email || '',
        createdAt: user.createdAt || '',
      });
    } else {
      // 重置为空用户
      setFormData({
        id: 0,
        username: '',
        nickname: '',
        email: '',
        createdAt: '',
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            name="nickname"
            placeholder="Nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
