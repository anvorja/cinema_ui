// src/components/cars/CarFilters.jsx
import { useState } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Select from '../ui/Select';

const CarFilters = ({ filters, onFiltersChange, onClear, cars = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extraer opciones únicas de los autos existentes
  const getUniqueValues = (field) => {
    const values = cars.map(car => car[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  // Generar opciones para selects
  const brandOptions = [
    { value: '', label: 'Todas las marcas' },
    ...getUniqueValues('brand').map(brand => ({
      value: brand,
      label: brand
    }))
  ];

  const modelOptions = [
    { value: '', label: 'Todos los modelos' },
    ...getUniqueValues('model').map(model => ({
      value: model,
      label: model
    }))
  ];

  const colorOptions = [
    { value: '', label: 'Todos los colores' },
    ...getUniqueValues('color').map(color => ({
      value: color,
      label: color
    }))
  ];

  const yearOptions = [
    { value: '', label: 'Todos los años' },
    ...getUniqueValues('year')
      .sort((a, b) => b - a)
      .map(year => ({
        value: year.toString(),
        label: year.toString()
      }))
  ];

  // Generar rango de años para los filtros min/max
  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1950;
    const years = [];

    for (let year = currentYear; year >= startYear; year -= 5) {
      years.push({ value: year.toString(), label: year.toString() });
    }

    return years;
  };

  const yearRangeOptions = [
    { value: '', label: 'Sin límite' },
    ...generateYearRange()
  ];

  // Manejar cambios en filtros
  const handleFilterChange = (field, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Header de filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              onClick={onClear}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="h-4 w-4 mr-1" />
                Menos
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-4 w-4 mr-1" />
                Más filtros
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filtros básicos - siempre visibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Marca
          </label>
          <Select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            options={brandOptions}
            size="sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Modelo
          </label>
          <Select
            value={filters.model}
            onChange={(e) => handleFilterChange('model', e.target.value)}
            options={modelOptions}
            size="sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Año
          </label>
          <Select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            options={yearOptions}
            size="sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Color
          </label>
          <Select
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
            options={colorOptions}
            size="sm"
          />
        </div>
      </div>

      {/* Filtros avanzados - expandibles */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Filtros Avanzados
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rango de años */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Rango de Años
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Select
                    value={filters.minYear}
                    onChange={(e) => handleFilterChange('minYear', e.target.value)}
                    options={[
                      { value: '', label: 'Desde' },
                      ...yearRangeOptions.slice(1)
                    ]}
                    size="sm"
                  />
                </div>
                <div>
                  <Select
                    value={filters.maxYear}
                    onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                    options={[
                      { value: '', label: 'Hasta' },
                      ...yearRangeOptions.slice(1)
                    ]}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Filtros rápidos por categorías */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Categorías Rápidas
              </label>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    const currentYear = new Date().getFullYear();
                    handleFilterChange('minYear', (currentYear - 3).toString());
                    handleFilterChange('maxYear', currentYear.toString());
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                >
                  ✨ Autos nuevos (últimos 3 años)
                </Button>
                <Button
                  onClick={() => {
                    const currentYear = new Date().getFullYear();
                    handleFilterChange('maxYear', (currentYear - 25).toString());
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                >
                  🏛️ Autos vintage (+25 años)
                </Button>
              </div>
            </div>

            {/* Estadísticas del filtro */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Estadísticas
              </label>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <div className="text-xs text-gray-600">
                  Total de autos: <span className="font-medium">{cars.length}</span>
                </div>
                {brandOptions.length > 1 && (
                  <div className="text-xs text-gray-600">
                    Marcas únicas: <span className="font-medium">{brandOptions.length - 1}</span>
                  </div>
                )}
                {yearOptions.length > 1 && (
                  <div className="text-xs text-gray-600">
                    Años disponibles: <span className="font-medium">{yearOptions.length - 1}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acciones rápidas adicionales */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  onFiltersChange({
                    brand: '',
                    model: '',
                    year: '',
                    color: '',
                    minYear: '',
                    maxYear: ''
                  });
                }}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                🔄 Resetear todo
              </Button>

              {cars.length > 0 && (
                <>
                  <Button
                    onClick={() => {
                      const mostCommonBrand = brandOptions
                        .slice(1)
                        .reduce((a, b) =>
                          cars.filter(car => car.brand === a.value).length >
                          cars.filter(car => car.brand === b.value).length ? a : b
                        );
                      if (mostCommonBrand) {
                        handleFilterChange('brand', mostCommonBrand.value);
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    🏆 Marca más común
                  </Button>

                  <Button
                    onClick={() => {
                      const newestYear = Math.max(...cars.map(car => car.year));
                      handleFilterChange('year', newestYear.toString());
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    🆕 Año más reciente
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters && !isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.brand && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Marca: {filters.brand}
                <button
                  onClick={() => handleFilterChange('brand', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.model && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Modelo: {filters.model}
                <button
                  onClick={() => handleFilterChange('model', '')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.year && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Año: {filters.year}
                <button
                  onClick={() => handleFilterChange('year', '')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.color && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Color: {filters.color}
                <button
                  onClick={() => handleFilterChange('color', '')}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filters.minYear || filters.maxYear) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Rango: {filters.minYear || '∞'} - {filters.maxYear || '∞'}
                <button
                  onClick={() => {
                    handleFilterChange('minYear', '');
                    handleFilterChange('maxYear', '');
                  }}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarFilters;