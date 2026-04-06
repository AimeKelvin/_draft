import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCog,
  UtensilsCrossed,
  ChefHat,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  User } from
'lucide-react';
import { useAuth } from '../lib/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { toast } from 'sonner';
import type { UserRole } from '../lib/types';
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { role } = useParams<{
    role?: string;
  }>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);
    if (result.success) {
      toast.success('Login successful');
      navigate('/');
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };
  const roles = [
  {
    id: 'manager',
    title: 'Manager',
    icon: UserCog,
    desc: 'Manage tables, menu, and view stats'
  },
  {
    id: 'waiter',
    title: 'Waiter',
    icon: UtensilsCrossed,
    desc: 'Take orders and manage tables'
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    icon: ChefHat,
    desc: 'View and prepare incoming orders'
  }] as
  const;
  const selectedRole = roles.find((r) => r.id === role);
  if (selectedRole) {
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
            <Button
              variant="ghost"
              className="absolute top-6 left-6 text-[#71706B] hover:bg-[#F5F3EE]"
              onClick={() => navigate('/login')}>
              
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="max-w-md w-full mx-auto space-y-8 mt-8 lg:mt-0">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 bg-[#222222]/10 text-[#222222]">
                  <selectedRole.icon className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-[#222222] tracking-tight">
                  Welcome back
                </h1>
                <p className="text-[#71706B] mt-2 text-sm">
                  Please enter your credentials.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[#222222]">
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      placeholder={`e.g. ${selectedRole.id}`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="pr-10 rounded-xl border-[#E8E6E1] bg-white" />
                    
                    <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#71706B]" />
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-[#E8E6E1] text-[#222222] focus:ring-[#222222] w-4 h-4" />
                    
                    <span className="text-[#71706B]">Remember for 30 days</span>
                  </label>
                  <a
                    href="#"
                    className="text-[#222222] hover:underline font-medium">
                    
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full h-12 text-base font-medium bg-[#222222] hover:bg-[#333333] text-[#FFFDF8] mt-2"
                  disabled={isLoading}>
                  
                  {isLoading ?
                  <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Authenticating...
                    </> :

                  'Login'
                  }
                </Button>
              </form>

              {selectedRole.id === 'manager' &&
              <div className="text-center text-sm">
                  <span className="text-[#71706B]">
                    Don't have an account?{' '}
                  </span>
                  <Link
                  to="/signup"
                  className="text-[#222222] hover:underline font-medium">
                  
                    Sign up
                  </Link>
                </div>
              }

              <div className="text-center text-xs text-[#71706B]/60 pt-4 border-t border-[#E8E6E1]">
                Hint: Try {selectedRole.id} / {selectedRole.id}123
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
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="text-center mb-8 sm:mb-12">
        
        <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-[#222222] rounded-2xl text-[#FFFDF8] mb-4 sm:mb-6 shadow-lg">
          <UtensilsCrossed className="w-8 h-8 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-2 text-[#222222]">
          RestoManage
        </h1>
        <p className="text-[#71706B] text-sm sm:text-lg max-w-md mx-auto">
          Select your role to access the restaurant management system.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full">
        {roles.map((role, i) =>
        <motion.div
          key={role.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: i * 0.1
          }}
          whileHover={{
            y: -5
          }}>
          
            <Link to={`/login/${role.id}`}>
              <Card className="cursor-pointer h-full hover:ring-2 hover:ring-[#222222]/10 transition-all shadow-md border border-[#E8E6E1] bg-white">
                <CardHeader className="text-center pb-2 p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-3 sm:mb-4 bg-[#222222]/5 text-[#222222]">
                    <role.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-heading text-[#222222]">
                    {role.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-4 pt-0 sm:p-6 sm:pt-0">
                  <CardDescription className="text-sm sm:text-base text-[#71706B]">
                    {role.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}
      </div>
    </div>);

}