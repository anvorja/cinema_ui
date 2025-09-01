// src/providers/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';
import {authService, handleApiError, userService} from "../../services/api.js";
import Cookies from "js-cookie";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verificar autenticación al cargar la app
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedUser = localStorage.getItem('cinema_user');
                const storedToken = localStorage.getItem('cinema_token');

                if (storedUser && storedToken) {
                    // Validar token con el backend
                    try {
                        const response = await authService.validateToken();
                        if (response.data.valid) {
                            const userData = JSON.parse(storedUser);
                            setUser(userData);
                            setIsAuthenticated(true);
                        } else {
                            // Token inválido, limpiar
                            localStorage.removeItem('cinema_user');
                            localStorage.removeItem('cinema_token');
                        }
                    } catch {
                        // Token inválido o expirado
                        localStorage.removeItem('cinema_user');
                        localStorage.removeItem('cinema_token');
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // ✅ FUNCIÓN DE REGISTRO CONECTADA AL BACKEND
    const register = async (userData) => {
        try {
            setLoading(true);

            const response = await authService.register({
                email: userData.email,
                phone: userData.phone,
                firstName: userData.firstName,
                lastName: userData.lastName,
                password: userData.password
            });

            const { data: userInfo } = response;

            // Después del registro, hacer login automático
            const loginResponse = await authService.login({
                email: userData.email,
                password: userData.password
            });

            const { access_token } = loginResponse.data;

            // Crear objeto de usuario completo
            const newUser = {
                id: userInfo.id,
                name: userInfo.full_name,
                email: userInfo.email,
                phone: userInfo.phone,
                firstName: userInfo.first_name,
                lastName: userInfo.last_name,
                role: userInfo.role,
                createdAt: new Date().toISOString()
            };

            // Guardar estado y localStorage
            setUser(newUser);
            setIsAuthenticated(true);
            localStorage.setItem('cinema_user', JSON.stringify(newUser));
            localStorage.setItem('cinema_token', access_token);

            return { success: true, user: newUser };

        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                error: handleApiError(error)
            };
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);

            const response = await authService.login(credentials);
            const { access_token } = response.data;

            // 🔥 GUARDAR EL TOKEN PRIMERO
            localStorage.setItem('cinema_token', access_token);

            // Pequeña pausa para asegurar que el token esté disponible
            await new Promise(resolve => setTimeout(resolve, 100));

            // Obtener información del usuario (ahora con token disponible)
            const userResponse = await authService.getCurrentUser();
            const userInfo = userResponse.data;

            const newUser = {
                id: userInfo.id,
                name: userInfo.full_name,
                email: userInfo.email,
                phone: userInfo.phone,
                firstName: userInfo.first_name,
                lastName: userInfo.last_name,
                role: userInfo.role,
                avatar: null
            };

            setUser(newUser);
            setIsAuthenticated(true);
            localStorage.setItem('cinema_user', JSON.stringify(newUser));

            return { success: true, user: newUser };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: handleApiError(error)
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        console.log('🚪 Starting logout process...');

        try {
            setLoading(true);

            // Intentar hacer logout en el backend
            console.log('🌐 Calling backend logout...');
            await authService.logout();
            console.log('✅ Backend logout successful');

        } catch (error) {
            console.error('❌ Backend logout error:', error);
            // No fallar el logout si el backend falla
            // El usuario debe poder cerrar sesión siempre
        }

        try {
            console.log('🧹 Cleaning up local state...');

            // Limpiar estado local SIEMPRE
            setUser(null);
            setIsAuthenticated(false);

            // Limpiar localStorage
            localStorage.removeItem('cinema_user');
            localStorage.removeItem('cinema_token');

            // Limpiar cookies también por si acaso
            Cookies.remove('token');
            Cookies.remove('userInfo');

            console.log('✅ Logout completed successfully');

            // Opcional: recargar la página para limpiar completamente el estado
            setTimeout(() => {
                window.location.reload();
            }, 100);

        } catch (error) {
            console.error('❌ Error during logout cleanup:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FUNCIÓN PARA ACTUALIZAR PERFIL
    const updateProfile = async (profileData) => {
        try {
            setLoading(true);

            // TODO: revisar porque se declara pero no se usa
            // const response = await userService.updateProfile({
            //   firstName: profileData.firstName,
            //   lastName: profileData.lastName,
            //   phone: profileData.phone
            // });

            const updatedUser = {
                ...user,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone,
                name: `${profileData.firstName} ${profileData.lastName}`
            };

            setUser(updatedUser);
            localStorage.setItem('cinema_user', JSON.stringify(updatedUser));

            return { success: true, user: updatedUser };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error)
            };
        } finally {
            setLoading(false);
        }
    };

    // ✅ FUNCIÓN PARA CAMBIAR CONTRASEÑA
    const changePassword = async (currentPassword, newPassword) => {
        try {
            setLoading(true);

            await userService.changePassword({
                currentPassword,
                newPassword
            });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error)
            };
        } finally {
            setLoading(false);
        }
    };

    // ✅ FUNCIÓN PARA ELIMINAR CUENTA
    const deleteAccount = async () => {
        try {
            setLoading(true);

            await userService.deleteAccount();

            // Limpiar estado después de eliminación exitosa
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('cinema_user');
            localStorage.removeItem('cinema_token');

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error)
            };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};