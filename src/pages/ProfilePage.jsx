// src/pages/ProfilePage.jsx - Con navegación mejorada
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, KeyIcon, ChartBarIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { authService, userService } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';

const ProfilePage = () => {
  // Estados principales
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados de modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Estados de formularios
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estados de estadísticas
  const [userStats, setUserStats] = useState(null);

  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        setProfile(response.data.data);
        setEditForm({
          first_name: response.data.data.first_name || '',
          last_name: response.data.data.last_name || '',
          email: response.data.data.email || ''
        });
      } catch (error) {
        console.error('Error cargando perfil:', error);
        showToast('Error al cargar el perfil', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [showToast]);

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const response = await userService.getStats();
      setUserStats(response.data.data);
      setShowStatsModal(true);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      showToast('Error al cargar las estadísticas', 'error');
    }
  };

  // Funciones de manejo
  const handleEditProfile = async () => {
    try {
      setSaving(true);
      const response = await userService.updateProfile(editForm);
      setProfile(response.data.data);
      updateUser(response.data.data);
      showToast('Perfil actualizado exitosamente', 'success');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      setSaving(true);
      await authService.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });
      showToast('Contraseña cambiada exitosamente', 'success');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      const message = error.response?.data?.message || 'Error al cambiar la contraseña';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      await userService.deleteAccount();
      showToast('Cuenta eliminada exitosamente', 'success');
      logout();
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      const message = error.response?.data?.message || 'Error al eliminar la cuenta';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-200">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb/Navigation mejorado */}
        <div className="mb-6">
          <Link
            to="/cars"
            className="inline-flex items-center text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver a Mis Autos
          </Link>
        </div>

        {/* Header mejorado */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-6 transition-colors duration-200">
            <UserIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors duration-200">
            Mi Perfil
          </h1>
          <p className="text-gray-600 dark:text-slate-300 transition-colors duration-200 font-medium">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Grid principal mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Información Personal mejorada */}
            <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-8 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center transition-colors duration-200">
                  <UserIcon className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
                  Información Personal
                </h2>
                <Button
                  onClick={() => setShowEditModal(true)}
                  variant="secondary"
                  size="sm"
                  className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  ✏️ Editar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
                    Nombre
                  </label>
                  <p className="text-gray-900 dark:text-slate-100 text-lg transition-colors duration-200">
                    {profile?.first_name || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
                    Apellido
                  </label>
                  <p className="text-gray-900 dark:text-slate-100 text-lg transition-colors duration-200">
                    {profile?.last_name || 'No especificado'}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
                  Email
                </label>
                <p className="text-gray-900 dark:text-slate-100 text-lg transition-colors duration-200">
                  {profile?.email || 'No disponible'}
                </p>
              </div>
            </div>

            {/* Información de Cuenta mejorada */}
            <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-8 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center transition-colors duration-200">
                📊 Información de Cuenta
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
                    Fecha de Registro
                  </label>
                  <p className="text-gray-900 dark:text-slate-100 transition-colors duration-200">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'No disponible'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
                    Estado de la Cuenta
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 transition-colors duration-200">
                    ✅ Activa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral mejorado */}
          <div className="space-y-6">
            {/* Navegación rápida */}
            <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center transition-colors duration-200">
                🚗 Navegación Rápida
              </h3>
              <div className="space-y-3">
                <Link
                  to="/cars"
                  className="flex items-center justify-start w-full p-3 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5,11L6.5,6.5H17.5L19,11H5M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
                  </svg>
                  Mis Autos
                </Link>
                <Link
                  to="/"
                  className="flex items-center justify-start w-full p-3 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                  </svg>
                  Página Principal
                </Link>
              </div>
            </div>

            {/* Seguridad mejorada */}
            <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center transition-colors duration-200">
                🔒 Seguridad
              </h3>
              <Button
                onClick={() => setShowPasswordModal(true)}
                variant="secondary"
                className="w-full justify-start bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                <KeyIcon className="h-5 w-5 mr-3" />
                Cambiar Contraseña
              </Button>
            </div>

            {/* Estadísticas mejoradas */}
            <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center transition-colors duration-200">
                📈 Estadísticas
              </h3>
              <Button
                onClick={loadStats}
                variant="secondary"
                className="w-full justify-start bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                <ChartBarIcon className="h-5 w-5 mr-3" />
                Ver Estadísticas
              </Button>
            </div>

            {/* Zona de Peligro mejorada */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 transition-colors duration-200">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-4 flex items-center transition-colors duration-200">
                ⚠️ Zona de Peligro
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4 transition-colors duration-200">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
              </p>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="danger"
                className="w-full justify-start transition-colors duration-200"
              >
                <TrashIcon className="h-5 w-5 mr-3" />
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </div>

        {/* Modales mejorados */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="✏️ Editar Perfil"
        >
          <div className="space-y-4">
            <Input
              label="Nombre"
              value={editForm.first_name}
              onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
            />
            <Input
              label="Apellido"
              value={editForm.last_name}
              onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
            />
            <Input
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={() => setShowEditModal(false)}
                variant="secondary"
                className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                Cancelar
              </Button>
              <Button onClick={handleEditProfile} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="🔐 Cambiar Contraseña"
        >
          <div className="space-y-4">
            <Input
              type="password"
              label="Contraseña actual"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
            />
            <Input
              type="password"
              label="Nueva contraseña"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
            />
            <Input
              type="password"
              label="Confirmar nueva contraseña"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={() => setShowPasswordModal(false)}
                variant="secondary"
                className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                Cancelar
              </Button>
              <Button onClick={handleChangePassword} disabled={saving}>
                {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="⚠️ Eliminar Cuenta"
        >
          <div>
            <p className="text-gray-600 dark:text-slate-300 mb-6 transition-colors duration-200">
              ¿Estás completamente seguro de que quieres eliminar tu cuenta?
              Esta acción no se puede deshacer y perderás todos tus datos permanentemente.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
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

        <Modal
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          title="📊 Mis Estadísticas"
          size="lg"
        >
          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl text-center border border-blue-200 dark:border-blue-800 transition-colors duration-200">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-200">
                  {userStats.total_cars || 0}
                </div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors duration-200">
                  Total Autos
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl text-center border border-green-200 dark:border-green-800 transition-colors duration-200">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 transition-colors duration-200">
                  {userStats.favorite_brand || 'N/A'}
                </div>
                <div className="text-sm font-medium text-green-700 dark:text-green-300 transition-colors duration-200">
                  Marca Favorita
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl text-center border border-purple-200 dark:border-purple-800 transition-colors duration-200">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-200">
                  {userStats.newest_car || 'N/A'}
                </div>
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300 transition-colors duration-200">
                  Auto Más Nuevo
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl text-center border border-orange-200 dark:border-orange-800 transition-colors duration-200">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2 transition-colors duration-200">
                  {userStats.oldest_car || 'N/A'}
                </div>
                <div className="text-sm font-medium text-orange-700 dark:text-orange-300 transition-colors duration-200">
                  Auto Más Antiguo
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;