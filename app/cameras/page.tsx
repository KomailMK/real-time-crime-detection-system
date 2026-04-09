'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { cameraApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Video, Trash2, Edit2 } from 'lucide-react';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import AddCameraModal from '@/components/dashboard/add-camera-modal';
import CameraModal from '@/components/dashboard/camera-modal';

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

export default function CamerasPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [camerasLoading, setCamerasLoading] = useState(true);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  // Load cameras
  useEffect(() => {
    if (isAuthenticated) {
      loadCameras();
    }
  }, [isAuthenticated]);

  const loadCameras = async () => {
    try {
      setCamerasLoading(true);
      const response = await cameraApi.getAll();
      setCameras(response.cameras || []);
    } catch (error) {
      console.error('Failed to load cameras:', error);
    } finally {
      setCamerasLoading(false);
    }
  };

  const handleCameraAdded = () => {
    loadCameras();
    setShowAddCameraModal(false);
  };

  const handleCameraUpdated = () => {
    loadCameras();
    setShowCameraModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cameras</h1>
              <p className="text-gray-500 mt-1">Manage and monitor your security cameras</p>
            </div>
            <Button onClick={() => setShowAddCameraModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Camera
            </Button>
          </div>

          {camerasLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : cameras.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cameras.map((camera) => (
                <Card
                  key={camera.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative h-40 bg-gray-900 flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-700" />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          camera.status === 'online'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        {camera.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {camera.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {camera.location || 'No location'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">ID: {camera.camera_id}</p>

                    {camera.last_seen && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last seen: {new Date(camera.last_seen).toLocaleString()}
                      </p>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setSelectedCamera(camera);
                          setShowCameraModal(true);
                        }}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No cameras registered
                </h3>
                <p className="text-gray-500 mb-4">
                  Add your first camera to get started
                </p>
                <Button onClick={() => setShowAddCameraModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Camera
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {showAddCameraModal && (
        <AddCameraModal
          isOpen={showAddCameraModal}
          onClose={() => setShowAddCameraModal(false)}
          onCameraAdded={handleCameraAdded}
        />
      )}

      {showCameraModal && selectedCamera && (
        <CameraModal
          isOpen={showCameraModal}
          onClose={() => setShowCameraModal(false)}
          camera={selectedCamera}
          onCameraUpdated={handleCameraUpdated}
        />
      )}
    </div>
  );
}
