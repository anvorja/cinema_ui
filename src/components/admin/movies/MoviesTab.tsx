// src/components/admin/movies/MoviesTab.jsx
import React, { useState } from 'react';
import { Loader, Filter, Grid, List, Plus, Search } from 'lucide-react';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';

const MoviesTab = ({
  movies,
  loading,
  onCreateMovie,
  onUpdateMovie,
  onToggleMovie,
  searchTerm,
  onSearchChange
}) => {
  const [movieModal, setMovieModal] = useState({ isOpen: false, movie: null });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'

  // Filtrar películas
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (movie.director && movie.director.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && movie.is_active) ||
                         (filterStatus === 'inactive' && !movie.is_active);

    return matchesSearch && matchesStatus;
  });

  const handleCreateMovie = async (movieData) => {
    try {
      await onCreateMovie(movieData);
      setMovieModal({ isOpen: false, movie: null });
    } catch (error) {
      console.error('Error creating movie:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  const handleUpdateMovie = async (movieData) => {
    try {
      await onUpdateMovie(movieModal.movie.id, movieData);
      setMovieModal({ isOpen: false, movie: null });
    } catch (error) {
      console.error('Error updating movie:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  const handleEditMovie = (movie) => {
    setMovieModal({ isOpen: true, movie });
  };

  const openCreateModal = () => {
    setMovieModal({ isOpen: true, movie: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Cargando películas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✨ AGREGADO: Barra de búsqueda con botón Nueva Película */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4 flex-1">
          {/* Barra de búsqueda */}
          <div className="relative max-w-md">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, género o director..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full min-w-[300px]"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>

          {/* Toggle de vista */}
          <div className="flex items-center bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Vista de cuadrícula"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Vista de lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ✨ BOTÓN NUEVA PELÍCULA */}
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Nueva Película</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold text-white">{movies.length}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Activas</p>
          <p className="text-2xl font-bold text-green-400">
            {movies.filter(m => m.is_active).length}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Inactivas</p>
          <p className="text-2xl font-bold text-red-400">
            {movies.filter(m => !m.is_active).length}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Filtradas</p>
          <p className="text-2xl font-bold text-blue-400">{filteredMovies.length}</p>
        </div>
      </div>

      {/* Lista de películas */}
      <div className="bg-gray-800 rounded-lg p-6">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {searchTerm || filterStatus !== 'all'
                ? 'No se encontraron películas con los filtros aplicados'
                : 'No hay películas registradas'
              }
            </p>
            {(!searchTerm && filterStatus === 'all') && (
              <button
                onClick={openCreateModal}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear primera película
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid gap-6 grid-cols-1 xl:grid-cols-2'
            : 'space-y-4'
          }>
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onEdit={handleEditMovie}
                onToggle={onToggleMovie}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de película */}
      <MovieModal
        movie={movieModal.movie}
        isOpen={movieModal.isOpen}
        onClose={() => setMovieModal({ isOpen: false, movie: null })}
        onSave={movieModal.movie ? handleUpdateMovie : handleCreateMovie}
      />
    </div>
  );
};

export default MoviesTab;