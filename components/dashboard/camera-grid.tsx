'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Circle } from 'lucide-react';

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

interface CameraGridProps {
  cameras: Camera[];
  onCameraClick: (camera: Camera) => void;
}

export default function CameraGrid({ cameras, onCameraClick }: CameraGridProps) {
  const getStatusColor = (status: string) => {
    return status === 'online' ? 'bg-green-500' : 'bg-gray-400';
  };

  const getStatusLabel = (status: string) => {
    return status === 'online' ? 'Online' : 'Offline';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cameras.map((camera) => (
        <Card
          key={camera.id}
          className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          onClick={() => onCameraClick(camera)}
        >
          <div className="relative h-48 bg-gray-900 flex items-center justify-center">
            <Video className="h-12 w-12 text-gray-700" />
            <div className="absolute top-3 right-3">
              <Badge
                className={`flex items-center gap-1 ${
                  camera.status === 'online'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                <Circle className="h-2 w-2 fill-current" />
                {getStatusLabel(camera.status)}
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 truncate">{camera.name}</h3>
            <p className="text-sm text-gray-500 truncate">{camera.location}</p>
            <p className="text-xs text-gray-400 mt-2">
              ID: {camera.camera_id}
            </p>
            {camera.last_seen && (
              <p className="text-xs text-gray-400 mt-1">
                Last seen: {new Date(camera.last_seen).toLocaleString()}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
