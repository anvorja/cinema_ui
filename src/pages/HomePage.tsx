// src/pages/HomePage.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { MovieCarousel } from '../components/cinema/MovieCarousel';
import { MovieGrid } from '../components/cinema/MovieGrid';
import { FloatingParticles, PremiumButton } from '../components/common';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { FilmIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useTransformedHomeData, useHomeStats } from '../hooks/useTransformedMovies';

const TABS = ['cartelera', 'pronto', 'preventa'] as const;
type Tab = typeof TABS[number];

const HomePage = () => {
  const homeData = useTransformedHomeData();
  const stats = useHomeStats(homeData);

  // Mobile tabs state
  const [activeTab, setActiveTab] = useState<Tab>('cartelera');
  const [mobileSearch, setMobileSearch] = useState('');

  const mobileMovies = useMemo(() => {
    let movies =
      activeTab === 'cartelera' ? homeData.cartelera.movies
      : activeTab === 'pronto'  ? homeData.pronto
      :                           homeData.presales.movies;
    if (!mobileSearch.trim()) return movies;
    const q = mobileSearch.toLowerCase();
    return movies.filter(m =>
      m.title?.toLowerCase().includes(q) ||
      m.original_title?.toLowerCase().includes(q)
    );
  }, [activeTab, mobileSearch, homeData]);

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

      {/* ── MOBILE: Tabs + Search + Grid ── */}
      <section className="md:hidden py-6 relative">
        <div className="px-4">
          {/* Tabs */}
          <div className="flex border-b border-white/20 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setMobileSearch(''); }}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/45 hover:text-white/70'
                }`}
              >
                {tab === 'cartelera' ? 'Cartelera' : tab === 'pronto' ? 'Pronto' : 'Preventa'}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative mb-5">
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="Buscar películas..."
              className="w-full bg-white/8 border border-white/20 rounded-full py-2.5 pl-4 pr-10 text-white placeholder:text-white/40 text-sm outline-none focus:border-white/40 focus:bg-white/12 transition-all"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>

          {/* Movie grid */}
          {homeData.loading && mobileMovies.length === 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-white/10 rounded-lg mb-2" />
                  <div className="h-3 bg-white/10 rounded mb-1" />
                  <div className="h-2.5 bg-white/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : mobileMovies.length > 0 ? (
            <MovieGrid movies={mobileMovies} showDetailsButton={false} />
          ) : (
            <div className="py-12 text-center text-white/40 text-sm">
              {mobileSearch ? `Sin resultados para "${mobileSearch}"` : 'Sin películas disponibles'}
            </div>
          )}
        </div>
      </section>

      {/* ── DESKTOP: secciones originales ── */}
      {/* En Cartelera Section */}
      <section className="hidden md:block py-16 relative">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
              className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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

      {/* Pronto Section (desktop only) */}
      <section className="hidden md:block py-16 relative">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
              className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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