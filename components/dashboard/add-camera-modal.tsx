'use client';

import React from "react"

import { useState } from 'react';
import { cameraApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCameraAdded: () => void;
}

export default function AddCameraModal({
  isOpen,
  onClose,
  onCameraAdded,
}: AddCameraModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    camera_id: '',
    name: '',
    stream_url: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.camera_id || !formData.name || !formData.stream_url) {
      setError('Camera ID, name, and stream URL are required');
      return;
    }

    setLoading(true);
    try {
      await cameraApi.add(formData);
      setSuccess('Camera added successfully!');
      setFormData({ camera_id: '', name: '', stream_url: '', location: '' });
      setTimeout(() => {
        onCameraAdded();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add camera';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ camera_id: '', name: '', stream_url: '', location: '' });
      setError('');
      setSuccess('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Camera</DialogTitle>
          <DialogDescription>
            Register a new camera for monitoring
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              <CheckCircle2 className="w-4 h-4" />
              {success}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Camera ID</label>
            <Input
              type="text"
              placeholder="camera-001"
              value={formData.camera_id}
              onChange={(e) =>
                setFormData({ ...formData, camera_id: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier for this camera
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Camera Name</label>
            <Input
              type="text"
              placeholder="Front Door Camera"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stream URL</label>
            <Input
              type="url"
              placeholder="rtsp://camera-ip:554/stream"
              value={formData.stream_url}
              onChange={(e) =>
                setFormData({ ...formData, stream_url: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              RTSP, HTTP, or HLS URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Location (Optional)
            </label>
            <Input
              type="text"
              placeholder="Main Entrance"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Camera
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
