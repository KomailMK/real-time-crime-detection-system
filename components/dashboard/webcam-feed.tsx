'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Circle, Loader2 } from 'lucide-react';

interface WebcamFeedProps {
  cameraName?: string;
  location?: string;
}

export default function WebcamFeed({ cameraName = 'Webcam Feed', location = 'System Camera' }: WebcamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        setIsLoading(true);
        setError('');

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to access webcam';
        setError(errorMessage);
        console.log('[v0] Webcam error:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative w-full h-96 bg-gray-900 flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-4">
            <p className="text-red-500 text-center font-medium">{error}</p>
            <p className="text-gray-400 text-sm mt-2">Please check permissions and try again</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 z-20">
              <Badge className={`flex items-center gap-1 ${isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                <Circle className="h-2 w-2 fill-current" />
                {isActive ? 'Live' : 'Offline'}
              </Badge>
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{cameraName}</h3>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-xs text-gray-400 mt-2">Live Webcam Feed</p>
      </div>
    </Card>
  );
}
