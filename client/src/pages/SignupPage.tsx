import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCog, Loader2, Eye, EyeOff, User, Mail } from 'lucide-react';
import { useAuth } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { toast } from 'sonner';
export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    const result = await register(fullName, username, password);
    setIsLoading(false);
    if (result.success) {
      toast.success('Account created successfully');
      navigate('/');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl border border-[#E8E6E1] overflow-hidden flex min-h-[600px]">
        
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 bg-[#222222]/10 text-[#222222]">
                <UserCog className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-[#222222] tracking-tight">
                Create Account
              </h1>
              <p className="text-[#71706B] mt-2 text-sm">
                Set up your manager account to get started.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#222222]">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    placeholder="e.g. Sarah Chen"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 rounded-xl border-[#E8E6E1] bg-white" />
                  
                  <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#71706B]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#222222]">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="e.g. manager"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 rounded-xl border-[#E8E6E1] bg-white" />
                  
                  <Mail className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#71706B]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#222222]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 rounded-xl border-[#E8E6E1] bg-white" />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71706B] hover:text-[#222222] transition-colors">
                    
                    {showPassword ?
                    <EyeOff className="w-4 h-4" /> :

                    <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#222222]">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 rounded-xl border-[#E8E6E1] bg-white" />
                  
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71706B] hover:text-[#222222] transition-colors">
                    
                    {showConfirmPassword ?
                    <EyeOff className="w-4 h-4" /> :

                    <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full h-12 text-base font-medium bg-[#222222] hover:bg-[#333333] text-[#FFFDF8] mt-2"
                disabled={isLoading}>
                
                {isLoading ?
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </> :

                'Create Account'
                }
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-[#71706B]">Already have an account? </span>
              <Link
                to="/login/manager"
                className="text-[#222222] hover:underline font-medium">
                
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div className="hidden lg:block lg:w-1/2 p-4 bg-white">
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=1000&fit=crop"
              alt="Restaurant Interior"
              className="w-full h-full object-cover" />
            
            <div className="absolute bottom-12 left-12 z-20 text-white">
              <h2 className="text-3xl font-heading font-bold mb-2">
                RestoManage
              </h2>
              <p className="text-white/80 max-w-sm">
                The complete solution for modern restaurant operations and
                management.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>);

}