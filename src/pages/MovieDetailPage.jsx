// src/pages/MovieDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {FloatingParticles, GlassCard, PremiumButton} from '../components/ui';
import { TheaterSelector } from '../components/cinema/TheaterSelector';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovieData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock movie data
      const mockMovie = {
        id: parseInt(id),
        title: 'The Conjuring: Last Rites',
        originalTitle: 'El Conjuro 4: Últimos Ritos',
        description: 'Cuando los investigadores paranormales Ed y Lorraine Warren se ven envueltos en otro aterrador caso relacionado con misteriosas criaturas, se ven obligados a resolverlo todo por última vez.',
        genre: 'Suspenso, Terror, Misterio',
        duration: '135 Min',
        releaseDate: '04-Sept-2025',
        ageRating: 'Exclusiva para Mayores de 15 años',
        director: 'Michael Chaves',
        actors: 'Vera Farmiga, Patrick Wilson, Madison Lawlor',
        language: 'Inglés',
        country: 'United States of America',
        posterImage: '/api/placeholder/400/600',
        backdropImage: '/api/placeholder/1920/1080',
        detailImage1: '/api/placeholder/600/400',
        detailImage2: '/api/placeholder/600/400'
      };

      // Mock theaters data
      const mockTheaters = [
        {
          id: 1,
          name: 'Chipichape',
          location: 'Cali, Valle del Cauca',
          showtimes: [
            { id: 1, time: '12:30 PM', format: '2D - Doblado', available: true },
            { id: 2, time: '3:20 PM', format: '2D - Doblado', available: true },
            { id: 3, time: '6:10 PM', format: '2D - Doblado', available: false }
          ]
        },
        {
          id: 2,
          name: 'Cosmocentro',
          location: 'Cali, Valle del Cauca',
          showtimes: [
            { id: 4, time: '2:15 PM', format: '2D - Subtitulado', available: true },
            { id: 5, time: '5:30 PM', format: '2D - Subtitulado', available: true }
          ]
        },
        {
          id: 3,
          name: 'Palmetto',
          location: 'Cali, Valle del Cauca',
          showtimes: [
            { id: 6, time: '1:45 PM', format: '2D - Doblado', available: true },
            { id: 7, time: '4:20 PM', format: '2D - Doblado', available: true },
            { id: 8, time: '7:00 PM', format: '2D - Doblado', available: true }
          ]
        },
        {
          id: 4,
          name: 'Río Cauca',
          location: 'Cali, Valle del Cauca',
          showtimes: [
            { id: 9, time: '3:00 PM', format: '2D - Subtitulado', available: true },
            { id: 10, time: '6:45 PM', format: '2D - Subtitulado', available: false }
          ]
        },
        {
          id: 5,
          name: 'Unicali',
          location: 'Cali, Valle del Cauca',
          showtimes: [
            { id: 11, time: '1:30 PM', format: '2D - Doblado', available: true },
            { id: 12, time: '4:15 PM', format: '2D - Doblado', available: true },
            { id: 13, time: '7:30 PM', format: '2D - Doblado', available: true }
          ]
        }
      ];

      // Generate dates for the next week
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
          id: i + 1,
          date: date,
          dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
          dayNumber: date.getDate(),
          monthName: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
        });
      }

      setMovie(mockMovie);
      setTheaters(mockTheaters);
      setSelectedDate(dates[0]);
      setLoading(false);
    };

    loadMovieData();
  }, [id]);

  const handleShowtimeSelect = (theater, showtime) => {
    setSelectedTheater(theater);
    setSelectedShowtime(showtime);
  };

  const handleContinue = () => {
    if (selectedTheater && selectedShowtime) {
      navigate(`/booking/${movie.id}/${selectedTheater.id}/${selectedShowtime.id}`, {
        state: {
          movie,
          theater: selectedTheater,
          showtime: selectedShowtime,
          selectedDate
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando información de la película...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Película no encontrada</p>
          <PremiumButton onClick={() => navigate('/cartelera')}>
            Volver a Cartelera
          </PremiumButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <FloatingParticles count={30} className="opacity-20" />

      {/* Hero Section with Movie Images */}
      <section className="relative h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={movie.backdropImage}
            alt={movie.title}
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'blur(2px)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

              {/* Poster Image */}
              <div className="flex justify-center lg:justify-start">
                <GlassCard variant="premium" className="p-3 premium-card">
                  <img
                    src={movie.posterImage}
                    alt={movie.title}
                    className="w-80 rounded-lg shadow-2xl"
                  />
                </GlassCard>
              </div>

              {/* Movie Info */}
              <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                    {movie.title}
                  </h1>
                  <h2 className="text-xl text-white/80 mb-6">
                    {movie.originalTitle}
                  </h2>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                      {movie.ageRating}
                    </span>
                    <span className="glass px-4 py-2 rounded-lg text-white">
                      {movie.duration}
                    </span>
                    <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
                      Preventa
                    </span>
                  </div>
                </div>

                <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
                  {movie.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Details and Theater Selection */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Movie Information */}
            <div className="lg:col-span-1">
              <GlassCard variant="premium" className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Información de la Película</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-1">Título Original</h4>
                    <p className="text-white">{movie.originalTitle}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-1">País de Origen</h4>
                    <p className="text-white">{movie.country}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-1">Director</h4>
                    <p className="text-white">{movie.director}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-1">Actores</h4>
                    <p className="text-white">{movie.actors}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white/70 mb-1">Idioma</h4>
                    <p className="text-white">{movie.language}</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Theater and Showtime Selection */}
            <div className="lg:col-span-2">
              <TheaterSelector
                theaters={theaters}
                selectedDate={selectedDate}
                onShowtimeSelect={handleShowtimeSelect}
                selectedTheater={selectedTheater}
                selectedShowtime={selectedShowtime}
              />

              {/* Continue Button */}
              {selectedTheater && selectedShowtime && (
                <div className="mt-8 text-center">
                  <PremiumButton
                    size="lg"
                    variant="premium"
                    onClick={handleContinue}
                    className="px-12"
                  >
                    Continuar con la Compra
                  </PremiumButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;
