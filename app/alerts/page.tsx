'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { alertApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bell, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import SidebarNav from '@/components/dashboard/sidebar-nav';

interface Alert {
  id: number;
  incident_id: number;
  recipient_email: string;
  method: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

export default function AlertsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [resending, setResending] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  // Load alerts
  useEffect(() => {
    if (isAuthenticated) {
      loadAlerts();
    }
  }, [isAuthenticated]);

  const loadAlerts = async () => {
    try {
      setAlertsLoading(true);
      const response = await alertApi.getAll({ limit: 50 });
      setAlerts(response.alerts || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setAlertsLoading(false);
    }
  };

  const handleResend = async (alertId: number) => {
    setResending(alertId);
    try {
      // In a real app, call resend API
      // await alertApi.resend(alertId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadAlerts();
    } catch (error) {
      console.error('Failed to resend alert:', error);
    } finally {
      setResending(null);
    }
  };

  const getMethodBadge = (method: string) => {
    return method === 'email'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
            <p className="text-gray-500 mt-1">Notification history and status</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{alerts.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {alerts.filter(a => a.status === 'sent').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {alerts.filter(a => a.status === 'failed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Table */}
          {alertsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : alerts.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr className="text-left">
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Recipient
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Method
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Sent At
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((alert) => (
                        <tr
                          key={alert.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            {new Date(alert.created_at).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 break-all">{alert.recipient_email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodBadge(
                                alert.method
                              )}`}
                            >
                              {alert.method.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                alert.status
                              )} flex items-center gap-1 w-fit`}
                            >
                              {alert.status === 'sent' && (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                              {alert.status === 'failed' && (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {alert.status === 'pending' && (
                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                              )}
                              {alert.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {alert.sent_at
                              ? new Date(alert.sent_at).toLocaleString()
                              : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {alert.status === 'failed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResend(alert.id)}
                                disabled={resending === alert.id}
                              >
                                {resending === alert.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <RotateCcw className="mr-1 h-3 w-3" />
                                    Resend
                                  </>
                                )}
                              </Button>
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
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No alerts
                </h3>
                <p className="text-gray-500">Alerts will appear here once incidents are detected</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
