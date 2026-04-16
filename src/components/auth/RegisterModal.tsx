// src/components/auth/RegisterModal.tsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import useAuth from "../../hooks/useAuth.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    const result = await register(formData);
    if (result.success) {
      toast.success('¡Cuenta creada exitosamente!');
      onClose();
    } else {
      setErrors({ general: result.error });
    }
  };

  const field = (
    name: string,
    label: string,
    icon: React.ReactNode,
    type = 'text',
    placeholder = '',
    extra?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-white/50">
        {icon} {label}
      </label>
      <input
        type={type}
        value={formData[name]}
        onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
        className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors text-sm"
        placeholder={placeholder}
        required
        {...extra}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/[0.12] text-white shadow-2xl shadow-black/60 max-w-md max-h-[90vh] overflow-y-auto [&>button]:text-white/50 [&>button]:hover:text-white">
        <DialogHeader className="pb-2 border-b border-white/[0.08]">
          <DialogTitle className="text-2xl font-bold text-white">Crear Cuenta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errors.general && (
            <div className="p-3 bg-red-500/15 border border-red-500/25 rounded-lg text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            {field('firstName', 'Nombre',   <User className="w-4 h-4" />, 'text', 'Tu nombre')}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/50">Apellido</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors text-sm"
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          {field('email', 'Email',    <Mail  className="w-4 h-4" />, 'email', 'tu@email.com')}
          {field('phone', 'Teléfono', <Phone className="w-4 h-4" />, 'tel',   '3001234567')}

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
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/50">Confirmar Contraseña</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors text-sm"
              placeholder="Repite tu contraseña"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all text-sm shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <div className="text-center pt-3 border-t border-white/[0.08]">
            <p className="text-white/50 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { RegisterModal };
