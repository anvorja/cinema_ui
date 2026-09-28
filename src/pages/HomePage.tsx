// src/pages/HomePage.jsx
import { useState, useMemo } from 'react';
import { Search, List, LayoutGrid } from 'lucide-react';
import BoardTip from '../components/board/BoardTip';
import { MovieCarousel } from '../components/cinema/MovieCarousel';
import { MovieGrid } from '../components/cinema/MovieGrid';
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
  const [view, setView] = useState<'lista' | 'cuadricula'>(() => {
    try { return localStorage.getItem('cinema-home-view') === 'cuadricula' ? 'cuadricula' : 'lista'; } catch { return 'lista'; }
  });
  const chooseView = (v: 'lista' | 'cuadricula') => {
    setView(v);
    try { localStorage.setItem('cinema-home-view', v); } catch { /* sin almacenamiento: solo esta sesión */ }
  };

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
      <div className="flex min-h-[70vh] items-center justify-center">
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
    <div>
      {/* Próxima salida */}
      {homeData.featured.length > 0 ? (
        <MovieCarousel movies={homeData.featured} />
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center border-b border-board-line">
          {homeData.loading ? (
            <LoadingSpinner size="large" text="Cargando la cartelera" />
          ) : (
            <EmptyState
              icon={FilmIcon}
              title="Aún no hay funciones anunciadas"
              description="Vuelve pronto: publicamos la cartelera apenas esté lista."
            />
          )}
        </div>
      )}

      {/* Tablero */}
      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 md:py-12" aria-label="Cartelera">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div role="tablist" aria-label="Secciones de la cartelera" className="flex gap-1 border-b border-board-line md:border-b-0">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={active}
                  onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                  className={`min-h-[48px] flex-1 whitespace-nowrap border-b-2 px-2 font-board text-lg sm:text-xl font-bold tracking-[0.08em] uppercase md:flex-none md:px-6 ${
                    active ? 'border-board-amber text-board-ink' : 'border-transparent text-board-mute hover:text-board-ink'
                  }`}
                >
                  {tab === 'cartelera' ? 'En cartelera' : tabLabel(tab)}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
          <div role="group" aria-label="Vista de la cartelera" className="flex shrink-0">
            {([['lista', List, 'Lista'], ['cuadricula', LayoutGrid, 'Cuadrícula']] as const).map(([key, Icon, label]) => (
              <BoardTip key={key} label={label}><button
                type="button"
                aria-pressed={view === key}
                aria-label={label}
                onClick={() => chooseView(key)}
                className={`flex h-12 w-12 items-center justify-center border first:rounded-l-[3px] last:rounded-r-[3px] ${
                  view === key ? 'border-board-amber bg-board-amber text-board-onamber' : 'border-board-line2 text-board-ink2 hover:text-board-ink'
                }`}
              >
                <Icon className="h-5 w-5" />
              </button></BoardTip>
            ))}
          </div>
          <div className="relative min-w-0 flex-1 md:w-72 md:flex-none">
            <label htmlFor="home-search" className="sr-only">Buscar películas</label>
            <input
              id="home-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar película"
              className="h-12 w-full rounded-[3px] border border-board-line bg-board-panel pl-10 pr-3 text-base text-board-ink outline-none placeholder:text-board-mute focus:border-board-amber"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-board-mute" />
          </div>
          </div>
        </div>

        <div role="tabpanel">
          <div className={`hidden grid-cols-[40px_64px_minmax(0,1fr)_auto_auto] gap-x-6 border-t border-board-line2 px-4 py-2 font-data text-[11px] uppercase text-board-mute ${view === 'lista' ? 'sm:grid' : ''}`} aria-hidden="true">
            <span>N.º</span><span /><span>Película</span><span className="w-[92px]">Estado</span><span className="w-28 text-right">Boleta</span>
          </div>

          {isTabLoading ? (
            <div className="border-t border-board-line2" aria-busy="true">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-board-line px-2 py-3 sm:px-4">
                  <div className="h-[84px] w-14 bg-board-panel motion-safe:animate-pulse sm:h-24 sm:w-16" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-2/3 bg-board-panel motion-safe:animate-pulse" />
                    <div className="h-3 w-1/3 bg-board-panel motion-safe:animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMovies.length > 0 ? (
            <MovieGrid movies={filteredMovies} view={view} />
          ) : (
            <div className="border-t border-board-line2 py-14 text-center">
              <p className="font-board text-2xl font-bold tracking-wide text-board-ink2 uppercase">
                {searchQuery ? `Sin resultados para «${searchQuery}»` : 'Sin películas en esta sección'}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="mt-3 min-h-[44px] px-4 font-data text-sm text-board-amberink underline">
                  Limpiar búsqueda
                </button>
              )}
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
