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

// Predefined user type
export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  createdAt: string;
}

// Editable form type (excludes createdAt, fields allow empty strings)
type EditableUser = {
  id: number;
  username: string;
  nickname: string;
  email: string;
};

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: EditableUser) => void;
}

export default function EditUserDialog({
  open,
  onClose,
  user,
  onSave,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState<EditableUser>({
    id: 0,
    username: '',
    email: '',
    nickname: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username ?? '',
        email: user.email ?? '',
        nickname: user.nickname ?? '',
      });
    } else {
      // If user is null, reset to initial empty state to prevent passing null
      setFormData({
        id: 0,
        username: '',
        email: '',
        nickname: '',
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
