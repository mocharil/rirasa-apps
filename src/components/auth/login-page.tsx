"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";
import TermsModal from './terms-modal';
import Cookies from 'js-cookie';  // Tambahkan import ini

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const success = await login(username, password);
  
      if (success) {
        // Tunggu sebentar untuk memastikan cookie sudah ter-set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const authCookie = Cookies.get('isAuthenticated');
        
        if (authCookie === 'true') {
          // Set state dan cookie terlebih dahulu
          window.location.href = '/dashboard'; // Gunakan window.location.href daripada router.push
        } else {
          setError('Authentication error. Please try again.');
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login: Error occurred:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E86A33] to-[#1E40AF]">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        {/* Animated Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full">
          <img
            src="/jakarta-insight-logo.png"
            alt="Insight Jakarta Logo"
            className="w-32 h-26 mb-6"
          />
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Insight Jakarta
          </h1>
          <p className="text-white/80 text-center max-w-md px-8">
            Real-time monitoring and AI-powered citizen engagement platform for a smarter Jakarta
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 relative flex flex-col justify-center items-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
          {/* Decorative Patterns */}
          <div className="absolute inset-0 opacity-[0.03] bg-grid-pattern"></div>
          
          {/* Floating Shapes */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-[#E86A33]/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#1E40AF]/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
        </div>

        {/* Back to Home */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E86A33] to-[#1E40AF] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          {/* Card Content */}
          <div className="relative p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E86A33] to-[#1E40AF] bg-clip-text text-transparent">
                Welcome back
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Login to access dashboard
              </p>
    {/* Demo Credentials */}
    <div className="mt-4 space-y-1">
      <p className="text-sm font-medium text-blue-600">
        <span className="font-bold">Username:</span> demo
      </p>
      <p className="text-sm font-medium text-blue-600">
        <span className="font-bold">Password:</span> aiforimpact2024
      </p>
    </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E86A33] to-[#1E40AF] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="relative w-full px-4 py-2 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E86A33]/20 transition-all duration-200"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E86A33] to-[#1E40AF] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E86A33]/20 transition-all duration-200 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E86A33] to-[#1E40AF] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-2.5 bg-gradient-to-r from-[#E86A33] to-[#1E40AF] text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-600">
              By signing in, you agree to our{" "}
              <button
                onClick={() => setShowTerms(true)}
                className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] bg-clip-text text-transparent font-medium hover:opacity-80 transition-opacity inline-block cursor-pointer"
              >
                Terms of Service
              </button>
            </p>
                {/* Terms Modal */}
                <TermsModal 
              isOpen={showTerms} 
              onClose={() => setShowTerms(false)} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
