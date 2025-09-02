// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import {FloatingParticles} from "../ui/index.js";
import Footer from "./Footer.jsx";

const Layout = () => {
  return (
    <div className="min-h-screen">
      {/* Cinema Background with animated effects */}
      <div className="cinema-background fixed inset-0 -z-20" />

      {/* Global floating particles */}
      <FloatingParticles
        count={50}
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
      />

      {/* Header - Fixed position */}
      <Header />

      {/* Main content area */}
      <main className="relative">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;