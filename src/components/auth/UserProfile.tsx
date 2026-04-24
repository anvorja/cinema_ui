// src/components/auth/UserProfile.jsx
import { useState, useEffect } from 'react';
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
  Clock,
  Eye,
  EyeOff,
  ShoppingBag,
  XCircle,
  Loader
} from 'lucide-react';
import useAuth from "../../hooks/useAuth.js";
import { purchaseService, getErrorMessage } from '../../services/api.js';

const UserProfile = ({ onClose }) => {
  const {
    user,
    updateProfile,
    changePassword,
    deleteAccount,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Historial de compras
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.first_name || '',
        lastName: user.lastName || user.last_name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Cargar historial de compras
  useEffect(() => {
    if (!user) return;
    setPurchasesLoading(true);
    purchaseService.getMyPurchases({ limit: 20 })
      .then(data => setPurchases(Array.isArray(data) ? data : []))
      .catch(() => setPurchases([]))
      .finally(() => setPurchasesLoading(false));
  }, [user]);

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (success || Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setSuccess('');
        setErrors({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, errors]);

  // Manejar actualización de perfil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    setIsSubmitting(true);

    // Validaciones básicas
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrors({ general: 'El nombre y apellido son obligatorios' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess(result.message || 'Perfil actualizado correctamente');
        setIsEditing(false);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setErrors({ general: 'Error al actualizar el perfil' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cambio de contraseña
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    setIsSubmitting(true);

    // Validaciones
    if (!passwordData.currentPassword) {
      setErrors({ currentPassword: 'La contraseña actual es obligatoria' });
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'La contraseña debe tener al menos 6 caracteres' });
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        setSuccess(result.message || 'Contraseña cambiada correctamente');
        setShowPasswordChange(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrors({ password: result.error });
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      setErrors({ password: 'Error al cambiar la contraseña' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar eliminación de cuenta
  const handleDeleteAccount = async () => {
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await deleteAccount();
      if (result.success) {
        // La cuenta se eliminó exitosamente
        if (onClose) onClose();
        // El AuthProvider ya manejó el logout automático
      } else {
        setErrors({ delete: result.error });
      }
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      setErrors({ delete: 'Error al eliminar la cuenta' });
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setSuccess('');
    // Restaurar datos originales
    setFormData({
      firstName: user.firstName || user.first_name || '',
      lastName: user.lastName || user.last_name || '',
      phone: user.phone || ''
    });
  };

  // Cancelar cambio de contraseña
  const handleCancelPasswordChange = () => {
    setShowPasswordChange(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setSuccess('');
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCancelPurchase = async (purchaseId) => {
    setCancellingId(purchaseId);
    try {
      await purchaseService.cancel(purchaseId);
      setPurchases(prev =>
        prev.map(p => p.id === purchaseId ? { ...p, status: 'cancelled' } : p)
      );
      setSuccess('Compra cancelada exitosamente');
    } catch (error) {
      setErrors({ general: getErrorMessage(error) });
    } finally {
      setCancellingId(null);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

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
                <span className="text-white capitalize">{user.role || 'Customer'}</span>
              </div>
            </div>

            {/* Fecha de creación */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Calendar className="w-4 h-4" />
                Miembro desde
              </label>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-white">{formatDate(user.created_at || user.createdAt)}</span>
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
                  <label className="text-sm font-medium text-white/60">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 ${
                      isEditing ? 'focus:border-blue-500/50 focus:outline-none' : 'cursor-not-allowed opacity-60'
                    } ${errors.firstName ? 'border-red-500/50' : ''}`}
                    placeholder="Tu nombre"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm">{errors.firstName}</p>
                  )}
                </div>

                {/* Apellido */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 ${
                      isEditing ? 'focus:border-blue-500/50 focus:outline-none' : 'cursor-not-allowed opacity-60'
                    } ${errors.lastName ? 'border-red-500/50' : ''}`}
                    placeholder="Tu apellido"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm">{errors.lastName}</p>
                  )}
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
                    } ${errors.phone ? 'border-red-500/50' : ''}`}
                    placeholder="Tu número de teléfono"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Botones de edición */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-green-300 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/30 rounded-lg text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Sección de seguridad */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Seguridad</h3>

            {!showPasswordChange ? (
              <button
                onClick={() => setShowPasswordChange(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 rounded-lg text-yellow-300 transition-colors"
              >
                <Key className="w-4 h-4" />
                Cambiar Contraseña
              </button>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handlePasswordChange} className="space-y-4">

                  {errors.password && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                      {errors.password}
                    </div>
                  )}

                  {/* Contraseña actual */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">
                      Contraseña Actual *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`w-full p-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none ${
                          errors.currentPassword ? 'border-red-500/50' : ''
                        }`}
                        placeholder="Tu contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-400 text-sm">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* Nueva contraseña */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">
                      Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`w-full p-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none ${
                          errors.newPassword ? 'border-red-500/50' : ''
                        }`}
                        placeholder="Tu nueva contraseña"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-400 text-sm">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirmar nueva contraseña */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">
                      Confirmar Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full p-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none ${
                          errors.confirmPassword ? 'border-red-500/50' : ''
                        }`}
                        placeholder="Confirma tu nueva contraseña"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Botones de contraseña */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-green-300 transition-colors disabled:opacity-50"
                    >
                      <Key className="w-4 h-4" />
                      {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/30 rounded-lg text-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Mis Compras */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Mis Compras
            </h3>

            {purchasesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-white/60" />
              </div>
            ) : purchases.length === 0 ? (
              <p className="text-white/50 text-sm py-4">No tienes compras registradas.</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {purchases.map((p) => {
                  const statusColors = {
                    confirmed: 'text-green-400',
                    cancelled: 'text-red-400',
                    refunded: 'text-yellow-400',
                    pending: 'text-blue-400',
                  };
                  const isCancelled = p.status === 'cancelled' || p.status === 'refunded';
                  const movieTitle = p.movie?.title || p.movie_title || 'Película';
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{movieTitle}</p>
                        <p className="text-white/50 text-xs">
                          {p.quantity} boleta{p.quantity !== 1 ? 's' : ''} · {formatCurrency(p.total_amount)}
                          {' · '}
                          {new Date(p.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <span className={`text-xs font-medium capitalize ${statusColors[p.status] || 'text-white/60'}`}>
                          {p.status}
                        </span>
                      </div>
                      {!isCancelled && (
                        <button
                          onClick={() => handleCancelPurchase(p.id)}
                          disabled={cancellingId === p.id}
                          className="ml-3 flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-red-400 text-xs transition-colors disabled:opacity-50 flex-shrink-0"
                          title="Cancelar compra"
                        >
                          {cancellingId === p.id ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          Cancelar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Zona de peligro */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Zona de Peligro</h3>
            </div>

            <p className="text-white/60 text-sm mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor asegúrate de que
              realmente quieres hacer esto.
            </p>

            {errors.delete && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 mb-4">
                {errors.delete}
              </div>
            )}

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Cuenta
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-300 font-semibold mb-2">¿Estás seguro?</h4>
                  <p className="text-red-300/80 text-sm mb-4">
                    Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
                    Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar Cuenta'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/30 rounded-lg text-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
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