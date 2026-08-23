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
import type { SignupFormData } from '@/types';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type SignupSchema = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      setError('');
      const payload: SignupFormData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      await signup(payload);
      navigate('/admin');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | TRISTARC</title>
        <meta name="description" content="Create your TRISTARC account to access courses and resources." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="card p-8 shadow-card-hover">
          <div className="text-center mb-8">
            <img src="/images/tristarc-logo.png" alt="TRISTARC" className="h-14 w-auto object-contain mx-auto mb-4"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <h1 className="text-2xl font-bold text-tristarc-text-primary mb-1">Create Account</h1>
            <p className="text-sm text-tristarc-text-muted">Join TRISTARC to access courses and resources</p>
          </div>

          {error && (
            <div className="bg-accent-red-light border border-accent-red/30 text-accent-red text-sm rounded-xl px-4 py-3 mb-5" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="First Name" required placeholder="First name" autoComplete="given-name" error={errors.firstName} {...register('firstName')} />
              <InputField label="Last Name" required placeholder="Last name" autoComplete="family-name" error={errors.lastName} {...register('lastName')} />
            </div>
            <InputField label="Email Address" type="email" required placeholder="your@email.com" autoComplete="email" error={errors.email} {...register('email')} />
            <InputField label="Phone Number" type="tel" placeholder="+91 XXXXX XXXXX" autoComplete="tel" error={errors.phone} {...register('phone')} />

            <div className="space-y-1.5">
              <label className="form-label">Password <span className="text-accent-red ml-1" aria-hidden>*</span></label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" autoComplete="new-password"
                  className={`form-input pr-10 ${errors.password ? 'border-accent-red' : ''}`} {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tristarc-text-muted hover:text-tristarc-text-primary transition-colors" aria-label="Toggle password">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="form-label">Confirm Password <span className="text-accent-red ml-1" aria-hidden>*</span></label>
              <input type="password" placeholder="Repeat your password" autoComplete="new-password"
                className={`form-input ${errors.confirmPassword ? 'border-accent-red' : ''}`} {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" variant="accent" size="lg" isLoading={isSubmitting} className="w-full justify-center mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-tristarc-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-accent-orange transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default SignupPage;
