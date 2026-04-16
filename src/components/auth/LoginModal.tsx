// src/components/auth/LoginModal.tsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import useAuth from "../../hooks/useAuth.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email.trim()) { setErrors({ general: 'El email es requerido' }); return; }
    if (!formData.password)     { setErrors({ general: 'La contraseña es requerida' }); return; }

    const result = await login({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    if (result.success) {
      toast.success(`¡Bienvenido, ${result.user.firstName || result.user.name}!`);
      setTimeout(onClose, 300);
    } else {
      toast.error(result.error);
      setErrors({ general: result.error });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/[0.12] text-white shadow-2xl shadow-black/60 max-w-md [&>button]:text-white/50 [&>button]:hover:text-white">
        <DialogHeader className="pb-2 border-b border-white/[0.08]">
          <DialogTitle className="text-2xl font-bold text-white">Iniciar Sesión</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errors.general && (
            <div className="p-3 bg-red-500/15 border border-red-500/25 rounded-lg text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-white/50">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors text-sm"
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-white/50">
              <Lock className="w-4 h-4" /> Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors text-sm pr-10"
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all text-sm shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Iniciando sesión...
              </span>
            ) : 'Iniciar Sesión'}
          </button>

          <div className="text-center pt-3 border-t border-white/[0.08]">
            <p className="text-white/50 text-sm">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { LoginModal };
