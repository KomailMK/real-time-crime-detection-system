'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { cameraApi, incidentApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Video, AlertTriangle, Activity, Clock, Zap } from 'lucide-react';
import SidebarNav from '@/components/dashboard/sidebar-nav';
import CameraGrid from '@/components/dashboard/camera-grid';
import AddCameraModal from '@/components/dashboard/add-camera-modal';
import CameraModal from '@/components/dashboard/camera-modal';
import WebcamFeed from '@/components/dashboard/webcam-feed';

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

interface Incident {
  id: number;
  camera_id: number;
  event_type: string;
  severity: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [camerasLoading, setCamerasLoading] = useState(true);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  // Load cameras and incidents
  useEffect(() => {
    if (isAuthenticated) {
      loadCameras();
      loadIncidents();
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

  const loadIncidents = async () => {
    try {
      const response = await incidentApi.getAll({ limit: 5 });
      setIncidents(response.incidents || []);
    } catch (error) {
      console.error('Failed to load incidents:', error);
    }
  };

  const handleCameraAdded = () => {
    setShowAddCameraModal(false);
    loadCameras();
  };

  const handleCameraClick = (camera: Camera) => {
    setSelectedCamera(camera);
    setShowCameraModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <SidebarNav user={user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.name || 'User'}</p>
            </div>
            <Button 
              onClick={() => setShowAddCameraModal(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground h-10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Camera
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cameras</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{cameras.length}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Online Cameras</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{onlineCameras}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical Incidents</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{criticalIncidents}</p>
                    </div>
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Webcam Feed */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Live Webcam Feed</h2>
                  <p className="text-sm text-muted-foreground">Your system's integrated camera</p>
                </div>
              </div>
              <WebcamFeed cameraName="System Webcam" location="Main Feed" />
            </div>

            {/* IP Cameras Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">IP Cameras</h2>
                  <p className="text-sm text-muted-foreground">Manage and monitor connected IP cameras</p>
                </div>
              </div>

              {camerasLoading ? (
                <div className="flex items-center justify-center h-64 bg-card/50 rounded-xl border border-border/50">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : cameras.length === 0 ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
                    <Video className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Cameras Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add your first camera to get started</p>
                    <Button 
                      onClick={() => setShowAddCameraModal(true)}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Camera
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <CameraGrid 
                  cameras={cameras} 
                  onCameraClick={handleCameraClick}
                />
              )}
            </div>

            {/* Recent Incidents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Recent Incidents</h2>
                  <p className="text-sm text-muted-foreground">Last 5 detected events</p>
                </div>
              </div>

              {incidents.length === 0 ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
                    <Clock className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Incidents</h3>
                    <p className="text-sm text-muted-foreground">Everything looks good</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {incidents.map((incident) => (
                        <div key={incident.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              incident.severity === 'critical' ? 'bg-destructive' : 
                              incident.severity === 'high' ? 'bg-orange-500' : 
                              'bg-yellow-500'
                            }`} />
                            <div>
                              <p className="text-sm font-medium text-foreground capitalize">{incident.event_type}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(incident.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            incident.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                            incident.severity === 'high' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                            'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {incident.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddCameraModal 
        isOpen={showAddCameraModal}
        onClose={() => setShowAddCameraModal(false)}
        onSuccess={handleCameraAdded}
      />
      
      {selectedCamera && (
        <CameraModal
          isOpen={showCameraModal}
          onClose={() => {
            setShowCameraModal(false);
            setSelectedCamera(null);
          }}
          camera={selectedCamera}
          onUpdate={() => {
            loadCameras();
            setShowCameraModal(false);
          }}
        />
      )}
    </div>
  );
}
