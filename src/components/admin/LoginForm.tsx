// src/components/admin/LoginForm.jsx
import React, { useState } from 'react';
import { Loader } from 'lucide-react';

const LoginForm = ({ onLogin, error, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-board-ground flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-board-panel border border-board-line rounded-[4px] p-8">
        <div className="text-center mb-8">
          <h1 className="font-board text-4xl font-bold tracking-[0.08em] text-board-ink">CINEMA<span className="text-board-amberink">PLUS</span></h1>
          <p className="mt-2 font-data text-sm text-board-mute">Acceso solo para administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block font-data text-[11px] font-bold uppercase text-board-mute mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full min-h-[48px] px-3 py-2 bg-board-ground border border-board-line2 rounded-[3px] text-board-ink placeholder-board-mute focus:outline-none focus:border-board-amber"
              placeholder="admin@cinema.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-data text-[11px] font-bold uppercase text-board-mute mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full min-h-[48px] px-3 py-2 bg-board-ground border border-board-line2 rounded-[3px] text-board-ink placeholder-board-mute focus:outline-none focus:border-board-amber"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-board-alarmbg border border-board-alarm text-board-alarmink px-4 py-3 rounded-[3px]" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] bg-board-amber text-board-onamber font-board text-lg font-bold tracking-[0.08em] uppercase py-2 px-4 rounded-[3px] hover:bg-board-amberpress disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        {/* Footer opcional con información adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-board-mute">
            ¿Problemas para acceder? Contacta al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;