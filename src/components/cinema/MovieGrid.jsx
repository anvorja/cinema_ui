// src/components/cinema/MovieGrid.jsx
import { MovieCard } from './MovieCard';

const MovieGrid = ({ movies = [], className = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", showReleaseDate = false }) => {
  return (
    <div className={`grid gap-6 ${className}`}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          showReleaseDate={showReleaseDate}
        />
      ))}
    </div>
  );
};

export { MovieGrid };
