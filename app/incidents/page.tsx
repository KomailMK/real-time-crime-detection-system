'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { incidentApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, Download } from 'lucide-react';
import SidebarNav from '@/components/dashboard/sidebar-nav';

interface Incident {
  id: number;
  camera_id: number;
  camera_name: string;
  event_type: string;
  severity: string;
  start_time: string;
  end_time: string | null;
  clip_url: string | null;
  thumbnail_url: string | null;
  processed: boolean;
  notified: boolean;
  created_at: string;
}

export default function IncidentsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentsLoading, setIncidentsLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: '',
    eventType: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  // Load incidents
  useEffect(() => {
    if (isAuthenticated) {
      loadIncidents();
    }
  }, [isAuthenticated, filters]);

  const loadIncidents = async () => {
    try {
      setIncidentsLoading(true);
      const response = await incidentApi.getAll({ limit: 50 });
      setIncidents(response.incidents || []);
    } catch (error) {
      console.error('Failed to load incidents:', error);
    } finally {
      setIncidentsLoading(false);
    }
  };

  const filteredIncidents = incidents.filter((incident) => {
    if (filters.severity && incident.severity !== filters.severity) return false;
    if (filters.eventType && incident.event_type !== filters.eventType) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Incidents</h1>
            <p className="text-gray-500 mt-1">Security events and detected incidents</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Severity</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.severity}
                    onChange={(e) =>
                      setFilters({ ...filters, severity: e.target.value })
                    }
                  >
                    <option value="">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.eventType}
                    onChange={(e) =>
                      setFilters({ ...filters, eventType: e.target.value })
                    }
                  >
                    <option value="">All Event Types</option>
                    <option value="intrusion">Intrusion</option>
                    <option value="theft">Theft</option>
                    <option value="vandalism">Vandalism</option>
                    <option value="motion">Motion</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incidents Table */}
          {incidentsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredIncidents.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr className="text-left">
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Timestamp
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Camera
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Event Type
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Severity
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncidents.map((incident) => (
                        <tr
                          key={incident.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            {new Date(incident.start_time).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">{incident.camera_name}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              {incident.event_type}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                                incident.severity
                              )}`}
                            >
                              {incident.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                incident.notified
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {incident.notified ? 'Notified' : 'New'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {incident.clip_url && (
                              <a
                                href={incident.clip_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No incidents
                </h3>
                <p className="text-gray-500">
                  No incidents match your filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
