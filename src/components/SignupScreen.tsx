import React, { useState } from 'react';
import logo from '../../assets/Nava-logo.png';

interface User {
  id?: number;
  email: string;
  role?: string;
  name?: string;
  employeeId?: string;
  department?: string;
}

interface SignupScreenProps {
  onSignupSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onSignupSuccess, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    // Form Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://navapack-backend.azurewebsites.net/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          employee_id: formData.employeeId,
          department: formData.department,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.non_field_errors?.[0] ||
          result.detail ||
          result.email?.[0] ||
          result.employee_id?.[0] ||
          'Unable to create account with provided information.';

        setError(errorMessage);
        return;
      }

      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      onSignupSuccess(result.user || { 
        email: formData.email, 
        name: formData.name, 
        employeeId: formData.employeeId 
      });
    } catch (err) {
      setError('Something went wrong. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#0c1626] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#125ba1]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#38b000]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-white my-8">
        
        {/* Logo Container */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-lg border border-white/40 mb-3">
            <img 
              src={logo} 
              alt="NavaPack Logo" 
              className="h-9 w-auto object-contain mx-auto"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Create Admin Account
          </h1>
          <p className="text-xs text-slate-300/80 font-medium tracking-wide mt-1">
            Fill in your employee details to request system access
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div role="alert" className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3.5 text-xs font-medium backdrop-blur-sm text-center">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={submit} className="space-y-4">
          
          {/* Employee Name & ID Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:bg-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Employee ID
              </label>
              <input
                required
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:bg-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
                placeholder="NP-2026-04"
              />
            </div>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              required
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 bg-[#0c1626] px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all cursor-pointer"
            >
              <option value="" disabled>Select Department</option>
              <option value="manufacturing">Manufacturing & Production</option>
              <option value="quality">Quality Assurance</option>
              <option value="sales">Sales & Custom Quotes</option>
              <option value="logistics">Supply Chain & Logistics</option>
              <option value="administration">Management / Admin</option>
            </select>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Work Email
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:bg-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
              placeholder="john.doe@navapack.com"
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-slate-400 focus:bg-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-slate-400 focus:bg-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-[#125ba1] to-[#38b000] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 text-white py-3.5 font-bold text-sm cursor-pointer shadow-lg shadow-emerald-950/50"
          >
            {loading ? 'Creating Account…' : 'Register Account'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-slate-300">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer ml-1"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};