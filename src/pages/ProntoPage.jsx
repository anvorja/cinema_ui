// src/pages/ProntoPage.jsx
import { useState, useEffect } from 'react';
import { MovieGrid } from '../components/cinema/MovieGrid';
import {FloatingParticles} from "../components/ui/index.js";


const ProntoPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const prontoMovies = [
        {
          id: 1,
          title: 'The Conjuring: Last Rites',
          originalTitle: 'El Conjuro 4: Últimos Ritos',
          genre: 'Suspenso, Terror, Misterio',
          duration: '135 Min',
          ageRating: 'Exclusiva para Mayores de 15 años',
          posterImage: '/api/placeholder/300/450',
          status: 'PREVENTA',
          releaseDate: '04 Sept 2025'
        },
        {
          id: 2,
          title: 'Demon Slayer Kimetsu no Yaiba',
          originalTitle: 'Demon Slayer: Kimetsu no Yaiba - Castillo Infinito',
          genre: 'Acción, Animación, Aventura, Fantasía, Suspenso',
          duration: '150 Min',
          ageRating: 'Exclusiva para Mayores de 15 años',
          posterImage: '/api/placeholder/300/450',
          status: 'PREVENTA',
          releaseDate: '11 Sept 2025'
        },
        {
          id: 3,
          title: 'BTS 2016 Live The Most Beautiful Moment in Life On Stage',
          originalTitle: 'BTS 2016 Live The Most Beautiful Moment in Life On Stage: Epilogue Remastered',
          genre: 'Concierto',
          duration: '105 Min',
          ageRating: 'Concierto',
          posterImage: '/api/placeholder/300/450',
          releaseDate: 'Concierto - 2025 May'
        },
        {
          id: 4,
          title: 'BTS 2017 Live Trilogy EPISODE III THE WINGS TOUR',
          originalTitle: 'BTS 2017 Live Trilogy EPISODE III THE WINGS TOUR THE FINAL Remastered',
          genre: 'Concierto',
          duration: '105 Min',
          ageRating: 'Concierto',
          posterImage: '/api/placeholder/300/450',
          releaseDate: 'Concierto - 2025 May'
        }
      ];

      setMovies(prontoMovies);
      setLoading(false);
    };

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando próximos estrenos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <FloatingParticles count={30} className="opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">PRONTO</h1>
          <p className="text-white/80 text-lg">Los próximos estrenos que no te puedes perder</p>
        </div>

        <MovieGrid movies={movies} showReleaseDate />
      </div>
    </div>
  );
};

export default ProntoPage;
