// src/components/auth/UserProfile.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronRight,
} from 'lucide-react';
import useAuth from "../../hooks/useAuth.js";

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

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

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

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-board-ground/85 p-3 sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="perfil-titulo" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[4px] border border-board-line2 bg-board-panel" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-board-line bg-board-panel px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <User className="h-7 w-7 text-board-amberink" />
            <div>
              <h2 id="perfil-titulo" className="font-board text-3xl font-bold leading-none tracking-[0.06em] uppercase text-board-ink">Mi perfil</h2>
              <p className="mt-1 font-data text-xs text-board-mute">Tu cuenta, tus datos y tu seguridad</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-board-line2 text-board-ink2 hover:border-board-ink hover:text-board-ink"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="space-y-8 p-5 sm:p-6">

          {/* Mensajes de estado */}
          {success && (
            <div className="border border-board-ok/60 bg-board-okbg p-4 text-[15px] text-board-okink" role="status">
              {success}
            </div>
          )}

          {errors.general && (
            <div className="border border-board-alarm bg-board-alarmbg p-4 text-[15px] text-board-alarmink" role="alert">
              {errors.general}
            </div>
          )}

          {/* Información de la cuenta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Email (no editable) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <div className="p-3 bg-board-panel2 border border-board-line rounded-[3px]">
                <span className="font-data text-sm font-bold text-board-ink">{user.email}</span>
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                <Shield className="w-4 h-4" />
                Rol
              </label>
              <div className="p-3 bg-board-panel2 border border-board-line rounded-[3px]">
                <span className="font-data text-sm font-bold text-board-ink capitalize">{user.role || 'Customer'}</span>
              </div>
            </div>

            {/* Fecha de creación */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                <Calendar className="w-4 h-4" />
                Miembro desde
              </label>
              <div className="p-3 bg-board-panel2 border border-board-line rounded-[3px]">
                <span className="font-data text-sm font-bold text-board-ink">{formatDate(user.created_at || user.createdAt)}</span>
              </div>
            </div>

            {/* Estado de la cuenta */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                <Clock className="w-4 h-4" />
                Estado
              </label>
              <div className="p-3 bg-board-panel2 border border-board-line rounded-[3px]">
                <span className="font-data text-sm font-bold text-board-okink">Activo</span>
              </div>
            </div>
          </div>

          {/* Formulario de edición de perfil */}
          <div className="border-t border-board-line pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-board text-2xl font-bold tracking-wide uppercase text-board-ink">Información Personal</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex min-h-[44px] items-center gap-2 rounded-[3px] border border-board-amber px-4 font-board text-lg font-bold tracking-[0.08em] uppercase text-board-amberink hover:bg-board-amber hover:text-board-onamber"
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
                  <label className="font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-board-panel2 border border-board-line rounded-[3px] text-white placeholder-white/40 ${
                      isEditing ? 'focus:border-board-amber' : 'cursor-not-allowed opacity-60'
                    } ${errors.firstName ? '!border-board-alarm' : ''}`}
                    placeholder="Tu nombre"
                  />
                  {errors.firstName && (
                    <p className="text-board-alarmink text-sm">{errors.firstName}</p>
                  )}
                </div>

                {/* Apellido */}
                <div className="space-y-2">
                  <label className="font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-board-panel2 border border-board-line rounded-[3px] text-white placeholder-white/40 ${
                      isEditing ? 'focus:border-board-amber' : 'cursor-not-allowed opacity-60'
                    } ${errors.lastName ? '!border-board-alarm' : ''}`}
                    placeholder="Tu apellido"
                  />
                  {errors.lastName && (
                    <p className="text-board-alarmink text-sm">{errors.lastName}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    className={`w-full p-3 bg-board-panel2 border border-board-line rounded-[3px] text-white placeholder-white/40 ${
                      isEditing ? 'focus:border-board-amber' : 'cursor-not-allowed opacity-60'
                    } ${errors.phone ? '!border-board-alarm' : ''}`}
                    placeholder="Tu número de teléfono"
                  />
                  {errors.phone && (
                    <p className="text-board-alarmink text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Botones de edición */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex min-h-[44px] items-center gap-2 rounded-[3px] bg-board-amber px-6 font-board text-lg font-bold tracking-[0.08em] uppercase text-board-onamber hover:bg-board-amberpress disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex min-h-[44px] items-center gap-2 rounded-[3px] border border-board-line2 px-6 font-board text-lg font-bold tracking-[0.08em] uppercase text-board-ink2 hover:border-board-ink hover:text-board-ink"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Sección de seguridad */}
          <div className="border-t border-board-line pt-6">
            <h3 className="mb-4 font-board text-2xl font-bold tracking-wide uppercase text-board-ink">Seguridad</h3>

            {!showPasswordChange ? (
              <button
                onClick={() => setShowPasswordChange(true)}
                className="flex min-h-[44px] items-center gap-2 rounded-[3px] border border-board-amber px-4 font-board text-lg font-bold tracking-[0.08em] uppercase text-board-amberink hover:bg-board-amber hover:text-board-onamber"
              >
                <Key className="w-4 h-4" />
                Cambiar Contraseña
              </button>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handlePasswordChange} className="space-y-4">

                  {errors.password && (
                    <div className="border border-board-alarm bg-board-alarmbg p-3 text-[15px] text-board-alarmink" role="alert">
                      {errors.password}
                    </div>
                  )}

                  {/* Contraseña actual */}
                  <div className="space-y-2">
                    <label className="font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                      Contraseña Actual *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`min-h-[48px] w-full p-3 pr-12 bg-board-ground border border-board-line2 rounded-[3px] text-board-ink placeholder-board-mute focus:border-board-amber focus:outline-none ${
                          errors.currentPassword ? '!border-board-alarm' : ''
                        }`}
                        placeholder="Tu contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-board-mute hover:text-board-ink"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-board-alarmink text-sm">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* Nueva contraseña */}
                  <div className="space-y-2">
                    <label className="font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                      Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`min-h-[48px] w-full p-3 pr-12 bg-board-ground border border-board-line2 rounded-[3px] text-board-ink placeholder-board-mute focus:border-board-amber focus:outline-none ${
                          errors.newPassword ? '!border-board-alarm' : ''
                        }`}
                        placeholder="Tu nueva contraseña"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-board-mute hover:text-board-ink"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-board-alarmink text-sm">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirmar nueva contraseña */}
                  <div className="space-y-2">
                    <label className="font-data text-[11px] font-bold uppercase tracking-wide text-board-mute">
                      Confirmar Nueva Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`min-h-[48px] w-full p-3 pr-12 bg-board-ground border border-board-line2 rounded-[3px] text-board-ink placeholder-board-mute focus:border-board-amber focus:outline-none ${
                          errors.confirmPassword ? '!border-board-alarm' : ''
                        }`}
                        placeholder="Confirma tu nueva contraseña"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-board-mute hover:text-board-ink"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-board-alarmink text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Botones de contraseña */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex min-h-[44px] items-center gap-2 rounded-[3px] bg-board-amber px-6 font-board text-lg font-bold tracking-[0.08em] uppercase text-board-onamber hover:bg-board-amberpress disabled:opacity-50"
                    >
                      <Key className="w-4 h-4" />
                      {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      className="flex min-h-[44px] items-center gap-2 rounded-[3px] border border-board-line2 px-6 font-board text-lg font-bold tracking-[0.08em] uppercase text-board-ink2 hover:border-board-ink hover:text-board-ink"
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
          <div className="border-t border-board-line pt-6">
            <h3 className="mb-4 flex items-center gap-2 font-board text-2xl font-bold tracking-wide uppercase text-board-ink">
              <ShoppingBag className="w-5 h-5" />
              Mis Compras
            </h3>
            <Link
              to="/profile/purchases"
              onClick={onClose}
              className="flex items-center justify-between min-h-[64px] p-4 bg-board-panel2 hover:bg-board-line border border-board-line hover:border-board-line2 rounded-[3px] group"
            >
              <div>
                <p className="font-board text-xl font-bold tracking-wide uppercase text-board-ink">Ver historial de compras</p>
                <p className="mt-0.5 text-sm text-board-mute">Boletas, pagos, reembolsos y más</p>
              </div>
              <ChevronRight className="h-5 w-5 text-board-mute group-hover:text-board-amberink" />
            </Link>
            <Link
              to="/profile/payments"
              onClick={onClose}
              className="mt-3 flex items-center justify-between min-h-[64px] p-4 bg-board-panel2 hover:bg-board-line border border-board-line hover:border-board-line2 rounded-[3px] group"
            >
              <div>
                <p className="font-board text-xl font-bold tracking-wide uppercase text-board-ink">Ver historial de pagos</p>
                <p className="mt-0.5 text-sm text-board-mute">Pagos con Wompi y sus referencias cinemaplus</p>
              </div>
              <ChevronRight className="h-5 w-5 text-board-mute group-hover:text-board-amberink" />
            </Link>
          </div>

          {/* Zona de peligro */}
          <div className="border-t border-board-line pt-6">
            <div className="mb-4 flex items-center gap-2 text-board-alarmink">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-board text-2xl font-bold tracking-wide uppercase">Zona de peligro</h3>
            </div>

            <p className="mb-4 text-[15px] text-board-ink2">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor asegúrate de que
              realmente quieres hacer esto.
            </p>

            {errors.delete && (
              <div className="border border-board-alarm bg-board-alarmbg p-3 text-[15px] text-board-alarmink" role="alert mb-4">
                {errors.delete}
              </div>
            )}

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex min-h-[44px] items-center gap-2 rounded-[3px] border border-board-alarm px-4 font-board text-lg font-bold tracking-[0.08em] uppercase text-board-alarmink hover:bg-board-alarm hover:text-[#f4f1e8]"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Cuenta
              </button>
            ) : (
              <div className="space-y-4">
                <div className="border border-board-alarm bg-board-alarmbg p-4">
                  <h4 className="mb-2 font-board text-xl font-bold uppercase tracking-wide text-board-alarmink">¿Estás seguro?</h4>
                  <p className="mb-4 text-[15px] text-board-ink2">
                    Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
                    Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isSubmitting}
                      className="flex min-h-[44px] items-center gap-2 rounded-[3px] bg-board-alarm px-4 font-board text-lg font-bold tracking-[0.08em] uppercase text-[#f4f1e8] hover:bg-board-alarm disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar Cuenta'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex min-h-[44px] items-center gap-2 rounded-[3px] border border-board-line2 px-4 font-board text-lg font-bold tracking-[0.08em] uppercase text-board-ink2 hover:border-board-ink hover:text-board-ink"
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