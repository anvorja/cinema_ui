// src/components/cars/CarStats.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ChartBarIcon,
  TruckIcon,
  CalendarIcon,
  SwatchIcon,
  StarIcon,
  ClockIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CarStats = ({ stats }) => {
  const [selectedStat, setSelectedStat] = useState(null);

  if (!stats) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center text-gray-500">
          📊 No hay estadísticas disponibles
        </div>
      </div>
    );
  }

  // Preparar datos para visualización
  const statsCards = [
    {
      id: 'total',
      title: 'Total de Autos',
      value: stats.total_cars || 0,
      icon: TruckIcon,
      color: 'blue',
      description: 'Autos registrados en tu colección'
    },
    {
      id: 'brands',
      title: 'Marcas Únicas',
      value: stats.unique_brands || 0,
      icon: StarIcon,
      color: 'green',
      description: 'Diferentes marcas en tu colección'
    },
    {
      id: 'average_year',
      title: 'Año Promedio',
      value: stats.average_year ? Math.round(stats.average_year) : 'N/A',
      icon: CalendarIcon,
      color: 'purple',
      description: 'Año promedio de tus autos'
    },
    {
      id: 'colors',
      title: 'Colores Únicos',
      value: stats.unique_colors || 0,
      icon: SwatchIcon,
      color: 'orange',
      description: 'Variedad de colores en tu colección'
    },
    {
      id: 'newest',
      title: 'Más Nuevo',
      value: stats.newest_year || 'N/A',
      icon: ClockIcon,
      color: 'emerald',
      description: 'Auto más reciente'
    },
    {
      id: 'oldest',
      title: 'Más Antiguo',
      value: stats.oldest_year || 'N/A',
      icon: ClockIcon,
      color: 'amber',
      description: 'Auto más antiguo'
    }
  ];

  // Colores para las tarjetas
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600'
  };

  const textColorClasses = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    purple: 'text-purple-900',
    orange: 'text-orange-900',
    emerald: 'text-emerald-900',
    amber: 'text-amber-900'
  };

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    const isSelected = selectedStat?.id === stat.id;

    return (
      <div
        className={`
          relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
          ${colorClasses[stat.color]}
          ${isSelected ? 'ring-2 ring-offset-2 ring-primary-500' : 'hover:shadow-md'}
        `}
        onClick={() => setSelectedStat(isSelected ? null : stat)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${textColorClasses[stat.color]}`}>
                {stat.value}
              </p>
            </div>
          </div>
          <EyeIcon className="h-5 w-5 text-gray-400" />
        </div>

        {isSelected && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">{stat.description}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ChartBarIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Estadísticas de mi Colección
          </h2>
        </div>
        {selectedStat && (
          <button
            onClick={() => setSelectedStat(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statsCards.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Detalles adicionales */}
      {stats.brand_distribution && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Distribución por Marcas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.brand_distribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([brand, count]) => (
                <div key={brand} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{brand}</span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.total_cars) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Distribución por décadas */}
      {stats.year_distribution && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📅 Distribución por Décadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats.year_distribution)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([decade, count]) => (
                <div key={decade} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600">
                    {decade}
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-primary-600 h-1 rounded-full"
                      style={{
                        width: `${(count / stats.total_cars) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Datos curiosos */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Datos Curiosos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Marca Favorita
            </h4>
            <p className="text-blue-700">
              {stats.favorite_brand || 'No determinada'}
              {stats.favorite_brand_count && ` (${stats.favorite_brand_count} autos)`}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">
              Color Más Común
            </h4>
            <p className="text-green-700">
              {stats.most_common_color || 'No determinado'}
              {stats.most_common_color_count && ` (${stats.most_common_color_count} autos)`}
            </p>
          </div>

          {stats.vintage_count > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">
                Autos Vintage
              </h4>
              <p className="text-amber-700">
                {stats.vintage_count} auto{stats.vintage_count !== 1 ? 's' : ''} de más de 25 años
              </p>
            </div>
          )}

          {stats.new_count > 0 && (
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-900 mb-2">
                Autos Nuevos
              </h4>
              <p className="text-emerald-700">
                {stats.new_count} auto{stats.new_count !== 1 ? 's' : ''} de menos de 3 años
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resumen final */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="bg-primary-50 p-4 rounded-lg">
          <h4 className="font-medium text-primary-900 mb-2">
            🏆 Resumen de tu Colección
          </h4>
          <p className="text-primary-700 text-sm">
            Tienes una {stats.total_cars >= 10 ? 'impresionante' : stats.total_cars >= 5 ? 'buena' : 'pequeña pero valiosa'}
            colección de {stats.total_cars} auto{stats.total_cars !== 1 ? 's' : ''}
            {stats.unique_brands > 1 && ` de ${stats.unique_brands} marcas diferentes`}.
            {stats.average_year && ` El año promedio de tus autos es ${Math.round(stats.average_year)}.`}
            {stats.vintage_count > 0 && ` ¡Incluyes ${stats.vintage_count} auto${stats.vintage_count !== 1 ? 's' : ''} vintage!`}
          </p>
        </div>
      </div>
    </div>
  );
};

CarStats.propTypes = {
  stats: PropTypes.shape({
    total_cars: PropTypes.number,
    unique_brands: PropTypes.number,
    average_year: PropTypes.number,
    unique_colors: PropTypes.number,
    oldest_year: PropTypes.number,
    newest_year: PropTypes.number,
    brand_distribution: PropTypes.objectOf(PropTypes.number),
    year_distribution: PropTypes.objectOf(PropTypes.number),
    most_common_color: PropTypes.string,
    most_common_color_count: PropTypes.number,
    vintage_count: PropTypes.number,
    new_count: PropTypes.number,
    favorite_brand: PropTypes.string,
    favorite_brand_count: PropTypes.number,
  })
};

export default CarStats;