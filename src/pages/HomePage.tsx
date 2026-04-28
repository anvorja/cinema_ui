// src/pages/HomePage.jsx
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { MovieCarousel } from '../components/cinema/MovieCarousel';
import { MovieGrid } from '../components/cinema/MovieGrid';
import { FloatingParticles } from '../components/common';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { FilmIcon } from '@heroicons/react/24/outline';
import { useTransformedHomeData, useHomeStats } from '../hooks/useTransformedMovies';

const TABS = ['cartelera', 'pronto', 'preventa'] as const;
type Tab = typeof TABS[number];

const tabLabel = (tab: Tab) =>
  tab === 'cartelera' ? 'Cartelera' : tab === 'pronto' ? 'Pronto' : 'Preventa';

const HomePage = () => {
  const homeData = useTransformedHomeData();
  const stats = useHomeStats(homeData);

  const [activeTab, setActiveTab] = useState<Tab>('cartelera');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = useMemo(() => {
    const movies =
      activeTab === 'cartelera' ? homeData.cartelera.movies
      : activeTab === 'pronto'  ? homeData.pronto
      :                           homeData.presales.movies;
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase();
    return movies.filter(m =>
      m.title?.toLowerCase().includes(q) ||
      m.original_title?.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery, homeData]);

  const isTabLoading = useMemo(() => {
    if (activeTab === 'cartelera') return homeData.cartelera.loading && homeData.cartelera.movies.length === 0;
    if (activeTab === 'pronto') return (homeData.comingSoon.loading || homeData.presales.loading) && homeData.pronto.length === 0;
    return homeData.presales.loading && homeData.presales.movies.length === 0;
  }, [activeTab, homeData]);

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

      {/* Tabs + Search + Grid */}
      <section className="py-6 md:py-10 relative">
        <FloatingParticles count={20} className="opacity-20 hidden md:block" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex border-b border-white/20 mb-4 md:mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                className={`flex-1 py-3 md:py-4 text-sm md:text-base font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/45 hover:text-white/70'
                }`}
              >
                {tabLabel(tab)}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative mb-5 md:mb-8 md:max-w-lg md:mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar películas..."
              className="w-full bg-white/8 border border-white/20 rounded-full py-2.5 md:py-3 pl-4 md:pl-5 pr-10 md:pr-11 text-white placeholder:text-white/40 text-sm outline-none focus:border-white/40 focus:bg-white/12 transition-all"
            />
            <Search className="absolute right-3.5 md:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>

          {/* Movie grid */}
          {isTabLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-white/10 rounded-lg mb-2" />
                  <div className="h-3 bg-white/10 rounded mb-1" />
                  <div className="h-2.5 bg-white/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredMovies.length > 0 ? (
            <MovieGrid
              movies={filteredMovies}
              className="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              showDetailsButton={false}
            />
          ) : (
            <div className="py-12 text-center text-white/40 text-sm">
              {searchQuery ? `Sin resultados para "${searchQuery}"` : 'Sin películas disponibles'}
            </div>
          )}
        </div>
      </section>

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
