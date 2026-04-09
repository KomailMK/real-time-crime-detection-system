'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, Shield, Mail, Lock } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup states
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    property_type: 'House',
  });
  const [signupCode, setSignupCode] = useState('');
  const [signupStep, setSignupStep] = useState<'email' | 'code'>('email');

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginStep, setLoginStep] = useState<'email' | 'code'>('email');

  // Redirect if already authenticated using useEffect
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========== SIGNUP HANDLERS ==========
  const handleRequestSignupCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authApi.requestSignupCode(signupData);
      setSuccess('Verification code sent to your email');
      setSignupStep('code');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send code';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignupCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authApi.verifySignupCode(signupData.email, signupCode);
      setSuccess('Account created successfully! Redirecting...');
      await checkAuth();
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify code';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ========== LOGIN HANDLERS ==========
  const handleRequestLoginCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authApi.requestLoginCode(loginEmail);
      setSuccess('Verification code sent to your email');
      setLoginStep('code');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send code';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authApi.verifyLoginCode(loginEmail, loginCode);
      setSuccess('Login successful! Redirecting...');
      await checkAuth();
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify code';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setSignupStep('email');
    setLoginStep('email');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Crime Detection</h1>
          <p className="text-muted-foreground mt-2">Real-time security monitoring</p>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/50 dark:bg-background/50">
          <CardHeader className="border-b border-border/50 pb-4">
            <Tabs value={activeTab} onValueChange={(v) => {
              setActiveTab(v as 'signup' | 'login');
              setError('');
              setSuccess('');
              setSignupStep('email');
              setLoginStep('email');
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
              </div>
            )}

            {/* LOGIN TAB */}
            {activeTab === 'login' && (
              <div className="space-y-4">
                {loginStep === 'email' ? (
                  <form onSubmit={handleRequestLoginCode} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 h-11 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {loading ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyLoginCode} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Verification Code</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="000000"
                          value={loginCode}
                          onChange={(e) => setLoginCode(e.target.value.slice(0, 6))}
                          className="pl-10 h-11 text-center tracking-widest border-border/50 focus:border-primary"
                          maxLength={6}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Check your email for the 6-digit code</p>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {loading ? 'Verifying...' : 'Verify & Login'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleBackToEmail}
                      className="w-full h-11 bg-transparent"
                    >
                      Back to Email
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* SIGNUP TAB */}
            {activeTab === 'signup' && (
              <div className="space-y-4">
                {signupStep === 'email' ? (
                  <form onSubmit={handleRequestSignupCode} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        className="h-11 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="pl-10 h-11 border-border/50 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Phone</label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        className="h-11 border-border/50 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Address</label>
                      <Input
                        type="text"
                        placeholder="123 Main Street"
                        value={signupData.address}
                        onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                        className="h-11 border-border/50 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Property Type</label>
                      <select
                        value={signupData.property_type}
                        onChange={(e) => setSignupData({ ...signupData, property_type: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg border border-border/50 bg-background text-foreground focus:border-primary focus:outline-none"
                      >
                        <option>House</option>
                        <option>Shop</option>
                        <option>Office</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifySignupCode} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Verification Code</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="000000"
                          value={signupCode}
                          onChange={(e) => setSignupCode(e.target.value.slice(0, 6))}
                          className="pl-10 h-11 text-center tracking-widest border-border/50 focus:border-primary"
                          maxLength={6}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Check {signupData.email} for the 6-digit code</p>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {loading ? 'Verifying...' : 'Verify & Complete Signup'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleBackToEmail}
                      className="w-full h-11 bg-transparent"
                    >
                      Back to Details
                    </Button>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Secure • No password required • Encrypted
        </p>
      </div>
    </div>
  );
}
