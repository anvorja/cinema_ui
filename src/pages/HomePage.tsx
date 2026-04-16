// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { MovieCarousel } from '../components/cinema/MovieCarousel';
import { MovieGrid } from '../components/cinema/MovieGrid';
import { FloatingParticles, PremiumButton } from '../components/common';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { FilmIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useTransformedHomeData, useHomeStats } from '../hooks/useTransformedMovies';

const HomePage = () => {
  const homeData = useTransformedHomeData();
  const stats = useHomeStats(homeData);

  // Si hay error crítico y no hay contenido
  if (homeData.error && homeData.isEmpty) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage
            title="Error al cargar el contenido"
            message="No pudimos cargar las películas. Por favor, intenta de nuevo."
            onRetry={() => homeData.refresh()}
            showRetry={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative">
        {homeData.featured.length > 0 ? (
          <MovieCarousel movies={homeData.featured} />
        ) : (
          <div className="h-[60vh] bg-gradient-to-b from-purple-900/20 to-black/40 flex items-center justify-center">
            {homeData.loading ? (
              <LoadingSpinner size="large" />
            ) : (
              <EmptyState
                icon={FilmIcon}
                title="Próximamente"
                message="Estamos preparando contenido increíble para ti"
              />
            )}
          </div>
        )}
      </section>

      {/* En Cartelera Section */}
      <section className="py-16 relative">
        <FloatingParticles count={20} className="opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FilmIcon className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white">EN CARTELERA</h2>
              {stats?.hasContent && (
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  {homeData.cartelera.movies.length} películas
                </span>
              )}
            </div>
            <PremiumButton variant="ghost" asChild>
              <Link to="/cartelera">Ver Todo</Link>
            </PremiumButton>
          </div>

          {/* Contenido de cartelera */}
          {homeData.cartelera.loading && homeData.cartelera.movies.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-white/10 rounded-lg mb-3"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : homeData.cartelera.movies.length > 0 ? (
            <MovieGrid
              movies={homeData.cartelera.movies}
              className="grid-cols-2 md:grid-cols-4"
              showDetailsButton={false} // ⭐ Sin botón en Home
            />
          ) : (
            <EmptyState
              icon={FilmIcon}
              title="Sin películas en cartelera"
              message="No hay películas disponibles en este momento"
              action={
                homeData.cartelera.hasError ? (
                  <PremiumButton onClick={() => homeData.cartelera.refetch()} className="mt-4">
                    Reintentar
                  </PremiumButton>
                ) : null
              }
            />
          )}

          {/* Mostrar error si hay, pero con películas cargadas */}
          {homeData.cartelera.hasError && homeData.cartelera.movies.length > 0 && (
            <div className="mt-4">
              <ErrorMessage
                message="Hubo un problema al cargar algunas películas"
                variant="warning"
                showRetry={false}
              />
            </div>
          )}
        </div>
      </section>

      {/* Pronto Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="w-8 h-8 text-orange-400" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white">PRONTO</h2>
              {stats?.hasContent && (
                <span className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                  {homeData.pronto.length} próximos
                </span>
              )}
            </div>
            <PremiumButton variant="ghost" asChild>
              <Link to="/pronto">Ver Todo</Link>
            </PremiumButton>
          </div>

          {/* Contenido de próximos estrenos */}
          {(homeData.comingSoon.loading || homeData.presales.loading) && homeData.pronto.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-white/10 rounded-lg mb-3"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : homeData.pronto.length > 0 ? (
            <MovieGrid
              movies={homeData.pronto}
              className="grid-cols-2 md:grid-cols-4"
              showDetailsButton={false} // ⭐ Sin botón en Home
            />
          ) : (
            <EmptyState
              icon={CalendarDaysIcon}
              title="Sin próximos estrenos"
              message="No hay estrenos programados en este momento"
              action={
                (homeData.comingSoon.hasError || homeData.presales.hasError) ? (
                  <PremiumButton onClick={() => homeData.refresh()} className="mt-4">
                    Reintentar
                  </PremiumButton>
                ) : null
              }
            />
          )}

          {/* Mostrar error si hay, pero con películas cargadas */}
          {(homeData.comingSoon.hasError || homeData.presales.hasError) && homeData.pronto.length > 0 && (
            <div className="mt-4">
              <ErrorMessage
                message="Hubo un problema al cargar algunos próximos estrenos"
                variant="warning"
                showRetry={false}
              />
            </div>
          )}
        </div>
      </section>

      {/* Estadísticas rápidas (solo en desarrollo o para admin) */}
      {import.meta.env.NODE_ENV === 'development' && stats && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
          <h4 className="font-bold mb-2">📊 Estadísticas</h4>
          <div className="space-y-1">
            <p>🎬 Total películas: {stats.totalMovies}</p>
            <p>✅ Disponibles: {stats.availableMovies}</p>
            <p>❌ Agotadas: {stats.soldOutMovies}</p>
            <p>🎫 Ocupación: {stats.occupancyRate.toFixed(1)}%</p>
            <p>🎭 Géneros: {stats.genres.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;