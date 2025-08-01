// // src/components/layout/Header.jsx - Diseño combinado
// import { useState, Fragment, useMemo, useCallback } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react';
// import {
//   Bars3Icon,
//   XMarkIcon,
//   UserIcon,
//   ArrowRightOnRectangleIcon,
//   BellIcon
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
//   const mockUser = {
//     email: user?.email || 'usuario@tucarro.com',
//     notifications: 3
//   };
//
//   return (
//     <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo - Con estilo glassmórfico */}
//           <div className="flex items-center">
//             <Link
//               to="/"
//               className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent transition-colors duration-200"
//             >
//               🚗 TuCarro
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
//             {/* Auth buttons y controles del usuario */}
//             <div className="flex items-center space-x-4">
//               {isAuthenticated ? (
//                 <>
//                   {/* Theme Toggle */}
//                   <ThemeToggle />
//
//                   {/* Notifications */}
//                   <div className="relative">
//                     <button className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors duration-200">
//                       <BellIcon className="h-6 w-6" />
//                       {mockUser.notifications > 0 && (
//                         <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
//                           {mockUser.notifications}
//                         </span>
//                       )}
//                     </button>
//                   </div>
//
//                   {/* User menu - Con diseño glassmórfico */}
//                   <Menu as="div" className="relative">
//                     <Menu.Button className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200">
//                       <span className="font-medium">
//                         {mockUser.email}
//                       </span>
//                     </Menu.Button>
//
//                     <Transition
//                       as={Fragment}
//                       enter="transition ease-out duration-100"
//                       enterFrom="transform opacity-0 scale-95"
//                       enterTo="transform opacity-100 scale-100"
//                       leave="transition ease-in duration-75"
//                       leaveFrom="transform opacity-100 scale-100"
//                       leaveTo="transform opacity-0 scale-95"
//                     >
//                       <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right">
//                         {/* Menú glassmórfico */}
//                         <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-lg shadow-2xl p-0">
//                           {/* User Info Header */}
//                           <div className="p-4 border-b border-white/10">
//                             <div className="flex items-center gap-3">
//                               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
//                                 {mockUser.email.charAt(0).toUpperCase()}
//                               </div>
//                               <div>
//                                 <p className="font-medium text-gray-900 dark:text-white">{mockUser.email}</p>
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 mt-1">
//                                   Usuario Premium
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//
//                           {/* Menu Items */}
//                           <div className="p-2">
//                             <Menu.Item>
//                               {({ active }) => (
//                                 <Link
//                                   to="/profile"
//                                   className={cn(
//                                     'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-200',
//                                     active ? 'bg-white/10' : ''
//                                   )}
//                                 >
//                                   <UserIcon className="w-4 h-4" />
//                                   Mi Perfil
//                                 </Link>
//                               )}
//                             </Menu.Item>
//
//                             <Menu.Item>
//                               {({ active }) => (
//                                 <button
//                                   className={cn(
//                                     'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left text-gray-700 dark:text-gray-200',
//                                     active ? 'bg-white/10' : ''
//                                   )}
//                                   disabled
//                                 >
//                                   <BellIcon className="w-4 h-4" />
//                                   Notificaciones
//                                   {mockUser.notifications > 0 && (
//                                     <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                                       {mockUser.notifications}
//                                     </span>
//                                   )}
//                                 </button>
//                               )}
//                             </Menu.Item>
//                           </div>
//
//                           {/* Logout */}
//                           <div className="p-2 border-t border-white/10">
//                             <Menu.Item>
//                               {({ active }) => (
//                                 <button
//                                   onClick={handleLogout}
//                                   className={cn(
//                                     'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left',
//                                     'text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-500/10',
//                                     active ? 'bg-red-500/10' : ''
//                                   )}
//                                 >
//                                   <ArrowRightOnRectangleIcon className="w-4 h-4" />
//                                   Cerrar Sesión
//                                 </button>
//                               )}
//                             </Menu.Item>
//                           </div>
//                         </div>
//                       </Menu.Items>
//                     </Transition>
//                   </Menu>
//                 </>
//               ) : (
//                 <div className="flex items-center space-x-4">
//                   <ThemeToggle />
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
//             <ThemeToggle />
//
//             {isAuthenticated && (
//               <div className="relative">
//                 <button className="p-2 text-gray-400 dark:text-gray-300">
//                   <BellIcon className="h-5 w-5" />
//                   {mockUser.notifications > 0 && (
//                     <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                       {mockUser.notifications}
//                     </span>
//                   )}
//                 </button>
//               </div>
//             )}
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
//                       <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
//                         {mockUser.email.charAt(0).toUpperCase()}
//                       </div>
//                     </div>
//                     <div className="ml-3">
//                       <div className="text-base font-medium text-gray-800 dark:text-gray-200">
//                         {mockUser.email}
//                       </div>
//                       <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                         Usuario Premium
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

// // propuesta 2
// // src/components/layout/Header.jsx - Diseño mejorado con mejor UX/UI
// import { useState, useMemo, useCallback } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Menu,
//   X,
//   User,
//   Settings,
//   LogOut,
//   Bell,
//   Home,
//   Car,
//   ChevronDown
// } from 'lucide-react';
// import { useAuth } from "../../hooks/useAuth";
// import Button from '../ui/Button';
// import { cn } from '../../utils';
// import ThemeToggle from '../ui/ThemeToggle';
//
// // Componentes shadcn/ui Dropdown Menu
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '../ui/dropdown-menu';
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
//     {
//       name: 'Inicio',
//       href: '/',
//       current: location.pathname === '/',
//       icon: Home
//     },
//     ...(isAuthenticated ? [
//       {
//         name: 'Mis Autos',
//         href: '/cars',
//         current: location.pathname === '/cars',
//         icon: Car
//       },
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
//   const mockUser = {
//     email: user?.email || 'andres.vorja@test.com',
//     notifications: 3
//   };
//
//   return (
//     <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/5 dark:shadow-gray-900/20 sticky top-0 z-50">
//       <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         {/* Logo con efecto glassmórfico */}
//         <div className="flex items-center">
//           <Link
//             to="/"
//             className="group flex items-center space-x-3 text-xl font-bold transition-all duration-300 hover:scale-105"
//           >
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
//               <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
//                 <span className="text-2xl mr-1">🚗</span>
//                 TuCarro
//               </div>
//             </div>
//           </Link>
//         </div>
//
//         {/* Desktop Navigation - Estilo más atractivo */}
//         <div className="hidden md:flex items-center space-x-1">
//           {navigation.map((item) => {
//             const IconComponent = item.icon;
//             return (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={cn(
//                   "group relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
//                   "hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25",
//                   item.current
//                     ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
//                     : "text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
//                 )}
//               >
//                 <IconComponent className="h-4 w-4" />
//                 {item.name}
//                 {item.current && (
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30"></div>
//                 )}
//               </Link>
//             );
//           })}
//
//           {/* Auth Section con mejor estilo */}
//           <div className="flex items-center space-x-3 ml-8 pl-8 border-l border-gray-200/50 dark:border-gray-700/50">
//             <ThemeToggle />
//
//             {isAuthenticated ? (
//               <>
//                 {/* Notifications con animación */}
//                 <div className="relative group">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="relative h-10 w-10 p-0 rounded-full transition-all duration-300 hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                   >
//                     <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
//                     {mockUser.notifications > 0 && (
//                       <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
//                         {mockUser.notifications}
//                       </span>
//                     )}
//                   </Button>
//                 </div>
//
//                 {/* User Dropdown mejorado */}
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       className="group flex items-center gap-3 px-4 py-2 h-10 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:shadow-lg hover:shadow-gray-900/10"
//                     >
//                       <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
//                         {mockUser.email.charAt(0).toUpperCase()}
//                       </div>
//                       <div className="hidden sm:flex flex-col items-start">
//                         <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
//                           {mockUser.email.split('@')[0]}
//                         </span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">
//                           Usuario Premium
//                         </span>
//                       </div>
//                       <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all duration-300 group-hover:rotate-180" />
//                     </Button>
//                   </DropdownMenuTrigger>
//
//                   <DropdownMenuContent
//                     className="w-72 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-900/20"
//                     align="end"
//                     sideOffset={8}
//                   >
//                     {/* User Info Header glassmórfico */}
//                     <DropdownMenuLabel className="p-4 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-100/50 dark:border-blue-800/30 backdrop-blur-sm">
//                       <div className="flex items-center gap-3">
//                         <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
//                           {mockUser.email.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-semibold text-gray-900 dark:text-white truncate text-base">
//                             {mockUser.email}
//                           </p>
//                           <div className="flex items-center gap-2 mt-1">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm">
//                               ✨ Premium
//                             </span>
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                               Activo
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </DropdownMenuLabel>
//
//                     <DropdownMenuSeparator className="my-2" />
//
//                     {/* Menu Items con iconos y hover effects */}
//                     <DropdownMenuItem asChild>
//                       <Link
//                         to="/profile"
//                         className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 group"
//                       >
//                         <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//                         <span className="font-medium">Mi Perfil</span>
//                         <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                           <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
//                         </div>
//                       </Link>
//                     </DropdownMenuItem>
//
//                     <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 group">
//                       <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
//                       <span className="font-medium">Notificaciones</span>
//                       <div className="ml-auto flex items-center gap-2">
//                         {mockUser.notifications > 0 && (
//                           <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
//                             {mockUser.notifications}
//                           </span>
//                         )}
//                         <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                           <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
//                         </div>
//                       </div>
//                     </DropdownMenuItem>
//
//                     <DropdownMenuSeparator className="my-2" />
//
//                     <DropdownMenuItem
//                       onClick={handleLogout}
//                       className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 group"
//                     >
//                       <LogOut className="h-4 w-4" />
//                       <span className="font-medium">Cerrar Sesión</span>
//                       <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                         <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
//                       </div>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <Button variant="ghost" size="sm" asChild className="rounded-xl hover:scale-105 transition-all duration-300">
//                   <Link to="/login">
//                     Iniciar Sesión
//                   </Link>
//                 </Button>
//                 <Button size="sm" asChild className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
//                   <Link to="/register">
//                     Registrarse
//                   </Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//
//         {/* Mobile menu button */}
//         <div className="flex items-center gap-3 md:hidden">
//           <ThemeToggle />
//
//           {isAuthenticated && (
//             <div className="relative">
//               <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
//                 <Bell className="h-4 w-4" />
//                 {mockUser.notifications > 0 && (
//                   <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                     {mockUser.notifications}
//                   </span>
//                 )}
//               </Button>
//             </div>
//           )}
//
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-9 w-9 p-0 rounded-full transition-all duration-300 hover:scale-110"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             <span className="sr-only">Abrir menú principal</span>
//             {mobileMenuOpen ? (
//               <X className="h-5 w-5" />
//             ) : (
//               <Menu className="h-5 w-5" />
//             )}
//           </Button>
//         </div>
//       </nav>
//
//       {/* Mobile menu mejorado */}
//       {mobileMenuOpen && (
//         <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
//           <div className="px-4 pt-2 pb-3 space-y-1">
//             {navigation.map((item) => {
//               const IconComponent = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={cn(
//                     "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
//                     item.current
//                       ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-l-4 border-blue-600"
//                       : "text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 border-l-4 border-transparent hover:border-blue-300"
//                   )}
//                   onClick={closeMobileMenu}
//                 >
//                   <IconComponent className="h-5 w-5" />
//                   {item.name}
//                 </Link>
//               );
//             })}
//
//             {isAuthenticated ? (
//               <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
//                 <div className="flex items-center px-4 py-3 mb-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl">
//                   <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
//                     {mockUser.email.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="ml-3 flex-1">
//                     <div className="text-base font-medium text-gray-900 dark:text-white">
//                       {mockUser.email}
//                     </div>
//                     <div className="text-sm text-gray-500 dark:text-gray-400">
//                       Usuario Premium
//                     </div>
//                   </div>
//                 </div>
//
//                 <div className="space-y-1">
//                   <Link
//                     to="/profile"
//                     className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
//                     onClick={closeMobileMenu}
//                   >
//                     <User className="h-5 w-5" />
//                     Mi Perfil
//                   </Link>
//
//                   <button
//                     onClick={handleMobileLogout}
//                     className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300"
//                   >
//                     <LogOut className="h-5 w-5" />
//                     Cerrar Sesión
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-4 space-y-2">
//                 <Link
//                   to="/login"
//                   className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-all duration-300"
//                   onClick={closeMobileMenu}
//                 >
//                   <User className="h-5 w-5" />
//                   Iniciar Sesión
//                 </Link>
//
//                 <Link
//                   to="/register"
//                   className="flex items-center gap-3 px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg"
//                   onClick={closeMobileMenu}
//                 >
//                   <User className="h-5 w-5" />
//                   Registrarse
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };
//
// export default Header;

// src/components/layout/Header.jsx - Diseño mejorado con mejor UX/UI
import { useState, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  Home,
  Car,
  ChevronDown
} from 'lucide-react';
import { useAuth } from "../../hooks/useAuth";
import Button from '../ui/Button';
import { cn } from '../../utils';
import ThemeToggle from '../ui/ThemeToggle';

// Componentes shadcn/ui Dropdown Menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
    {
      name: 'Inicio',
      href: '/',
      current: location.pathname === '/',
      icon: Home
    },
    ...(isAuthenticated ? [
      {
        name: 'Mis Autos',
        href: '/cars',
        current: location.pathname === '/cars',
        icon: Car
      },
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
    email: user?.email || 'andres.vorja@test.com',
    notifications: 3
  };

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/5 dark:shadow-gray-900/20 sticky top-0 z-50">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo con efecto glassmórfico */}
        <div className="flex items-center">
          <Link
            to="/"
            className="group flex items-center space-x-3 text-xl font-bold transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                <span className="text-2xl mr-1">🚗</span>
                TuCarro
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Estilo más atractivo */}
        <div className="hidden md:flex items-center space-x-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                  "hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25",
                  item.current
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                <IconComponent className="h-4 w-4" />
                {item.name}
                {item.current && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30"></div>
                )}
              </Link>
            );
          })}

          {/* Auth Section con mejor estilo */}
          <div className="flex items-center space-x-3 ml-6 pl-3 border-l border-gray-200/50 dark:border-gray-700/50">
            <ThemeToggle height="sm"/>

            {isAuthenticated ? (
              <>
                {/* Notifications con animación */}
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-10 w-10 p-0 rounded-full transition-all duration-300 hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                    {mockUser.notifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                        {mockUser.notifications}
                      </span>
                    )}
                  </Button>
                </div>

                {/* User Dropdown mejorado */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="group flex items-center gap-3 px-4 py-2 h-10 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:shadow-lg hover:shadow-gray-900/10"
                    >
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {mockUser.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                          {mockUser.email.split('@')[0]}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Usuario Premium
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all duration-300 group-hover:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-72 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-900/20"
                    align="end"
                    sideOffset={8}
                  >
                    {/* User Info Header glassmórfico */}
                    <DropdownMenuLabel className="p-4 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-100/50 dark:border-blue-800/30 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                          {mockUser.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate text-base">
                            {mockUser.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm">
                              ✨ Premium
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Activo
                            </span>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-2" />

                    {/* Menu Items con iconos y hover effects */}
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 group"
                      >
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">Mi Perfil</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 group">
                      <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium">Notificaciones</span>
                      <div className="ml-auto flex items-center gap-2">
                        {mockUser.notifications > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                            {mockUser.notifications}
                          </span>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 group"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Cerrar Sesión</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="rounded-xl hover:scale-105 transition-all duration-300">
                  <Link to="/login">
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button size="sm" asChild className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Link to="/register">
                    Registrarse
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          {isAuthenticated && (
            <div className="relative">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                <Bell className="h-4 w-4" />
                {mockUser.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {mockUser.notifications}
                  </span>
                )}
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-full transition-all duration-300 hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Abrir menú principal</span>
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu mejorado */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                    item.current
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-l-4 border-blue-600"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 border-l-4 border-transparent hover:border-blue-300"
                  )}
                  onClick={closeMobileMenu}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            {isAuthenticated ? (
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
                <div className="flex items-center px-4 py-3 mb-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {mockUser.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {mockUser.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Usuario Premium
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-5 w-5" />
                    Mi Perfil
                  </Link>

                  <button
                    onClick={handleMobileLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  <User className="h-5 w-5" />
                  Iniciar Sesión
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg"
                  onClick={closeMobileMenu}
                >
                  <User className="h-5 w-5" />
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;