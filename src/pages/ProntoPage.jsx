// src/pages/ProntoPage.jsx - CONECTADO AL BACKEND CON FLUJO DE COMPRA
import { useState, useEffect } from 'react';
import { MovieGrid } from '../components/cinema/MovieGrid';
import { FloatingParticles, GlassCard, PremiumButton } from "../components/ui/index.js";
import Footer from '../components/layout/Footer';
import { useComingSoonMovies, usePresaleMovies } from '../hooks/useMovies.js';
import { ExclamationTriangleIcon, FilmIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const ProntoPage = () => {
  // 🎬 CONECTAR AL BACKEND - Usar hooks reales
  const {
    movies: comingSoonMovies,
    loading: loadingComingSoon,
    error: errorComingSoon,
    refetch: refetchComingSoon
  } = useComingSoonMovies();

  const {
    movies: presaleMovies,
    loading: loadingPresales,
    error: errorPresales,
    refetch: refetchPresales
  } = usePresaleMovies();

  // Estados locales para UI
  const [activeTab, setActiveTab] = useState('coming-soon'); // 'coming-soon' | 'presales'
  const [allMovies, setAllMovies] = useState([]);

  // Combinar y procesar películas
  useEffect(() => {
    const combinedMovies = [
      ...comingSoonMovies.map(movie => ({ ...movie, category: 'coming-soon' })),
      ...presaleMovies.map(movie => ({ ...movie, category: 'presale' }))
    ];

    // Ordenar por fecha de estreno
    const sortedMovies = combinedMovies.sort((a, b) =>
      new Date(a.release_date) - new Date(b.release_date)
    );

    setAllMovies(sortedMovies);
  }, [comingSoonMovies, presaleMovies]);

  // Filtrar por tab activo
  const getFilteredMovies = () => {
    if (activeTab === 'coming-soon') {
      return allMovies.filter(movie => movie.category === 'coming-soon');
    } else if (activeTab === 'presales') {
      return allMovies.filter(movie => movie.category === 'presale');
    }
    return allMovies; // 'all'
  };

  const filteredMovies = getFilteredMovies();
  const isLoading = loadingComingSoon || loadingPresales;
  const hasError = errorComingSoon || errorPresales;

  // Manejar errores
  if (hasError && !isLoading && allMovies.length === 0) {
    return (
      <div className="min-h-screen pt-24">
        <FloatingParticles count={30} className="opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <GlassCard className="p-8">
              <ExclamationTriangleIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Error al Cargar Próximos Estrenos</h2>
              <p className="text-white/70 mb-6">
                {errorComingSoon || errorPresales}
              </p>
              <div className="flex gap-4 justify-center">
                <PremiumButton onClick={refetchComingSoon} variant="secondary">
                  Reintentar Próximos Estrenos
                </PremiumButton>
                <PremiumButton onClick={refetchPresales} variant="secondary">
                  Reintentar Preventas
                </PremiumButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && allMovies.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <FloatingParticles count={50} className="opacity-30" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando próximos estrenos...</p>
          <p className="text-white/60 text-sm mt-2">Conectando con el servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <FloatingParticles count={30} className="opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">PRONTO</h1>
          <p className="text-white/80 text-lg">Los próximos estrenos que no te puedes perder</p>
        </div>

        {/* 📊 Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard className="p-4 text-center">
            <FilmIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{allMovies.length}</div>
            <div className="text-white/60 text-sm">Próximos Estrenos</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <CalendarDaysIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{presaleMovies.length}</div>
            <div className="text-white/60 text-sm">En Preventa</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <div className="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">🎫</span>
            </div>
            <div className="text-2xl font-bold text-white">{comingSoonMovies.length}</div>
            <div className="text-white/60 text-sm">Próximamente</div>
          </GlassCard>
        </div>

        {/* 🔄 Tabs de categorías */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Todos ({allMovies.length})
            </button>

            <button
              onClick={() => setActiveTab('coming-soon')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'coming-soon'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Próximamente ({comingSoonMovies.length})
            </button>

            <button
              onClick={() => setActiveTab('presales')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'presales'
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              En Preventa ({presaleMovies.length})
            </button>
          </div>
        </div>

        {/* 🎬 Grid de películas */}
        {filteredMovies.length > 0 ? (
          <MovieGrid
            movies={filteredMovies}
            showReleaseDate={true}
            enablePurchase={true}
            purchaseButtonText="PREVENTA"
            showPreventaLabel={activeTab === 'presales' || activeTab === 'all'}
          />
        ) : (
          <div className="text-center py-16">
            <GlassCard className="p-8 max-w-md mx-auto">
              <FilmIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Sin Películas Disponibles
              </h3>
              <p className="text-white/60 mb-4">
                {activeTab === 'presales'
                  ? 'No hay películas en preventa disponibles'
                  : 'No hay próximos estrenos programados'
                }
              </p>
              <PremiumButton
                onClick={() => window.location.reload()}
                variant="secondary"
                size="sm"
              >
                Actualizar Página
              </PremiumButton>
            </GlassCard>
          </div>
        )}

        {isLoading && allMovies.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50">
            <GlassCard className="p-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400"></div>
              <span className="text-white text-sm">Actualizando estrenos...</span>
            </GlassCard>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProntoPage;