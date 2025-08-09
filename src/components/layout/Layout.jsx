// src/components/layout/Layout.jsx
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import Header from './Header';
import ParticleBackground from '../ui/ParticleBackground';
import { cn } from '../../utils';
import {Footer} from "./Footer.jsx";

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme } = useTheme();

  // Páginas que no necesitan el header (como login y register)
  const hideHeaderRoutes = ['/login', '/register'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  // Páginas que no deben mostrar el footer (solo login)
  const hideFooterRoutes = ['/login'];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  // Páginas de autenticación tienen layout diferente
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className={cn(
        'min-h-screen transition-colors duration-500',
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/50 text-white'
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 text-gray-900'
      )}>
        <ParticleBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
          </div>
          {/* Solo mostrar footer en register, no en login */}
          {!shouldHideFooter && <Footer />}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-500',
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/50 text-white'
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 text-gray-900'
    )}>
      <ParticleBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {!shouldHideHeader && <Header />}
        <main className={cn(
          'flex-grow transition-all duration-300',
          !shouldHideHeader && 'pt-0'
        )}>
          {children}
        </main>
        {/* Footer siempre visible en páginas normales */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;