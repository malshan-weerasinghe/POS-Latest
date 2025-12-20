import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import looper7Logo from '../../assets/looper7-logo.png';

export const LoginPage = () => {
  const [pin, setPin] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!pin.trim()) {
      toast.error('Please enter your PIN');
      return;
    }

    if (pin.length < 4 || pin.length > 8) {
      toast.error('PIN must be between 4-8 digits');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const result = await login(pin);
      
      if (result.success) {
        toast.success('Login successful!');
        // Navigation will be handled by the auth context
      } else {
        toast.error(result.message || 'Invalid PIN');
        setPin(''); // Clear PIN on failed login
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setPin('');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 8) {
      setPin(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Brand Column */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/95"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="text-center">
            <div className="mb-8">
              <img 
                src={looper7Logo} 
                alt="Looper7 Logo" 
                className="h-24 w-auto mx-auto mb-6 drop-shadow-lg"
              />
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Looper7</h1>
            <p className="text-xl text-blue-100 mb-8 font-light">Point of Sale System</p>
            <div className="max-w-md mx-auto">
              <p className="text-blue-100 leading-relaxed">
                Streamline your business operations with our comprehensive retail management solution. 
                Designed for modern businesses that value efficiency and growth.
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="absolute top-1/4 right-32 w-3 h-3 bg-white/15 rounded-full"></div>
        </div>
      </div>

      {/* Login Form Column */}
      <div className="flex-1 flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Enter your PIN to access the system</p>
          </div>

          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="pin" className="block text-center text-sm font-medium text-gray-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      User PIN
                    </div>
                  </Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="••••••••"
                    value={pin}
                    onChange={handlePinChange}
                    onKeyPress={handleKeyPress}
                    className="text-center text-2xl tracking-[0.5em] font-mono h-16 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
                    maxLength={8}
                    autoFocus
                    disabled={isLoggingIn}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={!pin.trim() || isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-3 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-600">
                  <span className="font-medium">Demo Admin PIN:</span>
                  <code className="bg-white px-2 py-1 rounded border font-mono text-blue-600 font-semibold">123456</code>
                </div>
                <p className="text-xs text-gray-500 mt-2">Change default PIN after first login for security</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};