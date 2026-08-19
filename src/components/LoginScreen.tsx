import React, { useState } from 'react';
// Import the logo image directly from your assets folder:
import logo from '../../assets/Nava-logo.png';

interface User {
  id?: number;
  email: string;
  role?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  employeeId?: string
  department?: string;
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onNavigateToSignup?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://navapack-backend.azurewebsites.net/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.non_field_errors?.[0] ||
          result.detail ||
          result.email?.[0] ||
          result.password?.[0] ||
          'Unable to sign in with provided credentials.';

        setError(errorMessage);
        return;
      }

      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      onLogin(result.user || { email });
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
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-white">
        
        {/* Logo Container */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-lg border border-white/40 mb-3">
            <img 
              src={logo} 
              alt="NavaPack Logo" 
              className="h-10 w-auto object-contain mx-auto"
            />
          </div>

          <p className="text-xs text-slate-300/80 font-medium tracking-wide mt-2">
            Admin Portal Management
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
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:bg-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
              placeholder="admin@navapack.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Please contact your administrator.');
                }}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot?
              </a>
            </div>

            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-slate-400 focus:bg-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-[#125ba1] to-[#38b000] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 text-white py-3.5 font-bold text-sm cursor-pointer shadow-lg shadow-emerald-950/50"
          >
            {loading ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400">
            Protected area • Internal system authorization required
          </p>
          
          {/* Sign Up Link */}
          <p className="text-[11px] text-slate-400 mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};