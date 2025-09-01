// src/pages/CarteleraPage.jsx
import { useState, useEffect } from 'react';
import { MovieGrid } from '../components/cinema/MovieGrid';
import {FloatingParticles} from "../components/ui/index.js";


const CarteleraPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadMovies = async () => {
      setLoading(true);
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const carteleraMovies = [
        {
          id: 1,
          title: 'Un Poeta',
          originalTitle: 'Un Poeta',
          genre: 'Comedia',
          duration: '129 Min',
          ageRating: 'Recomendada para Mayores de 12 años',
          posterImage: '/api/placeholder/300/450',
          status: 'ESTRENO'
        },
        {
          id: 2,
          title: 'The Conjuring: Last Rites',
          originalTitle: 'El Conjuro 4: Últimos Ritos',
          genre: 'Suspenso, Terror, Misterio',
          duration: '135 Min',
          ageRating: 'Exclusiva para Mayores de 15 años',
          posterImage: '/api/placeholder/300/450',
          status: 'PREVENTA'
        },
        // ... más películas
      ];

      setMovies(carteleraMovies);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando películas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <FloatingParticles count={30} className="opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">EN CARTELERA</h1>
          <p className="text-white/80 text-lg">Descubre las mejores películas en exhibición</p>
        </div>

        <MovieGrid movies={movies} />
      </div>
    </div>
  );
};

export default CarteleraPage;
