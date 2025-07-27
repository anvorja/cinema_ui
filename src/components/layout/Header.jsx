// // src/components/layout/Header.jsx
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
// import ThemeToggle from "../ui/ThemeToggle.jsx";
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
//   // Memoizar la navegación para evitar recalcular en cada render
//   const navigation = useMemo(() => [
//     { name: 'Inicio', href: '/', current: location.pathname === '/' },
//     ...(isAuthenticated ? [
//       { name: 'Mis Autos', href: '/cars', current: location.pathname === '/cars' },
//     ] : [])
//   ], [location.pathname, isAuthenticated]);
//
//   // Cerrar menú móvil
//   const closeMobileMenu = useCallback(() => {
//     setMobileMenuOpen(false);
//   }, []);
//
//   // Combinar logout y cerrar menú
//   const handleMobileLogout = useCallback(() => {
//     handleLogout();
//     closeMobileMenu();
//   }, [handleLogout, closeMobileMenu]);
//
//   return (
//       <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex items-center">
//               <Link
//                   to="/"
//                   className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200"
//               >
//                 🚗 AutoTracker
//               </Link>
//             </div>
//
//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               {navigation.map((item) => (
//                   <Link
//                       key={item.name}
//                       to={item.href}
//                       className={cn(
//                           item.current
//                               ? 'border-primary-500 text-gray-900 dark:text-white'
//                               : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100',
//                           'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
//                       )}
//                   >
//                     {item.name}
//                   </Link>
//               ))}
//
//               {/* Theme Toggle */}
//               <ThemeToggle size="normal" />
//
//               {/* Auth buttons */}
//               {isAuthenticated ? (
//                   <div className="flex items-center space-x-4">
//                     {/* User menu */}
//                     <Menu as="div" className="relative">
//                       <Menu.Button className="flex items-center text-sm rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200">
//                         <span className="sr-only">Abrir menú de usuario</span>
//                         <div className="flex items-center space-x-2">
//                           <UserIcon className="h-6 w-6" />
//                           <span className="text-gray-700 dark:text-gray-200 font-medium">
//                         {user?.full_name || 'Usuario'}
//                       </span>
//                         </div>
//                       </Menu.Button>
//                       <Transition
//                           enter="transition ease-out duration-200"
//                           enterFrom="transform opacity-0 scale-95"
//                           enterTo="transform opacity-100 scale-100"
//                           leave="transition ease-in duration-75"
//                           leaveFrom="transform opacity-100 scale-100"
//                           leaveTo="transform opacity-0 scale-95"
//                       >
//                         <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none">
//                           <Menu.Item>
//                             {({ active }) => (
//                                 <Link
//                                     to="/profile"
//                                     className={cn(
//                                         active ? 'bg-gray-100 dark:bg-gray-700' : '',
//                                         'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
//                                     )}
//                                 >
//                                   <Cog6ToothIcon className="mr-3 h-5 w-5" />
//                                   Mi Perfil
//                                 </Link>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                                 <button
//                                     onClick={handleLogout}
//                                     className={cn(
//                                         active ? 'bg-gray-100 dark:bg-gray-700' : '',
//                                         'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
//                                     )}
//                                 >
//                                   <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
//                                   Cerrar Sesión
//                                 </button>
//                             )}
//                           </Menu.Item>
//                         </Menu.Items>
//                       </Transition>
//                     </Menu>
//                   </div>
//               ) : (
//                   <div className="flex items-center space-x-4">
//                     <Link
//                         to="/login"
//                         className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-200"
//                     >
//                       Iniciar Sesión
//                     </Link>
//                     <Button as={Link} to="/register">
//                       Registrarse
//                     </Button>
//                   </div>
//               )}
//             </div>
//
//             {/* Mobile menu button */}
//             <div className="md:hidden flex items-center space-x-3">
//               {/* Theme Toggle para móvil */}
//               <ThemeToggle size="small" />
//
//               <button
//                   type="button"
//                   className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
//                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 <span className="sr-only">Abrir menú principal</span>
//                 {mobileMenuOpen ? (
//                     <XMarkIcon className="h-6 w-6" />
//                 ) : (
//                     <Bars3Icon className="h-6 w-6" />
//                 )}
//               </button>
//             </div>
//           </div>
//
//           {/* Mobile menu */}
//           <Transition
//               show={mobileMenuOpen}
//               enter="transition ease-out duration-200"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="transition ease-in duration-100"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//           >
//             <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
//               <div className="space-y-1 pb-3 pt-2">
//                 {navigation.map((item) => (
//                     <Link
//                         key={item.name}
//                         to={item.href}
//                         className={cn(
//                             item.current
//                                 ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-500 text-primary-700 dark:text-primary-300'
//                                 : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100',
//                             'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200'
//                         )}
//                         onClick={closeMobileMenu}
//                     >
//                       {item.name}
//                     </Link>
//                 ))}
//                 {isAuthenticated ? (
//                     <div className="pt-4 pb-3 border-t border-gray-200">
//                       <div className="flex items-center px-4">
//                         <div className="flex-shrink-0">
//                           <UserIcon className="h-10 w-10 text-gray-400" />
//                         </div>
//                         <div className="ml-3">
//                           <div className="text-base font-medium text-gray-800">
//                             {user?.full_name}
//                           </div>
//                           <div className="text-sm font-medium text-gray-500">
//                             {user?.email}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mt-3 space-y-1">
//                         <Link
//                             to="/profile"
//                             className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
//                             onClick={closeMobileMenu}
//                         >
//                           Mi Perfil
//                         </Link>
//                         <button
//                             onClick={handleMobileLogout}
//                             className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
//                         >
//                           Cerrar Sesión
//                         </button>
//                       </div>
//                     </div>
//                 ) : (
//                     <div className="pt-4 pb-3 border-t border-gray-200 space-y-1">
//                       <Link
//                           to="/login"
//                           className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
//                           onClick={closeMobileMenu}
//                       >
//                         Iniciar Sesión
//                       </Link>
//                       <Link
//                           to="/register"
//                           className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
//                           onClick={closeMobileMenu}
//                       >
//                         Registrarse
//                       </Link>
//                     </div>
//                 )}
//               </div>
//             </div>
//           </Transition>
//         </nav>
//       </header>
//   );
// };
//
// export default Header;

// src/components/layout/Header.jsx - Con mejor UX
import { useState, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
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

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200"
            >
              🚗 AutoTracker
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

            {/* Auth buttons y Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle - Posicionado antes de los botones de auth */}
              <ThemeToggle />

              {isAuthenticated ? (
                /* User menu */
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center text-sm rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200">
                    <span className="sr-only">Abrir menú de usuario</span>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-6 w-6" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">
                        {user?.full_name || 'Usuario'}
                      </span>
                    </div>
                  </Menu.Button>
                  <Transition
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={cn(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                            )}
                          >
                            <Cog6ToothIcon className="mr-3 h-5 w-5" />
                            Mi Perfil
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={cn(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                            )}
                          >
                            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                            Cerrar Sesión
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <div className="flex items-center space-x-4">
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
            {/* Theme Toggle para móvil - Posición más natural */}
            <ThemeToggle />

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
                      <UserIcon className="h-10 w-10 text-gray-400 dark:text-gray-300" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                        {user?.full_name}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {user?.email}
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