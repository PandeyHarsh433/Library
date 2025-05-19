
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, BookOpen, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await signUp(email, password, {
        full_name: name,
        username: email.split('@')[0],
      });
      toast({
        title: "Success",
        description: "Please check your email to confirm your account",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <BookOpen className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold mb-2">Create Account</h1>
          <p className="text-cinematic-text/70">Join the Lumina reader community</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-cinematic-gray/20 bg-cinematic-darker/60 book-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-center">Sign Up</CardTitle>
              <CardDescription className="text-center">Enter your details to create an account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-cinematic-dark/50 border-cinematic-gray/30 focus:border-accent"
                        required
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinematic-text/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-cinematic-dark/50 border-cinematic-gray/30 focus:border-accent"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinematic-text/50" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-cinematic-dark/50 border-cinematic-gray/30 focus:border-accent"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinematic-text/50" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-cinematic-text/50 hover:text-cinematic-text"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 pr-10 bg-cinematic-dark/50 border-cinematic-gray/30 focus:border-accent ${
                          confirmPassword && password !== confirmPassword 
                            ? 'border-red-500 focus:border-red-500' 
                            : ''
                        }`}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cinematic-text/50" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-cinematic-text/50 hover:text-cinematic-text"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                      className="data-[state=checked]:bg-accent data-[state=checked]:border-accent mt-1"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-cinematic-text/90"
                    >
                      I agree to the{' '}
                      <Link to="/terms" className="text-accent hover:text-accent/80 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-accent hover:text-accent/80 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-cinematic-darker hover:bg-accent/90"
                    disabled={!agreeTerms || (confirmPassword && password !== confirmPassword)}
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-cinematic-gray/20" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-cinematic-darker px-2 text-cinematic-text/60">
                    or sign up with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full border-cinematic-gray/30 text-cinematic-text hover:border-accent hover:text-accent"
                >
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-cinematic-gray/30 text-cinematic-text hover:border-accent hover:text-accent"
                >
                  Apple
                </Button>
              </div>
              
              <p className="text-center text-sm mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:text-accent/80 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
