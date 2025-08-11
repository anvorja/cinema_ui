// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';

// Layout Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarsPage from './pages/CarsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Providers
import { AuthProvider } from "./components/auth/AuthProvider.jsx";
import { ThemeProvider } from "./components/providers/ThemeProvider.jsx";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <Router>
                        <Layout>
                            <Routes>
                                {/* Rutas públicas */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />

                                {/* Rutas protegidas */}
                                <Route path="/cars" element={
                                    <ProtectedRoute>
                                        <CarsPage />
                                    </ProtectedRoute>
                                } />

                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                } />

                                {/* Ruta 404 */}
                                <Route path="/404" element={<NotFoundPage />} />
                                <Route path="*" element={<Navigate to="/404" replace />} />

                            </Routes>
                        </Layout>
                    </Router>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;