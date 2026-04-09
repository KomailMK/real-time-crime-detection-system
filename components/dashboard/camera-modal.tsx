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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Camera {
  id: number;
  camera_id: string;
  name: string;
  stream_url: string;
  location: string;
  status: string;
  last_seen: string | null;
  created_at: string;
}

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  camera: Camera;
  onCameraUpdated: () => void;
}

export default function CameraModal({
  isOpen,
  onClose,
  camera,
  onCameraUpdated,
}: CameraModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: camera.name,
    stream_url: camera.stream_url,
    location: camera.location,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await cameraApi.update(camera.id, formData);
      setSuccess('Camera updated successfully!');
      setEditMode(false);
      setTimeout(() => {
        onCameraUpdated();
        onClose();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update camera';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this camera?')) {
      setLoading(true);
      try {
        await cameraApi.delete(camera.id);
        setSuccess('Camera deleted successfully!');
        setTimeout(() => {
          onCameraUpdated();
          onClose();
        }, 1000);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete camera';
        setError(message);
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{camera.name}</DialogTitle>
          <DialogDescription>Camera details and configuration</DialogDescription>
        </DialogHeader>

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

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="live">Live Stream</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <label className="text-sm text-gray-500">Camera ID</label>
                <p className="font-medium">{camera.camera_id}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      camera.status === 'online'
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                  ></div>
                  <span className="font-medium capitalize">{camera.status}</span>
                </div>
              </div>

              {camera.last_seen && (
                <div>
                  <label className="text-sm text-gray-500">Last Seen</label>
                  <p className="font-medium">
                    {new Date(camera.last_seen).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500">Created</label>
                <p className="font-medium">
                  {new Date(camera.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {!editMode ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{camera.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <p className="font-medium">{camera.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Stream URL</label>
                    <p className="font-medium break-all text-sm">{camera.stream_url}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditMode(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    className="flex-1"
                    disabled={loading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stream URL</label>
                  <Input
                    value={formData.stream_url}
                    onChange={(e) =>
                      setFormData({ ...formData, stream_url: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          {/* Live Stream Tab */}
          <TabsContent value="live" className="space-y-4">
            <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 mb-2">Live stream would appear here</p>
                <p className="text-sm text-gray-500">HLS/WebRTC player integration</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Stream URL: {camera.stream_url}
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
