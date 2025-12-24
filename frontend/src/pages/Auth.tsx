import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSwitchMode: () => void;
  initialRole?: 'CITIZEN' | 'DEPARTMENT' | 'ADMIN';
}

// ---------------- ZOD SCHEMAS ----------------
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  // role: z.enum(['CITIZEN', 'DEPARTMENT', 'ADMIN'], { required_error: 'Please select a role' }),
});

const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().optional(),
});

export const AuthModal = ({
  isOpen,
  onClose,
  mode,
  onSwitchMode,
  initialRole,
}: AuthModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const [role, setRole] = useState<'CITIZEN' | 'DEPARTMENT' | 'ADMIN'>(initialRole || 'CITIZEN');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginForm, setLoginForm] = useState({ email: '', password: '', role: 'CITIZEN' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'CITIZEN' as const,
  });

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
      setLoginForm({ ...loginForm, role: initialRole });
    }
  }, [initialRole]);

  // ---------------- Login ----------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!role) {
      toast({ title: 'Error', description: 'Please select a role', variant: 'destructive' });
      return;
    }

    try {
      loginSchema.parse({ ...loginForm, role });
      setIsLoading(true);

      // ✅ Include role in payload
      const { error } = await signIn({
        email: loginForm.email,
        password: loginForm.password,
        role,
      });

      if (error) {
        toast({
          title: 'Login failed',
          description: error || 'Invalid credentials or role mismatch',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Login successful',
        description: `Welcome back ${role}!`,
      });

      onClose();

      // Redirect based on role
      if (role === 'CITIZEN') navigate('/citizen');
      else if (role === 'DEPARTMENT') navigate('/department');
      else if (role === 'ADMIN') navigate('/admin');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- Register ----------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      registerSchema.parse(registerForm);
      setIsLoading(true);

      const { error } = await signUp(registerForm);

      if (error) {
        toast({
          title: 'Registration failed',
          description: error || 'Something went wrong',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Account created',
        description: 'Welcome to CivicPulse!',
      });

      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-md glass-card p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === 'login' ? 'Sign in to CivicPulse' : 'Join CivicPulse today'}
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* <select
              value={role}
              onChange={e => {
                const r = e.target.value as 'CITIZEN' | 'DEPARTMENT' | 'ADMIN';
                setRole(r);
                setLoginForm({ ...loginForm, role: r });
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="CITIZEN">Citizen</option>
              <option value="DEPARTMENT">Department</option>
              <option value="ADMIN">Admin</option>
            </select> */}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={registerForm.fullName}
              onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={registerForm.email}
              onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={registerForm.password}
              onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={registerForm.phone}
              onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
            />
            <Textarea
              placeholder="Address (optional)"
              value={registerForm.address}
              onChange={e => setRegisterForm({ ...registerForm, address: e.target.value })}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </Button>
          </form>
        )}

        <p className="text-center text-sm mt-6">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={onSwitchMode}
            className="text-primary font-medium hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};
