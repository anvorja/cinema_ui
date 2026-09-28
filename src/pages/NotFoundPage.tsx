// src/pages/NotFoundPage.tsx
import { Link, useNavigate } from 'react-router-dom';
import FlapText from '../components/board/FlapText';
import { PremiumButton } from '../components/common';

const suggestions = [
  { name: 'Cartelera', path: '/', description: 'Lo que está en cines ahora' },
  { name: 'Comidas', path: '/comidas', description: 'El menú de confitería' },
  { name: 'Mis compras', path: '/profile/purchases', description: 'Tus boletas y sus códigos QR' },
];

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-4 py-12 sm:px-6">
      <p className="font-data text-sm text-[#f0644d]">Estado: sin salida</p>
      <h1 className="mt-3">
        <FlapText text="Página no encontrada" size="clamp(2.25rem, 7vw, 4.5rem)" />
      </h1>
      <p className="mt-5 max-w-[60ch] text-[17px] text-[#c3bfb2]">
        La dirección que abriste no existe o cambió de lugar. Elige a dónde quieres ir.
      </p>

      <ul className="mt-8 border-t border-[#46464c]">
        {suggestions.map(({ name, path, description }) => (
          <li key={path} className="border-b border-[#2c2c30]">
            <Link to={path} className="group flex min-h-[64px] items-center justify-between gap-4 px-2 py-3 hover:bg-[#151517]">
              <span>
                <span className="block font-board text-2xl font-bold tracking-wide uppercase group-hover:text-[#f2b705]">{name}</span>
                <span className="block text-sm text-[#8f8b80]">{description}</span>
              </span>
              <span aria-hidden="true" className="font-data text-[#f2b705]">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <PremiumButton variant="secondary" onClick={() => navigate(-1)}>Volver a la página anterior</PremiumButton>
      </div>
    </div>
  );
};

export default NotFoundPage;
