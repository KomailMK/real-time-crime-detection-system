'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Server, Database, FileCode, BookOpen } from 'lucide-react';
import { checkBackendAvailable } from '@/lib/api';

export default function BackendInfoPage() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      const available = await checkBackendAvailable();
      setBackendStatus(available ? 'available' : 'unavailable');
    };
    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Crime Detection System</h1>
          <p className="text-lg text-muted-foreground">Backend Status & Setup Instructions</p>
        </div>

        {/* Backend Status Card */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              {backendStatus === 'checking' && (
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              )}
              {backendStatus === 'available' && (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              )}
              {backendStatus === 'unavailable' && (
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              )}
              <div>
                <CardTitle className="text-xl">
                  Backend Server Status: {backendStatus === 'checking' ? 'Checking...' : backendStatus === 'available' ? '✓ Available' : '⚠ Not Running'}
                </CardTitle>
                <CardDescription className="mt-1">
                  {backendStatus === 'available' && 'Your backend API is running and ready'}
                  {backendStatus === 'unavailable' && 'Backend API is not running on localhost:5000'}
                  {backendStatus === 'checking' && 'Checking connection...'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {backendStatus === 'unavailable' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The v0 preview environment does not automatically run your backend server. You need to start it manually on your system.
                </p>
                <div className="bg-muted p-4 rounded-lg border border-border">
                  <p className="text-sm font-mono text-foreground mb-2">To start the backend:</p>
                  <code className="text-xs bg-background p-3 block rounded border border-border overflow-auto">
                    {`cd backend
python app.py`}
                  </code>
                </div>
              </div>
            )}
            {backendStatus === 'available' && (
              <p className="text-sm text-green-600">Great! You can now use the full application. Go to the login page to get started.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link href="/auth">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90">
              Go to Login Page
            </Button>
          </Link>
          <a href="/FINAL_SETUP.md" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-12 bg-transparent">
              <BookOpen className="w-4 h-4 mr-2" />
              Setup Guide
            </Button>
          </a>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <Server className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Flask API running on port 5000</p>
              <p className="text-xs font-mono text-muted-foreground">http://localhost:5000</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <Database className="w-8 h-8 text-accent mb-2" />
              <CardTitle className="text-lg">Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">MySQL 8.0 on port 3306</p>
              <p className="text-xs font-mono text-muted-foreground">localhost:3306</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <FileCode className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle className="text-lg">Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Next.js running on port 3000</p>
              <p className="text-xs font-mono text-muted-foreground">http://localhost:3000</p>
            </CardContent>
          </Card>
        </div>

        {/* Setup Steps */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardTitle>Quick Setup Steps</CardTitle>
            <CardDescription>Get your system running in 5 minutes</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Start MySQL</p>
                  <p className="text-xs text-muted-foreground mt-1">Ensure MySQL 8.0 is running on your system</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Setup Backend Environment</p>
                  <p className="text-xs text-muted-foreground mt-1">Create <code className="bg-muted px-1 rounded text-xs">.env</code> file in backend folder with MySQL credentials</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Start Backend Server</p>
                  <p className="text-xs text-muted-foreground mt-1">Run <code className="bg-muted px-1 rounded text-xs">python app.py</code> in backend directory</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Frontend is Ready</p>
                  <p className="text-xs text-muted-foreground mt-1">Frontend is already running and waiting for backend connection</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">5</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Create Account & Login</p>
                  <p className="text-xs text-muted-foreground mt-1">Go to login page and sign up with your email</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Links */}
        <Card className="border-0 shadow-lg mt-6 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Documentation Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>FINAL_SETUP.md</strong> - Complete setup guide with troubleshooting</p>
              <p><strong>QUICK_START.md</strong> - Quick reference for experienced users</p>
              <p><strong>CHANGES_SUMMARY.md</strong> - What was changed from SQL Server to MySQL</p>
              <p><strong>README.md</strong> - Original project documentation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
