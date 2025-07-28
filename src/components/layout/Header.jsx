// // src/components/layout/Header.jsx - Con mejor UX
// import { useState, useMemo, useCallback } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react';
// import {
//   Bars3Icon,
//   XMarkIcon,
//   UserIcon,
//   Cog6ToothIcon,
//   ArrowRightOnRectangleIcon
// } from '@heroicons/react/24/outline';
// import { useAuth } from "../../hooks/useAuth";
// import Button from '../ui/Button';
// import { cn } from '../../utils';
// import ThemeToggle from '../ui/ThemeToggle';
//
// const Header = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isAuthenticated, user, logout } = useAuth();
//
//   const handleLogout = useCallback(() => {
//     logout();
//     navigate('/');
//   }, [logout, navigate]);
//
//   const navigation = useMemo(() => [
//     { name: 'Inicio', href: '/', current: location.pathname === '/' },
//     ...(isAuthenticated ? [
//       { name: 'Mis Autos', href: '/cars', current: location.pathname === '/cars' },
//     ] : [])
//   ], [location.pathname, isAuthenticated]);
//
//   const closeMobileMenu = useCallback(() => {
//     setMobileMenuOpen(false);
//   }, []);
//
//   const handleMobileLogout = useCallback(() => {
//     handleLogout();
//     closeMobileMenu();
//   }, [handleLogout, closeMobileMenu]);
//
//   return (
//     <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link
//               to="/"
//               className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200"
//             >
//               🚗 AutoTracker
//             </Link>
//           </div>
//
//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={cn(
//                   item.current
//                     ? 'border-primary-500 text-gray-900 dark:text-white'
//                     : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100',
//                   'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
//                 )}
//               >
//                 {item.name}
//               </Link>
//             ))}
//
//             {/* Auth buttons y Theme Toggle */}
//             <div className="flex items-center space-x-4">
//               {/* Theme Toggle - Posicionado antes de los botones de auth */}
//               <ThemeToggle />
//
//               {isAuthenticated ? (
//                 /* User menu */
//                 <Menu as="div" className="relative">
//                   <Menu.Button className="flex items-center text-sm rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200">
//                     <span className="sr-only">Abrir menú de usuario</span>
//                     <div className="flex items-center space-x-2">
//                       <UserIcon className="h-6 w-6" />
//                       <span className="text-gray-700 dark:text-gray-200 font-medium">
//                         {user?.full_name || 'Usuario'}
//                       </span>
//                     </div>
//                   </Menu.Button>
//                   <Transition
//                     enter="transition ease-out duration-200"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                   >
//                     <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none">
//                       <Menu.Item>
//                         {({ active }) => (
//                           <Link
//                             to="/profile"
//                             className={cn(
//                               active ? 'bg-gray-100 dark:bg-gray-700' : '',
//                               'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
//                             )}
//                           >
//                             <Cog6ToothIcon className="mr-3 h-5 w-5" />
//                             Mi Perfil
//                           </Link>
//                         )}
//                       </Menu.Item>
//                       <Menu.Item>
//                         {({ active }) => (
//                           <button
//                             onClick={handleLogout}
//                             className={cn(
//                               active ? 'bg-gray-100 dark:bg-gray-700' : '',
//                               'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
//                             )}
//                           >
//                             <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
//                             Cerrar Sesión
//                           </button>
//                         )}
//                       </Menu.Item>
//                     </Menu.Items>
//                   </Transition>
//                 </Menu>
//               ) : (
//                 <div className="flex items-center space-x-4">
//                   <Link
//                     to="/login"
//                     className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-200"
//                   >
//                     Iniciar Sesión
//                   </Link>
//                   <Button as={Link} to="/register">
//                     Registrarse
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//
//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center space-x-3">
//             {/* Theme Toggle para móvil - Posición más natural */}
//             <ThemeToggle />
//
//             <button
//               type="button"
//               className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               <span className="sr-only">Abrir menú principal</span>
//               {mobileMenuOpen ? (
//                 <XMarkIcon className="h-6 w-6" />
//               ) : (
//                 <Bars3Icon className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//
//         {/* Mobile menu */}
//         <Transition
//           show={mobileMenuOpen}
//           enter="transition ease-out duration-200"
//           enterFrom="opacity-0 scale-95"
//           enterTo="opacity-100 scale-100"
//           leave="transition ease-in duration-100"
//           leaveFrom="opacity-100 scale-100"
//           leaveTo="opacity-0 scale-95"
//         >
//           <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
//             <div className="space-y-1 pb-3 pt-2">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={cn(
//                     item.current
//                       ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-500 text-primary-700 dark:text-primary-300'
//                       : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100',
//                     'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200'
//                   )}
//                   onClick={closeMobileMenu}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//
//               {isAuthenticated ? (
//                 <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center px-4">
//                     <div className="flex-shrink-0">
//                       <UserIcon className="h-10 w-10 text-gray-400 dark:text-gray-300" />
//                     </div>
//                     <div className="ml-3">
//                       <div className="text-base font-medium text-gray-800 dark:text-gray-200">
//                         {user?.full_name}
//                       </div>
//                       <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                         {user?.email}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-3 space-y-1">
//                     <Link
//                       to="/profile"
//                       className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//                       onClick={closeMobileMenu}
//                     >
//                       Mi Perfil
//                     </Link>
//                     <button
//                       onClick={handleMobileLogout}
//                       className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//                     >
//                       Cerrar Sesión
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
//                   <Link
//                     to="/login"
//                     className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//                     onClick={closeMobileMenu}
//                   >
//                     Iniciar Sesión
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//                     onClick={closeMobileMenu}
//                   >
//                     Registrarse
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </Transition>
//       </nav>
//     </header>
//   );
// };
//
// export default Header;

// src/components/layout/Header.jsx - Diseño combinado
import { useState, Fragment, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from "../../hooks/useAuth";
import Button from '../ui/Button';
import { cn } from '../../utils';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const navigation = useMemo(() => [
    { name: 'Inicio', href: '/', current: location.pathname === '/' },
    ...(isAuthenticated ? [
      { name: 'Mis Autos', href: '/cars', current: location.pathname === '/cars' },
    ] : [])
  ], [location.pathname, isAuthenticated]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleMobileLogout = useCallback(() => {
    handleLogout();
    closeMobileMenu();
  }, [handleLogout, closeMobileMenu]);

  const mockUser = {
    email: user?.email || 'usuario@tucarro.com',
    notifications: 3
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Con estilo glassmórfico */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent transition-colors duration-200"
            >
              🚗 TuCarro
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? 'border-primary-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth buttons y controles del usuario */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* Notifications */}
                  <div className="relative">
                    <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors duration-200">
                      <BellIcon className="h-6 w-6" />
                      {mockUser.notifications > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {mockUser.notifications}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* User menu - Con diseño glassmórfico */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200">
                      <span className="font-medium">
                        {mockUser.email}
                      </span>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right">
                        {/* Menú glassmórfico */}
                        <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-lg shadow-2xl p-0">
                          {/* User Info Header */}
                          <div className="p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                {mockUser.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{mockUser.email}</p>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 mt-1">
                                  Usuario Premium
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/profile"
                                  className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-200',
                                    active ? 'bg-white/10' : ''
                                  )}
                                >
                                  <UserIcon className="w-4 h-4" />
                                  Mi Perfil
                                </Link>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left text-gray-700 dark:text-gray-200',
                                    active ? 'bg-white/10' : ''
                                  )}
                                  disabled
                                >
                                  <BellIcon className="w-4 h-4" />
                                  Notificaciones
                                  {mockUser.notifications > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                      {mockUser.notifications}
                                    </span>
                                  )}
                                </button>
                              )}
                            </Menu.Item>
                          </div>

                          {/* Logout */}
                          <div className="p-2 border-t border-white/10">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left',
                                    'text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-500/10',
                                    active ? 'bg-red-500/10' : ''
                                  )}
                                >
                                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                  Cerrar Sesión
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <Link
                    to="/login"
                    className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Iniciar Sesión
                  </Link>
                  <Button as={Link} to="/register">
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated && (
              <div className="relative">
                <button className="p-2 text-gray-400 dark:text-gray-300">
                  <BellIcon className="h-5 w-5" />
                  {mockUser.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {mockUser.notifications}
                    </span>
                  )}
                </button>
              </div>
            )}

            <button
              type="button"
              className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    item.current
                      ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-500 text-primary-700 dark:text-primary-300'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100',
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200'
                  )}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {mockUser.email.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                        {mockUser.email}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Usuario Premium
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleMobileLogout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Transition>
      </nav>
    </header>
  );
};

export default Header;