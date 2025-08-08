// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { userService, carService } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';

import {
  User,
  Calendar,
  Car,
  Shield,
  Edit,
  Save,
  X,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  Key
} from 'lucide-react';
import {Avatar, AvatarImage, AvatarFallback} from '../components/ui/avatar';

const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
      <div
          className={`
        backdrop-blur-xl bg-white/10 dark:bg-white/5
        border border-white/20 dark:border-white/10
        rounded-2xl shadow-2xl
        ${hover ? 'hover:bg-white/15 dark:hover:bg-white/10 hover:border-white/30 dark:hover:border-white/20 hover:shadow-3xl hover:-translate-y-1' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
          {...props}
      >
        {children}
      </div>
  );
};

const ShimmerEffect = ({ children, className = "" }) => {
  return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shimmer" />
        {children}
      </div>
  );
};

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profile, setProfile] = useState(null);

  // Separar nombre y apellido del usuario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Cargar datos del usuario
  useEffect(() => {
    loadUserProfile();
    loadUserStats();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      console.log('📡 Cargando perfil desde la API...');

      const response = await userService.getProfile();
      console.log('📦 Respuesta del perfil:', response.data);

      // Acceder a los datos como muestra Postman: response.data.data
      const userData = response.data.data;
      console.log('👤 Datos del usuario:', userData);

      setProfile(userData);

      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || ''
      });

      console.log('✅ Perfil cargado:', {
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        createdAt: userData.created_at
      });

    } catch (error) {
      console.error('❌ Error loading profile:', error);
      showToast('Error al cargar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      // Cargar estadísticas reales de la API
      const [carsResponse, statsResponse] = await Promise.all([
        carService.getAll(),
        carService.getStats().catch(() => null) // En caso de que no exista endpoint de stats
      ]);

      const cars = carsResponse.data.data || [];
      const vintageCars = cars.filter(car => new Date().getFullYear() - car.year >= 25).length;

      setUserStats({
        totalCars: cars.length,
        vintageCars,
        newestCar: cars.length > 0 ? Math.max(...cars.map(car => car.year)) : null,
        oldestCar: cars.length > 0 ? Math.min(...cars.map(car => car.year)) : null,
        joinDate: user?.createdAt ? new Date(user.createdAt) : new Date()
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';

    try {
      // El backend devuelve: "2025-08-02 00:19:56"
      // Convertir a formato ISO para JavaScript
      const isoString = dateString.replace(' ', 'T') + 'Z';
      const date = new Date(isoString);

      if (isNaN(date.getTime())) {
        console.log('📅 Fecha inválida:', dateString);
        return 'Fecha inválida';
      }

      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);

    } catch (error) {
      console.error('📅 Error formateando fecha:', error);
      return 'Error en fecha';
    }
  };

  const getInitials = () => {
    const firstName = profile?.first_name || formData.firstName || '';
    const lastName = profile?.last_name || formData.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'NN';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };

      console.log('📤 Enviando datos de actualización:', updateData);

      const response = await userService.updateProfile(updateData);
      console.log('✅ Respuesta de actualización:', response.data);

      // Actualizar el perfil local con la respuesta
      setProfile(response.data.data);

      // También actualizar el contexto si es necesario
      updateUser({
        ...user,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email
      });

      showToast('Perfil actualizado exitosamente', 'success');
      setEditing(false);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

const handleCancel = () => {
  setFormData({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: profile?.email || ''
  });
  setEditing(false);
};

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validaciones del frontend
    if (!passwordData.currentPassword) {
      showToast('La contraseña actual es requerida', 'error');
      return;
    }

    if (!passwordData.newPassword) {
      showToast('La nueva contraseña es requerida', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      showToast('La nueva contraseña debe ser diferente a la actual', 'error');
      return;
    }

    try {
      setLoading(true);

      console.log('🔄 Iniciando cambio de contraseña...');

      const passwordChangeData = {
        currentPassword: passwordData.currentPassword.trim(),
        newPassword: passwordData.newPassword.trim(),
        confirmPassword: passwordData.newPassword.trim() // Debe ser igual a newPassword
      };

      console.log('📤 Enviando datos:', {
        currentPassword: '***',
        newPassword: '***',
        confirmPassword: '***'
      });

      const response = await userService.changePassword(passwordChangeData);

      console.log('✅ Respuesta del servidor:', response.data);

      // Verificar si la respuesta es exitosa
      if (response.data.success) {
        showToast('Contraseña cambiada exitosamente', 'success');

        // Limpiar el formulario
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showToast(response.data.message || 'Error al cambiar la contraseña', 'error');
      }

    } catch (error) {
      console.error('❌ Error changing password:', error);
      console.error('📄 Error response:', error.response);

      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al cambiar la contraseña';

      if (error.response) {
        // El servidor respondió con un error
        const { status, data } = error.response;

        if (status === 400) {
          errorMessage = data.message || 'Datos de contraseña inválidos';
        } else if (status === 401) {
          errorMessage = 'La contraseña actual es incorrecta';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para cambiar la contraseña';
        } else {
          errorMessage = data.message || `Error del servidor (${status})`;
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor';
      }

      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      showToast('Cuenta eliminada exitosamente', 'success');
      logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      showToast('Error al eliminar la cuenta', 'error');
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 relative overflow-hidden">
        {/* Efectos de fondo animados */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Botón Volver */}
          <div className="mb-6">
            <Button
                asChild
                variant="ghost"
                size="sm"
                className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
            >
                <Link to="/cars">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mis Autos
                </Link>
            </Button>
          </div>

          {/* Header con Avatar */}
          <div className="text-center mb-8">
            <Avatar className="size-24 mx-auto mb-4 ring-4 ring-white/20 dark:ring-white/10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
              Mi Perfil
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Gestiona tu información personal y configuraciones
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Información Personal */}
            <div className="lg:col-span-2 space-y-6">

              {/* Información Personal */}
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                    <User className="w-6 h-6 mr-3 text-blue-500" />
                    Información Personal
                  </h2>

                  {!editing && (
                      <Button
                          onClick={() => setEditing(true)}
                          variant="ghost"
                          size="sm"
                          className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                  )}
                </div>

                {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Nombre
                          </label>
                          <Input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 backdrop-blur-sm"
                              required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Apellido
                          </label>
                          <Input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 backdrop-blur-sm"
                              required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email
                        </label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 backdrop-blur-sm"
                            required
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="flex-1"
                        >
                          {loading ? (
                              <LoadingSpinner size="sm" className="mr-2" />
                          ) : (
                              <Save className="w-4 h-4 mr-2" />
                          )}
                          Guardar Cambios
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                            className="flex-1 backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Nombre</p>
                          <p className="font-medium text-slate-800 dark:text-slate-100">{profile?.first_name || 'No especificado'}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Apellido</p>
                          <p className="font-medium text-slate-800 dark:text-slate-100">{profile?.last_name || 'No especificado'}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{user?.email}</p>
                      </div>
                    </div>
                )}
              </GlassCard>

              {/* Información de Cuenta */}
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center mb-6">
                  <Calendar className="w-6 h-6 mr-3 text-green-500" />
                  Información de Cuenta
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Fecha de Registro</p>
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {formatDate(profile?.created_at)}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Estado de la Cuenta</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium text-green-600 dark:text-green-400">Activa</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Zona de Peligro */}
              <GlassCard className="p-8 border-red-500/20 dark:border-red-400/20">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center mb-6">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Zona de Peligro
                </h2>

                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
                  </p>

                  {!showDeleteConfirm ? (
                      <Button
                          onClick={() => setShowDeleteConfirm(true)}
                          variant="danger"
                          className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Cuenta
                      </Button>
                  ) : (
                      <div className="space-y-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                          ¿Estás seguro? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                          <Button
                              onClick={handleDeleteAccount}
                              variant="danger"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Sí, Eliminar Cuenta
                          </Button>
                          <Button
                              onClick={() => setShowDeleteConfirm(false)}
                              variant="ghost"
                              size="sm"
                              className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">

              {/* Mi Colección */}
              {userStats && (
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                      <Car className="w-5 h-5 mr-2 text-blue-500" />
                      Mi Colección
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Total de autos</span>
                        <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      {userStats.totalCars}
                    </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Autos clásicos</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {userStats.vintageCars}
                    </span>
                      </div>

                      {userStats.newestCar && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Más nuevo</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {userStats.newestCar}
                      </span>
                          </div>
                      )}

                      {userStats.oldestCar && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Más antiguo</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {userStats.oldestCar}
                      </span>
                          </div>
                      )}
                    </div>
                  </GlassCard>
              )}

              {/* Seguridad */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Seguridad
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Autenticación JWT</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                    Activa
                  </span>
                  </div>

                  {!showChangePassword ? (
                      <Button
                          onClick={() => setShowChangePassword(true)}
                          variant="outline"
                          size="sm"
                          className="w-full backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Cambiar Contraseña
                      </Button>
                  ) : (
                      <form onSubmit={handlePasswordSubmit} className="space-y-3">
                        <Input
                            type="password"
                            name="currentPassword"
                            placeholder="Contraseña actual"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 backdrop-blur-sm"
                            required
                        />
                        <Input
                            type="password"
                            name="newPassword"
                            placeholder="Nueva contraseña"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 backdrop-blur-sm"
                            required
                        />
                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 backdrop-blur-sm"
                            required
                        />

                        <div className="flex gap-2">
                          <Button
                              type="submit"
                              variant="primary"
                              size="sm"
                              disabled={loading}
                              className="flex-1"
                          >
                            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar
                          </Button>
                          <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowChangePassword(false);
                                setPasswordData({
                                  currentPassword: '',
                                  newPassword: '',
                                  confirmPassword: ''
                                });
                              }}
                              className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </form>
                  )}
                </div>
              </GlassCard>

              {/* Acciones Rápidas */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Acciones Rápidas
                </h3>

                <div className="space-y-3">
                  <ShimmerEffect>
                    <Button
                        asChild
                        variant="primary"
                        size="sm"
                        className="w-full justify-center"
                    >
                       <Link to="/cars">
                      <Car className="w-4 h-4 mr-2" />
                      Ver Mis Autos
                       </Link>
                    </Button>
                  </ShimmerEffect>

                  <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
                  >
                    Exportar Datos
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;
