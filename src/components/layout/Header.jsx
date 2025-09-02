// // src/components/layout/Header.jsx
// import { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//     Bars3Icon,
//     MagnifyingGlassIcon,
//     UserCircleIcon
// } from '@heroicons/react/24/outline';
// import { GlassCard, PremiumButton, GlassInput } from '../ui';
// import { UserProfileDropdown } from './UserProfileDropdown';
// import { Sidebar } from './Sidebar';
// import { LoginModal } from '../auth/LoginModal.jsx';
// import { RegisterModal } from '../auth/RegisterModal.jsx';
// import  useAuth from '../../hooks/useAuth';
//
// const Header = () => {
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showUserProfile, setShowUserProfile] = useState(false);
//     const [showLoginModal, setShowLoginModal] = useState(false);
//     const [showRegisterModal, setShowRegisterModal] = useState(false);
//
//     const location = useLocation();
//     const { user, isAuthenticated } = useAuth();
//
//     // Handle scroll effect
//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 20);
//         };
//
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);
//
//     // Close sidebar when route changes
//     useEffect(() => {
//         setIsSidebarOpen(false);
//     }, [location]);
//
//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (showUserProfile) {
//                 const dropdown = event.target.closest('.user-profile-dropdown');
//                 const button = event.target.closest('.user-profile-button');
//
//                 if (!dropdown && !button) {
//                     setShowUserProfile(false);
//                 }
//             }
//         };
//
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [showUserProfile]);
//
//     const navigationItems = [
//         { name: 'Cartelera', href: '/cartelera', isActive: location.pathname === '/cartelera' },
//         { name: 'Pronto', href: '/pronto', isActive: location.pathname === '/pronto' },
//         { name: 'Comidas', href: '/comidas', isActive: location.pathname === '/comidas' }
//     ];
//
//     const handleUserClick = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         console.log('User button clicked, current state:', showUserProfile);
//         setShowUserProfile(!showUserProfile);
//     };
//
//     const handleCloseDropdown = () => {
//         console.log('Closing dropdown');
//         setShowUserProfile(false);
//     };
//
//     const handleLoginClick = () => {
//         console.log('Opening login modal');
//         setShowLoginModal(true);
//     };
//
//     const handleSwitchToRegister = () => {
//         console.log('Switching to register modal');
//         setShowLoginModal(false);
//         setShowRegisterModal(true);
//     };
//
//     const handleSwitchToLogin = () => {
//         console.log('Switching to login modal');
//         setShowRegisterModal(false);
//         setShowLoginModal(true);
//     };
//
//     const closeAllModals = () => {
//         console.log('Closing all modals');
//         setShowLoginModal(false);
//         setShowRegisterModal(false);
//     };
//
//     return (
//         <>
//             <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//                 isScrolled ? 'py-2' : 'py-4'
//             }`}>
//                 <GlassCard
//                     variant="premium"
//                     className={`mx-4 transition-all duration-300 ${
//                         isScrolled ? 'bg-black/30 backdrop-blur-xl' : 'bg-white/10 backdrop-blur-md'
//                     }`}
//                 >
//                     <div className="flex items-center justify-between px-6 py-3">
//                         {/* Logo and Hamburger */}
//                         <div className="flex items-center gap-4">
//                             {/* Hamburger Menu */}
//                             <button
//                                 onClick={() => {
//                                     console.log('Sidebar button clicked!');
//                                     setIsSidebarOpen(true);
//                                 }}
//                                 className="p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105"
//                             >
//                                 <Bars3Icon className="w-6 h-6 text-white" />
//                             </button>
//
//                             {/* Logo */}
//                             <Link
//                                 to="/"
//                                 className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
//                             >
//                                 <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
//                                     <span className="text-white font-bold text-xl">C+</span>
//                                 </div>
//                                 <div className="hidden sm:block">
//                                     <h1 className="text-xl font-bold text-white">CINEMAPLUS</h1>
//                                 </div>
//                             </Link>
//                         </div>
//
//                         {/* Desktop Navigation */}
//                         <nav className="hidden lg:flex items-center gap-2">
//                             {navigationItems.map((item) => (
//                                 <Link
//                                     key={item.name}
//                                     to={item.href}
//                                     className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
//                                         item.isActive
//                                             ? 'bg-white/20 text-white shadow-lg scale-105'
//                                             : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
//                                     }`}
//                                 >
//                                     {item.name}
//                                 </Link>
//                             ))}
//                         </nav>
//
//                         {/* Search and User Section */}
//                         <div className="flex items-center gap-4">
//                             {/* Search - CORREGIDO sin rightIcon */}
//                             <div className="hidden md:flex items-center relative">
//                                 <GlassInput
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     placeholder="Buscar..."
//                                     className="w-48 lg:w-64 pl-10"
//                                 />
//                                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
//                             </div>
//
//                             {/* Search Button Mobile */}
//                             <button className="md:hidden p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105">
//                                 <MagnifyingGlassIcon className="w-5 h-5 text-white" />
//                             </button>
//
//                             {/* User Profile or Login Button */}
//                             {isAuthenticated ? (
//                                 <div className="relative">
//                                     <button
//                                         onClick={handleUserClick}
//                                         className="user-profile-button flex items-center gap-2 p-2 rounded-xl glass-hover transition-all duration-200 hover:scale-105"
//                                     >
//                                         {user?.avatar ? (
//                                             <img
//                                                 src={user.avatar}
//                                                 alt={user.name}
//                                                 className="w-8 h-8 rounded-full border-2 border-white/20"
//                                             />
//                                         ) : (
//                                             <UserCircleIcon className="w-8 h-8 text-white" />
//                                         )}
//                                         <span className="hidden sm:block text-white font-medium">{user?.name}</span>
//                                     </button>
//
//                                     {/* Dropdown con clase específica para el click outside */}
//                                     {showUserProfile && (
//                                         <div className="user-profile-dropdown">
//                                             <UserProfileDropdown
//                                                 onClose={handleCloseDropdown}
//                                                 user={user}
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <PremiumButton
//                                     variant="secondary"
//                                     size="sm"
//                                     className="hidden sm:flex"
//                                     onClick={handleLoginClick}
//                                 >
//                                     Iniciar Sesión
//                                 </PremiumButton>
//                             )}
//                         </div>
//                     </div>
//                 </GlassCard>
//             </header>
//
//             {/* Sidebar */}
//             <Sidebar
//                 isOpen={isSidebarOpen}
//                 onClose={() => setIsSidebarOpen(false)}
//                 navigationItems={navigationItems}
//                 onLoginClick={handleLoginClick}
//                 onRegisterClick={handleSwitchToRegister}
//             />
//
//             {/* Backdrop for mobile sidebar */}
//             {isSidebarOpen && (
//                 <div
//                     className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
//                     onClick={() => setIsSidebarOpen(false)}
//                 />
//             )}
//
//             {/* Modales de autenticación */}
//             <LoginModal
//                 isOpen={showLoginModal}
//                 onClose={closeAllModals}
//                 onSwitchToRegister={handleSwitchToRegister}
//             />
//
//             <RegisterModal
//                 isOpen={showRegisterModal}
//                 onClose={closeAllModals}
//                 onSwitchToLogin={handleSwitchToLogin}
//             />
//         </>
//     );
// };
//
// export { Header };

// // src/components/layout/Header.jsx
// import { useState, useEffect, useCallback } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//     Bars3Icon,
//     MagnifyingGlassIcon,
//     UserCircleIcon,
//     XMarkIcon
// } from '@heroicons/react/24/outline';
// import { GlassCard, PremiumButton, GlassInput } from '../ui';
// import { UserProfileDropdown } from './UserProfileDropdown';
// import { Sidebar } from './Sidebar';
// import { LoginModal } from '../auth/LoginModal.jsx';
// import { RegisterModal } from '../auth/RegisterModal.jsx';
// import useAuth from '../../hooks/useAuth';
// import { searchMovies } from '../../services/api';
// import { debounce } from 'lodash';
//
// const Header = () => {
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showUserProfile, setShowUserProfile] = useState(false);
//     const [showLoginModal, setShowLoginModal] = useState(false);
//     const [showRegisterModal, setShowRegisterModal] = useState(false);
//
//     // NUEVO: Estados para la búsqueda
//     const [searchResults, setSearchResults] = useState([]);
//     const [isSearching, setIsSearching] = useState(false);
//     const [showSearchResults, setShowSearchResults] = useState(false);
//
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { user, isAuthenticated } = useAuth();
//
//     // Handle scroll effect
//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 20);
//         };
//
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);
//
//     // Close sidebar when route changes
//     useEffect(() => {
//         setIsSidebarOpen(false);
//     }, [location]);
//
//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (showUserProfile) {
//                 const dropdown = event.target.closest('.user-profile-dropdown');
//                 const button = event.target.closest('.user-profile-button');
//
//                 if (!dropdown && !button) {
//                     setShowUserProfile(false);
//                 }
//             }
//
//             if (showSearchResults) {
//                 const searchContainer = event.target.closest('.search-container');
//                 if (!searchContainer) {
//                     setShowSearchResults(false);
//                 }
//             }
//         };
//
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [showUserProfile, showSearchResults]);
//
//     const navigationItems = [
//         { name: 'Cartelera', href: '/cartelera', isActive: location.pathname === '/cartelera' },
//         { name: 'Pronto', href: '/pronto', isActive: location.pathname === '/pronto' },
//         { name: 'Comidas', href: '/comidas', isActive: location.pathname === '/comidas' }
//     ];
//
//     // NUEVO: Búsqueda debounced
//     const debouncedSearch = useCallback(
//         debounce(async (query) => {
//             if (!query.trim()) {
//                 setSearchResults([]);
//                 setShowSearchResults(false);
//                 return;
//             }
//
//             setIsSearching(true);
//             try {
//                 const response = await searchMovies(query, { limit: 5 });
//                 const results = Array.isArray(response) ? response : response.data || [];
//                 setSearchResults(results);
//                 setShowSearchResults(true);
//             } catch (error) {
//                 console.error('Error en búsqueda:', error);
//                 setSearchResults([]);
//                 setShowSearchResults(false);
//             } finally {
//                 setIsSearching(false);
//             }
//         }, 300),
//         []
//     );
//
//     // NUEVO: Funciones de búsqueda
//     const handleSearchChange = (e) => {
//         const value = e.target.value;
//         setSearchQuery(value);
//         debouncedSearch(value);
//     };
//
//     const clearSearch = () => {
//         setSearchQuery('');
//         setSearchResults([]);
//         setShowSearchResults(false);
//     };
//
//     const handleSearchResultClick = (movie) => {
//         navigate(`/movie/${movie.id}`);
//         clearSearch();
//     };
//
//     const handleUserClick = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         console.log('User button clicked, current state:', showUserProfile);
//         setShowUserProfile(!showUserProfile);
//     };
//
//     const handleCloseDropdown = () => {
//         console.log('Closing dropdown');
//         setShowUserProfile(false);
//     };
//
//     const handleLoginClick = () => {
//         console.log('Opening login modal');
//         setShowLoginModal(true);
//     };
//
//     const handleSwitchToRegister = () => {
//         console.log('Switching to register modal');
//         setShowLoginModal(false);
//         setShowRegisterModal(true);
//     };
//
//     const handleSwitchToLogin = () => {
//         console.log('Switching to login modal');
//         setShowRegisterModal(false);
//         setShowLoginModal(true);
//     };
//
//     const closeAllModals = () => {
//         console.log('Closing all modals');
//         setShowLoginModal(false);
//         setShowRegisterModal(false);
//     };
//
//     return (
//         <>
//             <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//                 isScrolled ? 'py-2' : 'py-4'
//             }`}>
//                 <GlassCard
//                     variant="premium"
//                     className={`mx-4 transition-all duration-300 ${
//                         isScrolled ? 'bg-black/30 backdrop-blur-xl' : 'bg-white/10 backdrop-blur-md'
//                     }`}
//                 >
//                     <div className="flex items-center justify-between px-6 py-3">
//                         {/* Logo and Hamburger */}
//                         <div className="flex items-center gap-4">
//                             {/* Hamburger Menu */}
//                             <button
//                                 onClick={() => {
//                                     console.log('Sidebar button clicked!');
//                                     setIsSidebarOpen(true);
//                                 }}
//                                 className="p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105"
//                             >
//                                 <Bars3Icon className="w-6 h-6 text-white" />
//                             </button>
//
//                             {/* Logo */}
//                             <Link
//                                 to="/"
//                                 className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
//                             >
//                                 <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
//                                     <span className="text-white font-bold text-xl">C+</span>
//                                 </div>
//                                 <div className="hidden sm:block">
//                                     <h1 className="text-xl font-bold text-white">CINEMAPLUS</h1>
//                                 </div>
//                             </Link>
//                         </div>
//
//                         {/* Desktop Navigation */}
//                         <nav className="hidden lg:flex items-center gap-2">
//                             {navigationItems.map((item) => (
//                                 <Link
//                                     key={item.name}
//                                     to={item.href}
//                                     className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
//                                         item.isActive
//                                             ? 'bg-white/20 text-white shadow-lg scale-105'
//                                             : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
//                                     }`}
//                                 >
//                                     {item.name}
//                                 </Link>
//                             ))}
//                         </nav>
//
//                         {/* Search and User Section */}
//                         <div className="flex items-center gap-4">
//                             {/* Search con funcionalidad agregada */}
//                             <div className="hidden md:flex items-center relative search-container">
//                                 <GlassInput
//                                     value={searchQuery}
//                                     onChange={handleSearchChange}
//                                     placeholder="Buscar..."
//                                     className="w-48 lg:w-64 pl-10 pr-10"
//                                 />
//                                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
//
//                                 {/* Botón limpiar */}
//                                 {searchQuery && (
//                                     <button
//                                         type="button"
//                                         onClick={clearSearch}
//                                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
//                                     >
//                                         <XMarkIcon className="w-4 h-4" />
//                                     </button>
//                                 )}
//
//                                 {/* Loading spinner */}
//                                 {isSearching && (
//                                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white/60"></div>
//                                     </div>
//                                 )}
//
//                                 {/* Resultados de búsqueda */}
//                                 {showSearchResults && (
//                                     <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[9999] max-h-96 overflow-y-auto">
//                                         {searchResults.length > 0 ? (
//                                             searchResults.map((movie) => (
//                                                 <button
//                                                     key={movie.id}
//                                                     onClick={() => handleSearchResultClick(movie)}
//                                                     className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left first:rounded-t-xl"
//                                                 >
//                                                     {movie.poster_url ? (
//                                                         <img
//                                                             src={movie.poster_url}
//                                                             alt={movie.title}
//                                                             className="w-12 h-16 object-cover rounded-lg"
//                                                         />
//                                                     ) : (
//                                                         <div className="w-12 h-16 bg-white/10 rounded-lg flex items-center justify-center">
//                                                             <MagnifyingGlassIcon className="w-6 h-6 text-white/60" />
//                                                         </div>
//                                                     )}
//                                                     <div className="flex-1 min-w-0">
//                                                         <p className="text-white font-medium truncate">
//                                                             {movie.title}
//                                                         </p>
//                                                         <p className="text-white/60 text-sm truncate">
//                                                             {movie.genre} • {movie.duration}min
//                                                         </p>
//                                                     </div>
//                                                 </button>
//                                             ))
//                                         ) : (
//                                             <div className="p-4 text-center text-white/60">
//                                                 No se encontraron resultados para "{searchQuery}"
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//
//                             {/* Search Button Mobile */}
//                             <button className="md:hidden p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105">
//                                 <MagnifyingGlassIcon className="w-5 h-5 text-white" />
//                             </button>
//
//                             {/* User Profile or Login Button */}
//                             {isAuthenticated ? (
//                                 <div className="relative">
//                                     <button
//                                         onClick={handleUserClick}
//                                         className="user-profile-button flex items-center gap-2 p-2 rounded-xl glass-hover transition-all duration-200 hover:scale-105"
//                                     >
//                                         {user?.avatar ? (
//                                             <img
//                                                 src={user.avatar}
//                                                 alt={user.name}
//                                                 className="w-8 h-8 rounded-full border-2 border-white/20"
//                                             />
//                                         ) : (
//                                             <UserCircleIcon className="w-8 h-8 text-white" />
//                                         )}
//                                         <span className="hidden sm:block text-white font-medium">{user?.name}</span>
//                                     </button>
//
//                                     {/* Dropdown con clase específica para el click outside */}
//                                     {showUserProfile && (
//                                         <div className="user-profile-dropdown">
//                                             <UserProfileDropdown
//                                                 onClose={handleCloseDropdown}
//                                                 user={user}
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <PremiumButton
//                                     variant="secondary"
//                                     size="sm"
//                                     className="hidden sm:flex"
//                                     onClick={handleLoginClick}
//                                 >
//                                     Iniciar Sesión
//                                 </PremiumButton>
//                             )}
//                         </div>
//                     </div>
//                 </GlassCard>
//             </header>
//
//             {/* Sidebar */}
//             <Sidebar
//                 isOpen={isSidebarOpen}
//                 onClose={() => setIsSidebarOpen(false)}
//                 navigationItems={navigationItems}
//                 onLoginClick={handleLoginClick}
//                 onRegisterClick={handleSwitchToRegister}
//             />
//
//             {/* Backdrop for mobile sidebar */}
//             {isSidebarOpen && (
//                 <div
//                     className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
//                     onClick={() => setIsSidebarOpen(false)}
//                 />
//             )}
//
//             {/* Modales de autenticación */}
//             <LoginModal
//                 isOpen={showLoginModal}
//                 onClose={closeAllModals}
//                 onSwitchToRegister={handleSwitchToRegister}
//             />
//
//             <RegisterModal
//                 isOpen={showRegisterModal}
//                 onClose={closeAllModals}
//                 onSwitchToLogin={handleSwitchToLogin}
//             />
//         </>
//     );
// };
//
// export { Header };


// src/components/layout/Header.jsx
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { GlassCard, PremiumButton, GlassInput } from '../ui';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Sidebar } from './Sidebar';
import { LoginModal } from '../auth/LoginModal.jsx';
import { RegisterModal } from '../auth/RegisterModal.jsx';
import useAuth from '../../hooks/useAuth';
import { searchMovies } from '../../services/api';
import { debounce } from 'lodash';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Estados para la búsqueda
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close sidebar when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserProfile) {
                const dropdown = event.target.closest('.user-profile-dropdown');
                const button = event.target.closest('.user-profile-button');

                if (!dropdown && !button) {
                    setShowUserProfile(false);
                }
            }

            // Cerrar resultados de búsqueda
            if (showSearchResults) {
                const searchContainer = event.target.closest('.search-container');
                if (!searchContainer) {
                    setShowSearchResults(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserProfile, showSearchResults]);

    const navigationItems = [
        { name: 'Cartelera', href: '/cartelera', isActive: location.pathname === '/cartelera' },
        { name: 'Pronto', href: '/pronto', isActive: location.pathname === '/pronto' },
        { name: 'Comidas', href: '/comidas', isActive: location.pathname === '/comidas' }
    ];

    // Búsqueda debounced
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                setShowSearchResults(false);
                return;
            }

            setIsSearching(true);
            try {
                const response = await searchMovies(query, { limit: 5 });
                const results = Array.isArray(response) ? response : response.data || [];
                setSearchResults(results);
                setShowSearchResults(true);
            } catch (error) {
                console.error('Error en búsqueda:', error);
                setSearchResults([]);
                setShowSearchResults(false);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        []
    );

    // Funciones de búsqueda
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleSearchResultClick = (movie) => {
        navigate(`/movie/${movie.id}`);
        clearSearch();
    };

    // FUNCIÓN QUE FALTABA
    const handleViewAllResults = () => {
        navigate(`/cartelera?search=${encodeURIComponent(searchQuery)}`);
        clearSearch();
    };

    const handleUserClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('User button clicked, current state:', showUserProfile);
        setShowUserProfile(!showUserProfile);
    };

    const handleCloseDropdown = () => {
        console.log('Closing dropdown');
        setShowUserProfile(false);
    };

    const handleLoginClick = () => {
        console.log('Opening login modal');
        setShowLoginModal(true);
    };

    const handleSwitchToRegister = () => {
        console.log('Switching to register modal');
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const handleSwitchToLogin = () => {
        console.log('Switching to login modal');
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const closeAllModals = () => {
        console.log('Closing all modals');
        setShowLoginModal(false);
        setShowRegisterModal(false);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'py-2' : 'py-4'
            }`}>
                <GlassCard
                    variant="premium"
                    className={`mx-4 transition-all duration-300 ${
                        isScrolled ? 'bg-black/30 backdrop-blur-xl' : 'bg-white/10 backdrop-blur-md'
                    }`}
                >
                    <div className="flex items-center justify-between px-6 py-3">
                        {/* Logo and Hamburger */}
                        <div className="flex items-center gap-4">
                            {/* Hamburger Menu */}
                            <button
                                onClick={() => {
                                    console.log('Sidebar button clicked!');
                                    setIsSidebarOpen(true);
                                }}
                                className="p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105"
                            >
                                <Bars3Icon className="w-6 h-6 text-white" />
                            </button>

                            {/* Logo */}
                            <Link
                                to="/"
                                className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">C+</span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold text-white">CINEMAPLUS</h1>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-2">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                        item.isActive
                                            ? 'bg-white/20 text-white shadow-lg scale-105'
                                            : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Search and User Section */}
                        <div className="flex items-center gap-4">
                            {/* Search con funcionalidad */}
                            <div className="hidden md:flex items-center relative search-container">
                                <GlassInput
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Buscar..."
                                    className="w-48 lg:w-64 pl-10 pr-10"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />

                                {/* Botón limpiar */}
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                )}

                                {/* Loading spinner */}
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white/60"></div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button Mobile */}
                            <button className="md:hidden p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105">
                                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                            </button>

                            {/* User Profile or Login Button */}
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={handleUserClick}
                                        className="user-profile-button flex items-center gap-2 p-2 rounded-xl glass-hover transition-all duration-200 hover:scale-105"
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full border-2 border-white/20"
                                            />
                                        ) : (
                                            <UserCircleIcon className="w-8 h-8 text-white" />
                                        )}
                                        <span className="hidden sm:block text-white font-medium">{user?.name}</span>
                                    </button>

                                    {/* Dropdown con clase específica para el click outside */}
                                    {showUserProfile && (
                                        <div className="user-profile-dropdown">
                                            <UserProfileDropdown
                                                onClose={handleCloseDropdown}
                                                user={user}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <PremiumButton
                                    variant="secondary"
                                    size="sm"
                                    className="hidden sm:flex"
                                    onClick={handleLoginClick}
                                >
                                    Iniciar Sesión
                                </PremiumButton>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </header>

            {/* Resultados de búsqueda usando createPortal */}
            {showSearchResults && createPortal(
                <div
                    className="fixed w-80"
                    style={{
                        top: '80px',
                        right: '120px',
                        zIndex: 99999
                    }}
                >
                    <GlassCard variant="premium" className="p-0 overflow-hidden shadow-2xl max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            <>
                                {searchResults.map((movie) => (
                                    <button
                                        key={movie.id}
                                        onClick={() => handleSearchResultClick(movie)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left first:rounded-t-xl"
                                    >
                                        {movie.poster_url ? (
                                            <img
                                                src={movie.poster_url}
                                                alt={movie.title}
                                                className="w-12 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-12 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                                                <MagnifyingGlassIcon className="w-6 h-6 text-white/60" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                                {movie.title}
                                            </p>
                                            <p className="text-white/60 text-sm truncate">
                                                {movie.genre} • {movie.duration}min
                                            </p>
                                        </div>
                                    </button>
                                ))}

                                <div className="p-2 border-t border-white/10">
                                    <button
                                        onClick={handleViewAllResults}
                                        className="w-full p-3 text-center text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors rounded-lg"
                                    >
                                        Ver todos los resultados
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 text-center text-white/60">
                                No se encontraron resultados para "{searchQuery}"
                            </div>
                        )}
                    </GlassCard>
                </div>,
                document.body
            )}

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                navigationItems={navigationItems}
                onLoginClick={handleLoginClick}
                onRegisterClick={handleSwitchToRegister}
            />

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Modales de autenticación */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={closeAllModals}
                onSwitchToRegister={handleSwitchToRegister}
            />

            <RegisterModal
                isOpen={showRegisterModal}
                onClose={closeAllModals}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </>
    );
};

export { Header };