// src/components/profile/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  User,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Trash2,
  AlertTriangle,
  Key,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

const UserProfile = ({ onClose }) => {
  const { user, updateProfile, changePassword, deleteAccount, logout, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Perfil actualizado correctamente');
        setIsEditing(false);
      } else {
        setErrors({ general: result.error });
      }
    } catch {
      setErrors({ general: 'Error al actualizar el perfil' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        setSuccess('Contraseña cambiada correctamente');
        setShowPasswordChange(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrors({ password: result.error });
      }
    } catch {
      setErrors({ password: 'Error al cambiar la contraseña' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount();
      if (result.success) {
        // Redirigir o cerrar después de eliminar
        onClose && onClose();
        await logout();
      } else {
        setErrors({ delete: result.error });
      }
    } catch {
      setErrors({ delete: 'Error al eliminar la cuenta' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8" />
            Mi Perfil
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">

          {/* Mensajes de estado */}
          {success && (
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
              {success}
            </div>
          )}

          {errors.general && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {errors.general}
            </div>
          )}

          {/* Información de la cuenta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Email (no editable) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white">{user.email}</span>
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Shield className="w-4 h-4" />
                Rol
              </label>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white capitalize">{user.role || 'Usuario'}</span>
              </div>
            </div>

            {/* Fecha de creación */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Calendar className="w-4 h-4" />
                Miembro desde
              </label>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white">{formatDate(user.createdAt)}</span>
              </div>
            </div>

            {/* Estado de la cuenta */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Clock className="w-4 h-4" />
                Estado
              </label>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-green-400">Activo</span>
              </div>
            </div>
          </div>

          {/* Formulario de edición de perfil */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Información Personal</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-blue-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Nombre</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 ${
                      isEditing ? 'focus:border-blue-500/50 focus:outline-none' : 'cursor-not-allowed opacity-60'
                    }`}
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Apellido */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Apellido</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 ${
                      isEditing ? 'focus:border-blue-500/50 focus:outline-none' : 'cursor-not-allowed opacity-60'
                    }`}
                    placeholder="Tu apellido"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/60">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 ${
                      isEditing ? 'focus:border-blue-500/50 focus:outline-none' : 'cursor-not-allowed opacity-60'
                    }`}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-green-300 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        phone: user.phone || ''
                      });
                      setErrors({});
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/30 rounded-lg text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Cambio de contraseña */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                Seguridad
              </h3>
              {!showPasswordChange && (
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 rounded-lg text-yellow-300 transition-colors"
                >
                  Cambiar Contraseña
                </button>
              )}
            </div>

            {showPasswordChange && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {errors.password && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {errors.password}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Contraseña Actual</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                    placeholder="Tu contraseña actual"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                      placeholder="Nueva contraseña"
                      required
                      minLength={6}
                    />
                    {errors.newPassword && (
                      <p className="text-red-300 text-sm">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Confirmar Contraseña</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
                      placeholder="Confirmar nueva contraseña"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-300 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-green-300 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setErrors({});
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/30 rounded-lg text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Zona de peligro - Eliminar cuenta */}
          <div className="border-t border-red-500/30 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-red-400">Zona de Peligro</h3>
            </div>

            <p className="text-white/60 mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor asegúrate de que realmente quieres hacer esto.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-6 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Cuenta
              </button>
            ) : (
              <div className="space-y-4">
                {errors.delete && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {errors.delete}
                  </div>
                )}

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-300 font-medium mb-3">
                    ¿Estás absolutamente seguro?
                  </p>
                  <p className="text-white/60 text-sm mb-4">
                    Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos los datos asociados.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {loading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setErrors({});
                      }}
                      className="px-6 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/30 rounded-lg text-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;