// // src/pages/ProfilePage.jsx - Con navegación mejorada
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { UserIcon, KeyIcon, ChartBarIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
// import { useAuth } from '../hooks/useAuth';
// import { useToast } from '../hooks/useToast';
// import { authService, userService } from '../services/api';
// import Button from '../components/ui/Button';
// import Input from '../components/ui/Input';
// import LoadingSpinner from '../components/ui/LoadingSpinner';
// import Modal from '../components/ui/Modal';
//
// const ProfilePage = () => {
//   // Estados principales
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//
//   // Estados de modales
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showStatsModal, setShowStatsModal] = useState(false);
//
//   // Estados de formularios
//   const [editForm, setEditForm] = useState({
//     first_name: '',
//     last_name: '',
//     email: ''
//   });
//
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//
//   // Estados de estadísticas
//   const [userStats, setUserStats] = useState(null);
//
//   const { user, updateUser, logout } = useAuth();
//   const { showToast } = useToast();
//
//   // Cargar datos del perfil
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         setLoading(true);
//         const response = await userService.getProfile();
//         setProfile(response.data.data);
//         setEditForm({
//           first_name: response.data.data.first_name || '',
//           last_name: response.data.data.last_name || '',
//           email: response.data.data.email || ''
//         });
//       } catch (error) {
//         console.error('Error cargando perfil:', error);
//         showToast('Error al cargar el perfil', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     loadProfile();
//   }, [showToast]);
//
//   // Cargar estadísticas
//   const loadStats = async () => {
//     try {
//       const response = await userService.getStats();
//       setUserStats(response.data.data);
//       setShowStatsModal(true);
//     } catch (error) {
//       console.error('Error cargando estadísticas:', error);
//       showToast('Error al cargar las estadísticas', 'error');
//     }
//   };
//
//   // Funciones de manejo
//   const handleEditProfile = async () => {
//     try {
//       setSaving(true);
//       const response = await userService.updateProfile(editForm);
//       setProfile(response.data.data);
//       updateUser(response.data.data);
//       showToast('Perfil actualizado exitosamente', 'success');
//       setShowEditModal(false);
//     } catch (error) {
//       console.error('Error actualizando perfil:', error);
//       const message = error.response?.data?.message || 'Error al actualizar el perfil';
//       showToast(message, 'error');
//     } finally {
//       setSaving(false);
//     }
//   };
//
//   const handleChangePassword = async () => {
//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       showToast('Las contraseñas no coinciden', 'error');
//       return;
//     }
//
//     try {
//       setSaving(true);
//       await authService.changePassword({
//         current_password: passwordForm.currentPassword,
//         new_password: passwordForm.newPassword
//       });
//       showToast('Contraseña cambiada exitosamente', 'success');
//       setShowPasswordModal(false);
//       setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
//     } catch (error) {
//       console.error('Error cambiando contraseña:', error);
//       const message = error.response?.data?.message || 'Error al cambiar la contraseña';
//       showToast(message, 'error');
//     } finally {
//       setSaving(false);
//     }
//   };
//
//   const handleDeleteAccount = async () => {
//     try {
//       setSaving(true);
//       await userService.deleteAccount();
//       showToast('Cuenta eliminada exitosamente', 'success');
//       logout();
//     } catch (error) {
//       console.error('Error eliminando cuenta:', error);
//       const message = error.response?.data?.message || 'Error al eliminar la cuenta';
//       showToast(message, 'error');
//     } finally {
//       setSaving(false);
//     }
//   };
//
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-200">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }
//
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Breadcrumb/Navigation mejorado */}
//         <div className="mb-6">
//           <Link
//             to="/cars"
//             className="inline-flex items-center text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors duration-200"
//           >
//             <ArrowLeftIcon className="w-4 h-4 mr-2" />
//             Volver a Mis Autos
//           </Link>
//         </div>
//
//         {/* Header mejorado */}
//         <div className="text-center mb-12">
//           <div className="mx-auto w-24 h-24 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-6 transition-colors duration-200">
//             <UserIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors duration-200">
//             Mi Perfil
//           </h1>
//           <p className="text-gray-600 dark:text-slate-300 transition-colors duration-200 font-medium">
//             Gestiona tu información personal y configuración de cuenta
//           </p>
//         </div>
//
//         {/* Grid principal mejorado */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Información Principal */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Información Personal mejorada */}
//             <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-8 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center transition-colors duration-200">
//                   <UserIcon className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
//                   Información Personal
//                 </h2>
//                 <Button
//                   onClick={() => setShowEditModal(true)}
//                   variant="secondary"
//                   size="sm"
//                   className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
//                 >
//                   ✏️ Editar
//                 </Button>
//               </div>
//
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
//                     Nombre
//                   </label>
//                   <p className="text-gray-900 dark:text-slate-100 text-lg transition-colors duration-200">
//                     {profile?.first_name || 'No especificado'}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
//                     Apellido
//                   </label>
//                   <p className="text-gray-900 dark:text-slate-100 text-lg transition-colors duration-200">
//                     {profile?.last_name || 'No especificado'}
//                   </p>
//                 </div>
//               </div>
//
//               <div className="mt-6">
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
//                   Email
//                 </label>
//                 <p className="text-gray-900 dark:text-slate-100 text-lg transition-colors duration-200">
//                   {profile?.email || 'No disponible'}
//                 </p>
//               </div>
//             </div>
//
//             {/* Información de Cuenta mejorada */}
//             <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-8 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center transition-colors duration-200">
//                 📊 Información de Cuenta
//               </h2>
//
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
//                     Fecha de Registro
//                   </label>
//                   <p className="text-gray-900 dark:text-slate-100 transition-colors duration-200">
//                     {profile?.created_at
//                       ? new Date(profile.created_at).toLocaleDateString('es-ES', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })
//                       : 'No disponible'
//                     }
//                   </p>
//                 </div>
//
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 transition-colors duration-200">
//                     Estado de la Cuenta
//                   </label>
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 transition-colors duration-200">
//                     ✅ Activa
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//
//           {/* Panel lateral mejorado */}
//           <div className="space-y-6">
//             {/* Navegación rápida */}
//             <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
//               <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center transition-colors duration-200">
//                 🚗 Navegación Rápida
//               </h3>
//               <div className="space-y-3">
//                 <Link
//                   to="/cars"
//                   className="flex items-center justify-start w-full p-3 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M5,11L6.5,6.5H17.5L19,11H5M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
//                   </svg>
//                   Mis Autos
//                 </Link>
//                 <Link
//                   to="/"
//                   className="flex items-center justify-start w-full p-3 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
//                   </svg>
//                   Página Principal
//                 </Link>
//               </div>
//             </div>
//
//             {/* Seguridad mejorada */}
//             <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
//               <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center transition-colors duration-200">
//                 🔒 Seguridad
//               </h3>
//               <Button
//                 onClick={() => setShowPasswordModal(true)}
//                 variant="secondary"
//                 className="w-full justify-start bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
//               >
//                 <KeyIcon className="h-5 w-5 mr-3" />
//                 Cambiar Contraseña
//               </Button>
//             </div>
//
//             {/* Estadísticas mejoradas */}
//             <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-xl rounded-xl p-6 border border-gray-200 dark:border-slate-700 transition-colors duration-200">
//               <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center transition-colors duration-200">
//                 📈 Estadísticas
//               </h3>
//               <Button
//                 onClick={loadStats}
//                 variant="secondary"
//                 className="w-full justify-start bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
//               >
//                 <ChartBarIcon className="h-5 w-5 mr-3" />
//                 Ver Estadísticas
//               </Button>
//             </div>
//
//             {/* Zona de Peligro mejorada */}
//             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 transition-colors duration-200">
//               <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-4 flex items-center transition-colors duration-200">
//                 ⚠️ Zona de Peligro
//               </h3>
//               <p className="text-sm text-red-700 dark:text-red-300 mb-4 transition-colors duration-200">
//                 Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
//               </p>
//               <Button
//                 onClick={() => setShowDeleteModal(true)}
//                 variant="danger"
//                 className="w-full justify-start transition-colors duration-200"
//               >
//                 <TrashIcon className="h-5 w-5 mr-3" />
//                 Eliminar Cuenta
//               </Button>
//             </div>
//           </div>
//         </div>
//
//         {/* Modales mejorados */}
//         <Modal
//           isOpen={showEditModal}
//           onClose={() => setShowEditModal(false)}
//           title="✏️ Editar Perfil"
//         >
//           <div className="space-y-4">
//             <Input
//               label="Nombre"
//               value={editForm.first_name}
//               onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
//               className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
//             />
//             <Input
//               label="Apellido"
//               value={editForm.last_name}
//               onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
//               className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
//             />
//             <Input
//               label="Email"
//               type="email"
//               value={editForm.email}
//               onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
//               className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
//             />
//             <div className="flex justify-end space-x-3 pt-4">
//               <Button
//                 onClick={() => setShowEditModal(false)}
//                 variant="secondary"
//                 className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
//               >
//                 Cancelar
//               </Button>
//               <Button onClick={handleEditProfile} disabled={saving}>
//                 {saving ? 'Guardando...' : 'Guardar Cambios'}
//               </Button>
//             </div>
//           </div>
//         </Modal>
//
//         <Modal
//           isOpen={showPasswordModal}
//           onClose={() => setShowPasswordModal(false)}
//           title="🔐 Cambiar Contraseña"
//         >
//           <div className="space-y-4">
//             <Input
//               type="password"
//               label="Contraseña actual"
//               value={passwordForm.currentPassword}
//               onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
//               className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
//             />
//             <Input
//               type="password"
//               label="Nueva contraseña"
//               value={passwordForm.newPassword}
//               onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
//               className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
//             />
//             <Input
//               type="password"
//               label="Confirmar nueva contraseña"
//               value={passwordForm.confirmPassword}
//               onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
//               className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 transition-colors duration-200"
//             />
//             <div className="flex justify-end space-x-3 pt-4">
//               <Button
//                 onClick={() => setShowPasswordModal(false)}
//                 variant="secondary"
//                 className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
//               >
//                 Cancelar
//               </Button>
//               <Button onClick={handleChangePassword} disabled={saving}>
//                 {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
//               </Button>
//             </div>
//           </div>
//         </Modal>
//
//         <Modal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           title="⚠️ Eliminar Cuenta"
//         >
//           <div>
//             <p className="text-gray-600 dark:text-slate-300 mb-6 transition-colors duration-200">
//               ¿Estás completamente seguro de que quieres eliminar tu cuenta?
//               Esta acción no se puede deshacer y perderás todos tus datos permanentemente.
//             </p>
//             <div className="flex justify-end space-x-3">
//               <Button
//                 onClick={() => setShowDeleteModal(false)}
//                 variant="secondary"
//                 className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
//               >
//                 Cancelar
//               </Button>
//               <Button
//                 onClick={handleDeleteAccount}
//                 variant="danger"
//                 disabled={saving}
//               >
//                 {saving ? 'Eliminando...' : 'Sí, Eliminar Cuenta'}
//               </Button>
//             </div>
//           </div>
//         </Modal>
//
//         <Modal
//           isOpen={showStatsModal}
//           onClose={() => setShowStatsModal(false)}
//           title="📊 Mis Estadísticas"
//           size="lg"
//         >
//           {userStats && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl text-center border border-blue-200 dark:border-blue-800 transition-colors duration-200">
//                 <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-200">
//                   {userStats.total_cars || 0}
//                 </div>
//                 <div className="text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors duration-200">
//                   Total Autos
//                 </div>
//               </div>
//               <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl text-center border border-green-200 dark:border-green-800 transition-colors duration-200">
//                 <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 transition-colors duration-200">
//                   {userStats.favorite_brand || 'N/A'}
//                 </div>
//                 <div className="text-sm font-medium text-green-700 dark:text-green-300 transition-colors duration-200">
//                   Marca Favorita
//                 </div>
//               </div>
//               <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-xl text-center border border-purple-200 dark:border-purple-800 transition-colors duration-200">
//                 <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-200">
//                   {userStats.newest_car || 'N/A'}
//                 </div>
//                 <div className="text-sm font-medium text-purple-700 dark:text-purple-300 transition-colors duration-200">
//                   Auto Más Nuevo
//                 </div>
//               </div>
//               <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-xl text-center border border-orange-200 dark:border-orange-800 transition-colors duration-200">
//                 <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2 transition-colors duration-200">
//                   {userStats.oldest_car || 'N/A'}
//                 </div>
//                 <div className="text-sm font-medium text-orange-700 dark:text-orange-300 transition-colors duration-200">
//                   Auto Más Antiguo
//                 </div>
//               </div>
//             </div>
//           )}
//         </Modal>
//       </div>
//     </div>
//   );
// };
//
// export default ProfilePage;




// // src/pages/ProfilePage.jsx - Diseño glassmórfico premium
// import { useState, useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { useToast } from '../hooks/useToast';
// import { userService } from '../services/api';
// import Button from '../components/ui/Button';
// import Input from '../components/ui/Input';
// import LoadingSpinner from '../components/ui/LoadingSpinner';
// import { User, Mail, Calendar, Car, Shield, Edit, Save, X, Settings } from 'lucide-react';
//
// // Componente GlassCard para efectos glassmórficos
// const GlassCard = ({ children, className = "", hover = true, ...props }) => {
//   return (
//     <div
//       className={`
//         backdrop-blur-xl bg-white/10 dark:bg-white/5
//         border border-white/20 dark:border-white/10
//         rounded-2xl shadow-2xl
//         ${hover ? 'hover:bg-white/15 dark:hover:bg-white/10 hover:border-white/30 dark:hover:border-white/20 hover:shadow-3xl hover:-translate-y-1' : ''}
//         transition-all duration-300 ease-out
//         ${className}
//       `}
//       {...props}
//     >
//       {children}
//     </div>
//   );
// };
//
// // Componente para efectos de brillo animado
// const ShimmerEffect = ({ children, className = "" }) => {
//   return (
//     <div className={`relative overflow-hidden ${className}`}>
//       <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shimmer" />
//       {children}
//     </div>
//   );
// };
//
// const ProfilePage = () => {
//   const { user, updateUser } = useAuth();
//   const { showToast } = useToast();
//
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [userStats, setUserStats] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: ''
//   });
//
//   // Cargar datos del usuario
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || '',
//         email: user.email || ''
//       });
//     }
//
//     // Cargar estadísticas del usuario
//     loadUserStats();
//   }, [user]);
//
//   const loadUserStats = async () => {
//     try {
//       // Simulamos estadísticas del usuario
//       // En una app real, esto vendría de una API
//       setUserStats({
//         totalCars: 21,
//         vintageCars: 3,
//         newestCar: 2024,
//         oldestCar: 1970,
//         favoriteColor: 'Azul',
//         joinDate: new Date(2024, 0, 15)
//       });
//     } catch (error) {
//       console.error('Error loading user stats:', error);
//     }
//   };
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//
//     try {
//       // Aquí iría la llamada a la API para actualizar el usuario
//       await userService.updateProfile(formData);
//
//       // Actualizar el contexto de usuario
//       updateUser(formData);
//
//       showToast('Perfil actualizado exitosamente', 'success');
//       setEditing(false);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       showToast('Error al actualizar el perfil', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleCancel = () => {
//     setFormData({
//       name: user.name || '',
//       email: user.email || ''
//     });
//     setEditing(false);
//   };
//
//   const formatDate = (date) => {
//     return new Intl.DateTimeFormat('es-ES', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     }).format(date);
//   };
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 relative overflow-hidden">
//       {/* Efectos de fondo animados */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
//       </div>
//
//       <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
//             Mi Perfil
//           </h1>
//           <p className="text-lg text-slate-600 dark:text-slate-300">
//             Gestiona tu información personal y configuraciones
//           </p>
//         </div>
//
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//
//           {/* Información Personal */}
//           <div className="lg:col-span-2">
//             <GlassCard className="p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
//                   <User className="w-6 h-6 mr-3 text-blue-500" />
//                   Información Personal
//                 </h2>
//
//                 {!editing && (
//                   <Button
//                     onClick={() => setEditing(true)}
//                     variant="ghost"
//                     size="sm"
//                     className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
//                   >
//                     <Edit className="w-4 h-4 mr-2" />
//                     Editar
//                   </Button>
//                 )}
//               </div>
//
//               {editing ? (
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                       Nombre completo
//                     </label>
//                     <Input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 backdrop-blur-sm"
//                       required
//                     />
//                   </div>
//
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                       Correo electrónico
//                     </label>
//                     <Input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 backdrop-blur-sm"
//                       required
//                     />
//                   </div>
//
//                   <div className="flex gap-3 pt-4">
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       disabled={loading}
//                       className="flex-1"
//                     >
//                       {loading ? (
//                         <LoadingSpinner size="sm" className="mr-2" />
//                       ) : (
//                         <Save className="w-4 h-4 mr-2" />
//                       )}
//                       Guardar Cambios
//                     </Button>
//
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       onClick={handleCancel}
//                       className="flex-1 backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
//                     >
//                       <X className="w-4 h-4 mr-2" />
//                       Cancelar
//                     </Button>
//                   </div>
//                 </form>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="flex items-center p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
//                     <User className="w-5 h-5 text-blue-500 mr-3" />
//                     <div>
//                       <p className="text-sm text-slate-600 dark:text-slate-400">Nombre</p>
//                       <p className="font-medium text-slate-800 dark:text-slate-100">{user?.name || 'No especificado'}</p>
//                     </div>
//                   </div>
//
//                   <div className="flex items-center p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
//                     <Mail className="w-5 h-5 text-green-500 mr-3" />
//                     <div>
//                       <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
//                       <p className="font-medium text-slate-800 dark:text-slate-100">{user?.email}</p>
//                     </div>
//                   </div>
//
//                   {userStats && (
//                     <div className="flex items-center p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
//                       <Calendar className="w-5 h-5 text-purple-500 mr-3" />
//                       <div>
//                         <p className="text-sm text-slate-600 dark:text-slate-400">Miembro desde</p>
//                         <p className="font-medium text-slate-800 dark:text-slate-100">{formatDate(userStats.joinDate)}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </GlassCard>
//           </div>
//
//           {/* Estadísticas */}
//           <div className="space-y-6">
//
//             {/* Resumen de Autos */}
//             {userStats && (
//               <GlassCard className="p-6">
//                 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
//                   <Car className="w-5 h-5 mr-2 text-blue-500" />
//                   Mi Colección
//                 </h3>
//
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 dark:text-slate-400">Total de autos</span>
//                     <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
//                       {userStats.totalCars}
//                     </span>
//                   </div>
//
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 dark:text-slate-400">Autos clásicos</span>
//                     <span className="font-semibold text-amber-600 dark:text-amber-400">
//                       {userStats.vintageCars}
//                     </span>
//                   </div>
//
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 dark:text-slate-400">Más nuevo</span>
//                     <span className="font-semibold text-slate-800 dark:text-slate-200">
//                       {userStats.newestCar}
//                     </span>
//                   </div>
//
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-600 dark:text-slate-400">Más antiguo</span>
//                     <span className="font-semibold text-slate-800 dark:text-slate-200">
//                       {userStats.oldestCar}
//                     </span>
//                   </div>
//                 </div>
//               </GlassCard>
//             )}
//
//             {/* Seguridad */}
//             <GlassCard className="p-6">
//               <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
//                 <Shield className="w-5 h-5 mr-2 text-green-500" />
//                 Seguridad
//               </h3>
//
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
//                   <span className="text-sm text-slate-600 dark:text-slate-400">Autenticación JWT</span>
//                   <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
//                     Activa
//                   </span>
//                 </div>
//
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="w-full backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
//                 >
//                   <Settings className="w-4 h-4 mr-2" />
//                   Cambiar Contraseña
//                 </Button>
//               </div>
//             </GlassCard>
//
//             {/* Acciones Rápidas */}
//             <GlassCard className="p-6">
//               <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
//                 Acciones Rápidas
//               </h3>
//
//               <div className="space-y-3">
//                 <ShimmerEffect>
//                   <Button
//                     as="a"
//                     href="/cars"
//                     variant="primary"
//                     size="sm"
//                     className="w-full justify-center"
//                   >
//                     <Car className="w-4 h-4 mr-2" />
//                     Ver Mis Autos
//                   </Button>
//                 </ShimmerEffect>
//
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="w-full justify-center backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
//                 >
//                   Exportar Datos
//                 </Button>
//               </div>
//             </GlassCard>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default ProfilePage;




// src/pages/ProfilePage.jsx - Sección 1: Imports y Componentes Base
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
  Mail,
  Calendar,
  Car,
  Shield,
  Edit,
  Save,
  X,
  Settings,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  Key
} from 'lucide-react';
import {Avatar, AvatarImage, AvatarFallback} from '../components/ui/avatar';

// Componente GlassCard para efectos glassmórficos
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

// Componente para efectos de brillo animado
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
    if (user) {
      // Separar nombre completo en nombre y apellido
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        firstName,
        lastName,
        email: user.email || ''
      });
    }

    loadUserStats();
  }, [user]);

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

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getInitials = () => {
    const firstName = formData.firstName || user?.name?.split(' ')[0] || '';
    const lastName = formData.lastName || user?.name?.split(' ')[1] || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
      // Combinar nombre y apellido para enviar a la API
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const updateData = {
        name: fullName,
        email: formData.email
      };

      await userService.updateProfile(updateData);

      // Actualizar el contexto de usuario
      updateUser({ ...user, ...updateData });

      showToast('Perfil actualizado exitosamente', 'success');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error al actualizar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setFormData({
      firstName,
      lastName,
      email: user.email || ''
    });
    setEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      showToast('Contraseña actualizada exitosamente', 'success');
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('Error al cambiar la contraseña', 'error');
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
            as={Link}
            to="/cars"
            variant="ghost"
            size="sm"
            className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mis Autos
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
                      <p className="font-medium text-slate-800 dark:text-slate-100">{formData.firstName || 'No especificado'}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Apellido</p>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{formData.lastName || 'No especificado'}</p>
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
                    {userStats?.joinDate ? formatDate(userStats.joinDate) : 'No disponible'}
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
                    as={Link}
                    to="/cars"
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Ver Mis Autos
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
