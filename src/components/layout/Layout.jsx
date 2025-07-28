// src/components/layout/Layout.jsx
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import Header from './Header';
import ParticleBackground from '../ui/ParticleBackground';
import { cn } from '../../utils';

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme } = useTheme();

  // Páginas que no necesitan el header (como login y register)
  const hideHeaderRoutes = ['/login', '/register'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

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
        <div className="relative z-10">
          {children}
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

      <div className="relative z-10">
        {!shouldHideHeader && <Header />}
        <main className={cn(
          'transition-all duration-300',
          !shouldHideHeader && 'pt-0' // El header ya tiene margin
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;