// src/components/layout/Layout.tsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import Footer from './Footer';

const Layout = () => {
  // El mundo "tablero" se aplica al <body> para que los portales de Radix
  // (menús, hojas, diálogos) hereden los mismos tokens. El admin queda fuera.
  useEffect(() => {
    document.body.classList.add('board');
    return () => document.body.classList.remove('board');
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-[#f2b705] focus:px-4 focus:py-2 focus:font-board focus:font-bold focus:text-[#0c0c0d]"
      >
        IR AL CONTENIDO
      </a>
      <Header />
      <main id="contenido" className="relative flex-1 pt-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
