'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { authService } from '@/lib/auth/auth-service';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!username || !password) {
        setError('Please enter a username and password');
        return;
      }

      const { data, error: signInError } = await authService.signIn(username, password);
      if (signInError || !data?.user) {
        setError(typeof signInError === 'string' ? signInError : 'Invalid username or password');
        return;
      }

      const role = data.user?.app_metadata?.role || data.user?.user_metadata?.role;
      router.push(role === 'admin_role' || role === 'treasurer_role' ? '/analytics' : '/portal');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/logo.png" 
              alt="CCOS Guild Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                CCOS Charity Guild
              </h1>
              <p className="text-sm text-green-600 font-medium">Staff Administration</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Welcome Back</h2>
          <p className="text-green-600">Sign in to access the admin dashboard</p>
        </div>

        <Card className="shadow-2xl border border-green-100 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl font-semibold">Staff Login</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-green-800">
                  Username or Name
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name or portal username"
                    className="pl-12 h-12 border-green-200 focus:border-green-400 focus:ring-green-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-green-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 h-12 border-green-200 focus:border-green-400 focus:ring-green-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">Password access only</span>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Access Dashboard'}
              </Button>

            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-green-700">
                Need member access?{' '}
                <Link href="/portal" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                  Visit Member Portal
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-green-600 hover:text-emerald-600 font-medium transition-colors">
            ← Return to Homepage
          </Link>
          <p className="text-xs text-green-500 mt-2">© 2025 Country Club of the South Charity Guild</p>
        </div>
      </div>
    </div>
  );
}