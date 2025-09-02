// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MovieCarousel } from '../components/cinema/MovieCarousel';
import { MovieGrid } from '../components/cinema/MovieGrid';
import {FloatingParticles, PremiumButton} from '../components/ui';
import {mockMovies} from "../mocks/movies.js";

const HomePage = () => {
  const [carteleraMovies, setCarteleraMovies] = useState([]);
  const [prontoMovies, setProntoMovies] = useState([]);

  useEffect(() => {
    // Simular datos hasta que tengamos backend
    const mockCarteleraMovies = [
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
      {
        id: 3,
        title: 'Demon Slayer Kimetsu no Yaiba',
        originalTitle: 'Demon Slayer: Kimetsu no Yaiba - Castillo Infinito',
        genre: 'Acción, Animación, Aventura, Fantasía, Suspenso',
        duration: '150 Min',
        ageRating: 'Exclusiva para Mayores de 15 años',
        posterImage: '/api/placeholder/300/450',
        status: 'PREVENTA'
      },
      {
        id: 4,
        title: 'The Roses',
        originalTitle: 'Los Roses',
        genre: 'Comedia, Drama',
        duration: '108 Min',
        ageRating: 'Exclusiva para Mayores de 15 años',
        posterImage: '/api/placeholder/300/450',
        status: 'ESTRENO'
      },
      {
        id: 5,
        title: 'Freakier Friday',
        originalTitle: 'Otro Viernes de Locos',
        genre: 'Comedia, Familia, Fantasía',
        duration: '111 Min',
        ageRating: 'Recomendada para Mayores de 7 años',
        posterImage: '/api/placeholder/300/450',
        status: null
      },
      {
        id: 6,
        title: 'Sketch',
        originalTitle: 'Sketch Dibujos Animados',
        genre: 'Aventura, Comedia, Fantasía',
        duration: '135 Min',
        ageRating: 'Exclusiva para Mayores de 15 años',
        posterImage: '/api/placeholder/300/450',
        status: null
      },
      {
        id: 7,
        title: 'Captain Sampling',
        originalTitle: 'Captain Sampling',
        genre: 'Aventura, Ciencia Ficción',
        duration: '145 Min',
        ageRating: 'Exclusiva para Mayores de 12 años',
        posterImage: '/api/placeholder/300/450',
        status: null
      },
      {
        id: 8,
        title: 'Weapons',
        originalTitle: 'La Rosa de la Desaparición',
        genre: 'Misterio, Terror',
        duration: '120 Min',
        ageRating: 'Exclusiva para Mayores de 15 años',
        posterImage: '/api/placeholder/300/450',
        status: null
      }
    ];

    const mockProntoMovies = [
      {
        id: 9,
        title: 'Argonauts: Rescue',
        originalTitle: 'Argonauts Rescue',
        genre: 'Aventura',
        duration: '134 Min',
        ageRating: 'Recomendada para Mayores de 7 años',
        posterImage: '/api/placeholder/300/450',
        releaseDate: 'Concierto - 2025 May'
      },
      {
        id: 10,
        title: 'Putin',
        originalTitle: 'Putin',
        genre: 'Biografía',
        duration: '165 Min',
        ageRating: 'Exclusiva para Mayores de 18 años',
        posterImage: '/api/placeholder/300/450',
        releaseDate: 'Concierto - 2025 May'
      },
      {
        id: 11,
        title: 'BTS 2016 Live The Most Beautiful Moment in Life On Stage: Epilogue Remastered',
        originalTitle: 'BTS 2016 Live The Most Beautiful Moment in Life On Stage: Epilogue Remastered',
        genre: 'Concierto',
        duration: '105 Min',
        ageRating: 'Concierto',
        posterImage: '/api/placeholder/300/450',
        releaseDate: 'Concierto - 2025 May'
      },
      {
        id: 12,
        title: 'BTS 2017 Live Trilogy EPISODE III THE WINGS TOUR THE FINAL Remastered',
        originalTitle: 'BTS 2017 Live Trilogy EPISODE III THE WINGS TOUR THE FINAL Remastered',
        genre: 'Concierto',
        duration: '105 Min',
        ageRating: 'Concierto',
        posterImage: '/api/placeholder/300/450',
        releaseDate: 'Concierto - 2025 May'
      }
    ];

    setCarteleraMovies(mockCarteleraMovies);
    setProntoMovies(mockProntoMovies);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative">
        <MovieCarousel movies={mockMovies} />
      </section>

      {/* En Cartelera Section */}
      <section className="py-16 relative">
        <FloatingParticles count={20} className="opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">EN CARTELERA</h2>
            <PremiumButton variant="ghost" asChild>
              <Link to="/cartelera">Ver Todo</Link>
            </PremiumButton>
          </div>

          <MovieGrid
            movies={carteleraMovies.slice(0, 8)}
            className="grid-cols-2 md:grid-cols-4"
          />
        </div>
      </section>

      {/* Pronto Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">PRONTO</h2>
            <PremiumButton variant="ghost" asChild>
              <Link to="/pronto">Ver Todo</Link>
            </PremiumButton>
          </div>

          <MovieGrid
            movies={prontoMovies}
            className="grid-cols-2 md:grid-cols-4"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
