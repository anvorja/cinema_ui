// src/pages/SettingsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  UserIcon,
  KeyIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';

const SettingsPage = () => {
  const { user, updateProfile, changePassword } = useAuth();

  // ── Perfil ─────────────────────────────────────────────────────────────────
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phone: '' });
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || user.firstName || '',
        lastName: user.last_name || user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const clearMsg = (setter) => setTimeout(() => setter({ type: '', text: '' }), 5000);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      setProfileMsg({ type: 'error', text: 'El nombre y apellido son obligatorios.' });
      clearMsg(setProfileMsg);
      return;
    }
    setProfileSubmitting(true);
    const result = await updateProfile(profileData);
    setProfileSubmitting(false);
    if (result.success) {
      setProfileEditing(false);
      setProfileMsg({ type: 'success', text: result.message || 'Perfil actualizado.' });
    } else {
      setProfileMsg({ type: 'error', text: result.error });
    }
    clearMsg(setProfileMsg);
  };

  const handleProfileCancel = () => {
    setProfileEditing(false);
    setProfileData({
      firstName: user?.first_name || user?.firstName || '',
      lastName: user?.last_name || user?.lastName || '',
      phone: user?.phone || '',
    });
    setProfileMsg({ type: '', text: '' });
  };

  // ── Contraseña ─────────────────────────────────────────────────────────────
  const [pwData, setPwData] = useState({ current: '', new: '', confirm: '' });
  const [pwShow, setPwShow] = useState({ current: false, new: false, confirm: false });
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!pwData.current) {
      setPwMsg({ type: 'error', text: 'Ingresa tu contraseña actual.' });
      clearMsg(setPwMsg);
      return;
    }
    if (pwData.new.length < 6) {
      setPwMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      clearMsg(setPwMsg);
      return;
    }
    if (pwData.new !== pwData.confirm) {
      setPwMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
      clearMsg(setPwMsg);
      return;
    }
    setPwSubmitting(true);
    const result = await changePassword(pwData.current, pwData.new);
    setPwSubmitting(false);
    if (result.success) {
      setPwData({ current: '', new: '', confirm: '' });
      setPwMsg({ type: 'success', text: result.message || 'Contraseña actualizada.' });
    } else {
      setPwMsg({ type: 'error', text: result.error });
    }
    clearMsg(setPwMsg);
  };

  if (!user) return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Cog6ToothIcon className="w-7 h-7 text-gray-400" />
              Configuración
            </h1>
            <p className="text-white/50 text-sm mt-0.5">Administra tu perfil y seguridad</p>
          </div>
        </div>

        {/* ── Sección: Información Personal ── */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-400" />
              Información Personal
            </h2>
            {!profileEditing && (
              <button
                onClick={() => setProfileEditing(true)}
                className="px-3 py-1.5 text-xs font-medium bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/25 rounded-lg text-blue-300 transition-colors"
              >
                Editar
              </button>
            )}
          </div>

          {/* Feedback */}
          {profileMsg.text && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
              profileMsg.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                : 'bg-red-500/10 border border-red-500/20 text-red-300'
            }`}>
              {profileMsg.type === 'success'
                ? <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                : <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />}
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <div className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/50 text-sm cursor-not-allowed">
                {user.email}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Nombre *</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={e => setProfileData(p => ({ ...p, firstName: e.target.value }))}
                  disabled={!profileEditing}
                  className={`w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 transition-colors ${
                    profileEditing ? 'focus:border-blue-500/50 focus:outline-none' : 'opacity-60 cursor-not-allowed'
                  }`}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Apellido *</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={e => setProfileData(p => ({ ...p, lastName: e.target.value }))}
                  disabled={!profileEditing}
                  className={`w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 transition-colors ${
                    profileEditing ? 'focus:border-blue-500/50 focus:outline-none' : 'opacity-60 cursor-not-allowed'
                  }`}
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1">
                <PhoneIcon className="w-3.5 h-3.5" />
                Teléfono
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
                disabled={!profileEditing}
                className={`w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 transition-colors ${
                  profileEditing ? 'focus:border-blue-500/50 focus:outline-none' : 'opacity-60 cursor-not-allowed'
                }`}
                placeholder="Tu número de teléfono"
              />
            </div>

            {profileEditing && (
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-green-300 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  {profileSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={handleProfileCancel}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        </section>

        {/* ── Sección: Seguridad ── */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-semibold flex items-center gap-2 mb-5">
            <KeyIcon className="w-5 h-5 text-yellow-400" />
            Seguridad — Cambiar contraseña
          </h2>

          {/* Feedback */}
          {pwMsg.text && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
              pwMsg.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                : 'bg-red-500/10 border border-red-500/20 text-red-300'
            }`}>
              {pwMsg.type === 'success'
                ? <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                : <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />}
              {pwMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSave} className="space-y-4">
            {[
              { key: 'current', label: 'Contraseña actual' },
              { key: 'new',     label: 'Nueva contraseña' },
              { key: 'confirm', label: 'Confirmar nueva contraseña' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-white/60 mb-1.5">{field.label} *</label>
                <div className="relative">
                  <input
                    type={pwShow[field.key] ? 'text' : 'password'}
                    value={pwData[field.key]}
                    onChange={e => setPwData(p => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:border-yellow-500/50 focus:outline-none transition-colors"
                    placeholder={field.key === 'current' ? 'Tu contraseña actual' : field.key === 'new' ? 'Mínimo 6 caracteres' : 'Repite la nueva contraseña'}
                    minLength={field.key !== 'current' ? 6 : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setPwShow(p => ({ ...p, [field.key]: !p[field.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {pwShow[field.key] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button
                type="submit"
                disabled={pwSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 rounded-lg text-yellow-300 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <KeyIcon className="w-4 h-4" />
                {pwSubmitting ? 'Actualizando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;
