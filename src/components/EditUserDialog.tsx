'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function EditUserDialog({ open, onClose, user, onSave }: any) {
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        email: '',
        nickname: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id ?? '',
                username: user.username ?? '',
                email: user.email ?? '',
                nickname: user.nickname ?? '',
            });
        }
    }, [user]);


    const handleChange = (e: any) => {
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
