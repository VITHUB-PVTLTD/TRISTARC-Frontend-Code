import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { InputField } from '@/components/forms/FormFields';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import type { LoginFormData } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});
type LoginSchema = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      setError('');
      const loggedInUser = await login(data as LoginFormData);
      const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'];
      const userIsAdmin = loggedInUser?.roles?.some((r: string) => adminRoles.includes(r)) ?? false;
      if (userIsAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Invalid email or password. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | TRISTARC</title>
        <meta name="description" content="Login to your TRISTARC account." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="card p-8 shadow-card-hover">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/images/tristarc-logo.png" alt="TRISTARC" className="h-16 w-auto object-contain mx-auto mb-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <h1 className="text-2xl font-bold text-tristarc-text-primary mb-1">Welcome Back</h1>
            <p className="text-sm text-tristarc-text-muted">Sign in to your TRISTARC account</p>
          </div>

          {error && (
            <div className="bg-accent-red-light border border-accent-red/30 text-accent-red text-sm rounded-xl px-4 py-3 mb-5" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <InputField
              label="Email Address"
              type="email"
              required
              placeholder="your@email.com"
              autoComplete="email"
              error={errors.email}
              {...register('email')}
            />

            <div className="space-y-1.5">
              <label className="form-label">
                Password <span className="text-accent-red ml-1" aria-hidden>*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`form-input pr-10 ${errors.password ? 'border-accent-red' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tristarc-text-muted hover:text-tristarc-text-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-tristarc-border text-primary focus:ring-primary" {...register('rememberMe')} />
                <span className="text-sm text-tristarc-text-secondary">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-accent-orange transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full justify-center">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-tristarc-text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:text-accent-orange transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default LoginPage;
