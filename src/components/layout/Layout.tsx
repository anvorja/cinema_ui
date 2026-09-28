// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import Footer from './Footer';
import useBoardWorld from '../board/useBoardWorld';

const Layout = () => {
  // El mundo "tablero" se aplica al <body> para que los portales de Radix hereden los tokens.
  useBoardWorld();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-board-amber focus:px-4 focus:py-2 focus:font-board focus:font-bold focus:text-board-onamber"
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
