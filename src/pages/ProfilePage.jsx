// src/pages/ProfilePage.jsx
import {useState, useEffect, useCallback} from 'react';
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
    Trash2 as Trash,
    AlertTriangle,
    Key,
    Download
} from 'lucide-react';
import AvatarUser from "../components/ui/AvatarUser.jsx";

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
        <div className={`relative overflow-hidden rounded-lg ${className}`}>
            {/* ↑ tiene rounded-lg para coincidir con los botones */}
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

    // Función para cargar datos del usuario
    const loadUserProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await userService.getProfile();
            const userData = response.data.data;

            setProfile(userData);
            setFormData({
                firstName: userData.first_name || '',
                lastName: userData.last_name || '',
                email: userData.email || ''
            });
        } catch {
            showToast('Error al cargar el perfil', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // Función para cargar estadísticas usando useCallback
    const loadUserStats = useCallback(async () => {
        try {
            // Cargar estadísticas reales de la API
            const carsResponse = await carService.getAll();

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
    }, [user?.createdAt]);

    // useEffect con las dependencias correctas
    useEffect(() => {
        const initializeProfile = async () => {
            try {
                await Promise.all([
                    loadUserProfile(),
                    loadUserStats()
                ]);
            } catch (error) {
                console.error('Error initializing profile data:', error);
            }
        };

        void initializeProfile();
    }, [loadUserProfile, loadUserStats]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        try {
            const isoString = dateString.replace(' ', 'T') + 'Z';
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return new Intl.DateTimeFormat('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'Error en fecha';
        }
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
            const response = await userService.updateProfile(updateData);
            setProfile(response.data.data);
            updateUser({
                ...user,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email
            });
            showToast('Perfil actualizado exitosamente', 'success');
            setEditing(false);
        } catch (error) {
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

            const passwordChangeData = {
                currentPassword: passwordData.currentPassword.trim(),
                newPassword: passwordData.newPassword.trim(),
                confirmPassword: passwordData.newPassword.trim() // Debe ser igual a newPassword
            };

            const response = await userService.changePassword(passwordChangeData);

            // Verificar si la respuesta es exitosa
            if (response.data.success) {
                showToast('Contraseña cambiada exitosamente', 'success');

                // Limpiar el formulario
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                // Cerrar el formulario
                setShowChangePassword(false);
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



                {/* Header con Avatar Simplificado */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <AvatarUser
                            user={profile || user}
                            size="xl"
                            showOnlineIndicator={true}
                            showParticles={true}
                        />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
                        Mi Perfil
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Gestiona tu información personal y configuraciones
                    </p>
                </div>




                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">

                    {/* MÓVIL: Orden específico, DESKTOP: Columna principal (2 columnas) */}
                    <div className="lg:col-span-2 lg:space-y-6 contents lg:block">

                        {/* 1. Información Personal - order-1 en móvil */}
                        <div className="order-1 lg:order-none">
                            <GlassCard className="p-8">



                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                                        <User className="w-6 h-6 mr-3 text-blue-500" />
                                        Información Personal
                                    </h2>

                                    {!editing && (
                                        <ShimmerEffect>
                                            <Button
                                                onClick={() => setEditing(true)}
                                                variant="ghost"
                                                size="sm"
                                                className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20
                                                dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 mr-7 sm:mr-0"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>
                                        </ShimmerEffect>
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
                                            <p className="font-medium text-slate-800 dark:text-slate-100">{profile?.email || user?.email}</p>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        </div>

                        {/* 2. Información de Cuenta - order-2 en móvil */}
                        <div className="order-2 lg:order-none">
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
                                        <div className="flex items-center mt-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            <span className="font-medium text-green-600 dark:text-green-400">Activa</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* 6. Zona de Peligro - order-6 en móvil (al final), pero en desktop va aquí */}
                        <div className="order-6 lg:order-none">
                            <GlassCard className="p-8 border-red-200/50 dark:border-red-800/50">
                                <div className="flex items-center mb-6">
                                    <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
                                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
                                        Zona de Peligro
                                    </h2>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
                                </p>

                                {!showDeleteConfirm ? (
                                    <Button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        variant="danger"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <Trash className="w-4 h-4 mr-2" />
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
                            </GlassCard>
                        </div>
                    </div>

                    {/* DESKTOP: Sidebar (1 columna), MÓVIL: Orden específico entre el contenido principal */}
                    <div className="lg:space-y-6 contents lg:block">

                        {/* 3. Mi Colección - order-3 en móvil */}
                        <div className="order-3 lg:order-none">
                            <GlassCard className="p-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4">
                                    <Car className="w-5 h-5 mr-3 text-purple-500" />
                                    Mi Colección
                                </h2>

                                {userStats ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 dark:text-slate-400">Total de autos</span>
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.totalCars || 0}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 dark:text-slate-400">Autos clásicos</span>
                                            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{userStats.vintageCars || 0}</span>
                                        </div>

                                        {userStats.newestCar && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 dark:text-slate-400">Más nuevo</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{userStats.newestCar}</span>
                                            </div>
                                        )}

                                        {userStats.oldestCar && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 dark:text-slate-400">Más antiguo</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{userStats.oldestCar}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 dark:text-slate-400">Total de autos</span>
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 dark:text-slate-400">Autos clásicos</span>
                                            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">0</span>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        </div>

                        {/* 4. Seguridad - order-4 en móvil */}
                        <div className="order-4 lg:order-none">
                            <GlassCard className="p-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4">
                                    <Shield className="w-5 h-5 mr-3 text-green-500" />
                                    Seguridad
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Autenticación JWT</span>
                                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                            Activa
                        </span>
                                    </div>

                                    {!showChangePassword ? (
                                        <ShimmerEffect>
                                            <Button
                                                onClick={() => setShowChangePassword(true)}
                                                variant="ghost"
                                                className="w-full backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
                                            >
                                                <Key className="w-4 h-4 mr-2" />
                                                Cambiar Contraseña
                                            </Button>
                                        </ShimmerEffect>
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
                        </div>

                        {/* 5. Acciones Rápidas - order-5 en móvil */}
                        <div className="order-5 lg:order-none">
                            <GlassCard className="p-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                                    Acciones Rápidas
                                </h2>

                                <div className="space-y-3">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none"
                                    >
                                        <Link to="/cars">
                                            <Car className="w-4 h-4 mr-2" />
                                            Ver Mis Autos
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-full backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Exportar Datos
                                    </Button>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;