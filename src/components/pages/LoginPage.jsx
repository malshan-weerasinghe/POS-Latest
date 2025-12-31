import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import looper7LogoIcon from '../../assets/looper7_logo Icon.png';
import looper7Logo from '../../assets/Looper7 Word  Logo White.png';

// Typewriter effect hook
const useTypewriter = (phrases, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const currentPhrase = phrases[currentPhraseIndex];
    const speed = isDeleting ? deletingSpeed : typingSpeed;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          setIsPaused(true);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, isPaused, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return currentText;
};

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const phrases = [
    'Custom Software Solutions',
    'AI-Powered Automation',
    'Smart IoT Integrations',
    'Intelligent AI Systems',
    'Scalable Web Platforms',
    'Mobile App Innovation',
    'Predictive ML Models',
    'Next-Gen POS Systems',
    'Cloud-Native Architectures',
    'Automated Business Logic',
    'Data-Driven Insights',
    'Enterprise IoT Solutions',
    'Seamless API Integrations',
    'Modern Digital Strategies',
    'Advanced Cyber Security',
    'Smart Workflow Automation',
    'Real-Time Analytics'
  ];

  const typewriterText = useTypewriter(phrases, 100, 50, 2000);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      // Using password as PIN for backend compatibility
      // In a real scenario, you'd send both username and password
      const result = await login(password);
      
      if (result.success) {
        toast.success('Login successful!');
        // Navigation will be handled by the auth context
      } else {
        toast.error(result.message || 'Invalid credentials');
        setPassword(''); // Clear password on failed login
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setPassword('');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif' }}>
      {/* Left Column - White Background */}
      <div className="flex-1 flex flex-col bg-white text-black relative">
        {/* Dynamic Headline with Typewriter Effect */}
        <div className="pt-16 px-16" style={{ height: '220px' }}>
          <h1 className="font-semibold text-black leading-tight" style={{ fontSize: '3.375rem' }}>
            Empowering Businesses with {' '}
            <span style={{ color: '#003e90', fontSize: '3.375rem' }}>{typewriterText}</span>
            <span className="typewriter-cursor" style={{ color: '#003e90', fontSize: '3.375rem' }}>|</span>
          </h1>
        </div>

        {/* 3D Rotating Logo - Fixed Position Lower */}
        <div className="flex items-center justify-center flex-shrink-0" style={{ marginTop: '100px', marginBottom: '5px' }}>
          <img 
            src={looper7LogoIcon} 
            alt="Looper7 Icon" 
            className="h-96 w-auto drop-shadow-lg logo-3d-rotate"
            style={{ outline: 'none', border: 'none' }}
            tabIndex={-1}
          />
        </div>

        {/* Footer - Contact Information - Fixed Position at Bottom */}
        <div className="pb-12 px-16 flex-shrink-0">
          <div className="border-t border-gray-200 pt-4">
            <p className="font-medium" style={{ color: '#003e90', fontSize: '40px' }}>Looper 7 Pvt Ltd</p>
            <p className="text-lg text-gray-500 mt-2">Contact us for innovative technology solutions</p>
          </div>
        </div>
      </div>

      {/* Right Column - Blue Background */}
      <div className="flex-1 flex flex-col items-center justify-center p-12" style={{ backgroundColor: '#003e90' }}>
        <div className="w-full max-w-xl">
          {/* Top Logo - Centered to Text Fields */}
          <div className="mb-10 flex justify-center" style={{ marginTop: '2px' }}>
            <div className="bg-white px-6 py-4 rounded-lg inline-block">
              <img 
                src={looper7Logo} 
                alt="Looper7 Logo" 
                className="h-24 w-auto"
              />
            </div>
          </div>

          {/* Welcome Header - Centered and Larger */}
          <div className="mb-10 text-center">
            <h2 className="font-semibold text-white mb-4" style={{ letterSpacing: '-0.5px', fontSize: '36px' }}>
              Welcome to Your POS System
            </h2>
            <p className="text-white/80 font-bold italic" style={{ fontSize: '24px' }}>Sign in to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-8">
            {/* Username Field */}
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-16 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 text-lg font-normal rounded-md px-5 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-200"
                style={{
                  boxShadow: 'none',
                  backgroundColor: 'white',
                }}
                placeholder="Enter Username"
                autoComplete="off"
                autoFocus
                disabled={isLoggingIn}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-16 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 text-lg font-normal rounded-md px-5 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/0 transition-all duration-200"
                style={{
                  boxShadow: 'none',
                  backgroundColor: 'white',
                }}
                placeholder="Enter Password"
                autoComplete="off"
                disabled={isLoggingIn}
              />
            </div>

            {/* Sign In Button */}
            <div className="pt-6 flex justify-center">
              <Button
                type="submit"
                className="sign-in-button"
                disabled={!username.trim() || !password.trim() || isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-[#003e90]/30 border-t-[#003e90] inline-block"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-10 pt-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-3">
                <span className="text-base text-white/60 font-normal uppercase tracking-wide">Demo Password: 123456</span>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
