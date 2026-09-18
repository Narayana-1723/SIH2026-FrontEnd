import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Building2, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { DEMO_USERS } from '../../data/demoData';
import { IS_DEMO_MODE } from '../../utils/constants';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('EMP-40892');
  const [password, setPassword] = useState('GovSecure@2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/user/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both Employee ID / Email and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const user = await login({ username, password });
      showToast('success', 'Authentication Successful', `Welcome, ${user.name} (${user.cpse})`);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from === '/login' ? '/user/dashboard' : from, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.');
      showToast('error', 'Login Failed', 'Invalid credentials or authorization revoked.');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (empId: string) => {
    const usr = DEMO_USERS.find((u) => u.employeeId === empId);
    if (usr) {
      setUsername(usr.employeeId);
      setPassword('GovSecure@2026');
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Login Card */}
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gov-navy px-8 py-6 text-center border-b-4 border-amber-500 text-white">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-amber-400 mb-3 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="text-[11px] uppercase tracking-widest text-amber-400 font-bold">
            Government of India &bull; CPSE Consortium
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Material Harmonization Portal
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Single Sign-On Authentication Gateway
          </p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Employee ID or Official Email <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. EMP-40892 or name@ongc.res.in"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-navy focus:border-transparent font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Secure Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter authorized password"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-navy focus:border-transparent"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Demo Credentials Switcher */}
          {IS_DEMO_MODE && (
            <div className="pt-4 border-t border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Test Credentials (Evaluation Mode)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('EMP-40892')}
                  className={`p-2 text-left rounded border text-[11px] transition-colors ${
                    username === 'EMP-40892'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>ONGC User</span>
                    {username === 'EMP-40892' && <Check className="w-3 h-3 text-blue-700" />}
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">EMP-40892</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('ADM-10021')}
                  className={`p-2 text-left rounded border text-[11px] transition-colors ${
                    username === 'ADM-10021'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Gov Admin</span>
                    {username === 'ADM-10021' && <Check className="w-3 h-3 text-blue-700" />}
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">ADM-10021</div>
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Card Footer */}
        <div className="px-8 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-bit TLS Encrypted
          </span>
          <span>Version 1.0 &bull; 2026</span>
        </div>
      </div>
    </div>
  );
};
