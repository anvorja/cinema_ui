// src/pages/ProfilePage.jsx
import { useState, useEffect, useCallback } from 'react'; // Agregar useCallback
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  KeyIcon,
  TrashIcon,
  ChartBarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';
import { userService } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import {useAuth} from "../hooks/useAuth.js";

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Estados del perfil
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados de formularios
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estados de modales
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Estado de estadísticas
  const [userStats, setUserStats] = useState(null);

  // Cargar datos del perfil - con useCallback para evitar warnings
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      const userData = response.data.data;
      setProfile(userData);
      setProfileForm({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || ''
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
      showToast('Error al cargar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]); // showToast como dependencia

  // useEffect para cargar datos iniciales
  useEffect(() => {
    loadProfile();
  }, [loadProfile]); // loadProfile como dependencia

  // Cargar estadísticas del usuario
  const loadUserStats = async () => {
    try {
      const response = await userService.getStats();
      setUserStats(response.data.data);
      setShowStatsModal(true);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      showToast('Error al cargar las estadísticas', 'error');
    }
  };

  // Actualizar perfil
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      await userService.updateProfile({
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        email: profileForm.email
      });

      showToast('Perfil actualizado exitosamente', 'success');
      updateUser({ ...user, ...profileForm });
      setEditMode(false);
      loadProfile();
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    try {
      setSaving(true);
      await userService.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });

      showToast('Contraseña cambiada exitosamente', 'success');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      const message = error.response?.data?.message || 'Error al cambiar la contraseña';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar cuenta
  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      await userService.deleteAccount();
      showToast('Cuenta eliminada exitosamente', 'success');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      const message = error.response?.data?.message || 'Error al eliminar la cuenta';
      showToast(message, 'error');
      setSaving(false);
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setProfileForm({
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      email: profile.email || ''
    });
    setEditMode(false);
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            👤 Mi Perfil
          </h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel principal */}
          <div className="lg:col-span-2">
            {/* Información Personal */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <UserIcon className="h-6 w-6 mr-2 text-primary-600" />
                  Información Personal
                </h2>
                {!editMode ? (
                    <Button
                        onClick={() => setEditMode(true)}
                        variant="secondary"
                        size="sm"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                ) : (
                    <div className="flex space-x-2">
                      <Button
                          onClick={handleUpdateProfile}
                          disabled={saving}
                          size="sm"
                      >
                        <CheckIcon className="h-4 w-4 mr-1" />
                        {saving ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button
                          onClick={handleCancelEdit}
                          variant="secondary"
                          size="sm"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  {editMode ? (
                      <Input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm(prev => ({
                            ...prev,
                            firstName: e.target.value
                          }))}
                          placeholder="Tu nombre"
                      />
                  ) : (
                      <p className="text-gray-900 py-2">
                        {profile?.first_name || 'No especificado'}
                      </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  {editMode ? (
                      <Input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm(prev => ({
                            ...prev,
                            lastName: e.target.value
                          }))}
                          placeholder="Tu apellido"
                      />
                  ) : (
                      <p className="text-gray-900 py-2">
                        {profile?.last_name || 'No especificado'}
                      </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {editMode ? (
                      <Input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({
                            ...prev,
                            email: e.target.value
                          }))}
                          placeholder="tu@email.com"
                      />
                  ) : (
                      <p className="text-gray-900 py-2">
                        {profile?.email}
                      </p>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Cuenta */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                📊 Información de Cuenta
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Registro
                  </label>
                  <p className="text-gray-900">
                    {profile?.created_at ?
                        new Date(profile.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) :
                        'No disponible'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de la Cuenta
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Activa
                </span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Acciones de Seguridad */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔒 Seguridad
              </h3>
              <div className="space-y-3">
                <Button
                    onClick={() => setShowPasswordModal(true)}
                    variant="secondary"
                    className="w-full justify-start"
                >
                  <KeyIcon className="h-5 w-5 mr-2" />
                  Cambiar Contraseña
                </Button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📈 Estadísticas
              </h3>
              <div className="space-y-3">
                <Button
                    onClick={loadUserStats}
                    variant="secondary"
                    className="w-full justify-start"
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Ver Estadísticas
                </Button>
              </div>
            </div>

            {/* Zona de Peligro */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">
                ⚠️ Zona de Peligro
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
              </p>
              <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="danger"
                  className="w-full justify-start"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </div>

        {/* Modal para cambiar contraseña */}
        <Modal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            title="🔐 Cambiar Contraseña"
        >
          <div className="space-y-4">
            <Input
                type="password"
                placeholder="Contraseña actual"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
            />
            <Input
                type="password"
                placeholder="Nueva contraseña"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
            />
            <Input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                  onClick={() => setShowPasswordModal(false)}
                  variant="secondary"
              >
                Cancelar
              </Button>
              <Button
                  onClick={handleChangePassword}
                  disabled={saving}
              >
                {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal para eliminar cuenta */}
        <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="⚠️ Eliminar Cuenta"
        >
          <div>
            <p className="text-gray-600 mb-6">
              ¿Estás completamente seguro de que quieres eliminar tu cuenta?
              Esta acción no se puede deshacer y perderás todos tus datos permanentemente.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="secondary"
              >
                Cancelar
              </Button>
              <Button
                  onClick={handleDeleteAccount}
                  variant="danger"
                  disabled={saving}
              >
                {saving ? 'Eliminando...' : 'Sí, Eliminar Cuenta'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal de estadísticas */}
        <Modal
            isOpen={showStatsModal}
            onClose={() => setShowStatsModal(false)}
            title="📊 Mis Estadísticas"
            size="lg"
        >
          {userStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userStats.total_cars || 0}
                  </div>
                  <div className="text-sm text-blue-700">Total Autos</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userStats.favorite_brand || 'N/A'}
                  </div>
                  <div className="text-sm text-green-700">Marca Favorita</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userStats.newest_car || 'N/A'}
                  </div>
                  <div className="text-sm text-purple-700">Auto Más Nuevo</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userStats.oldest_car || 'N/A'}
                  </div>
                  <div className="text-sm text-orange-700">Auto Más Antiguo</div>
                </div>
              </div>
          )}
        </Modal>
      </div>
  );
};

export default ProfilePage;