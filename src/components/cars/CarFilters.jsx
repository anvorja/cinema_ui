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
import ThemeShimmerSelect from "../ui/ThemeShimmerSelect.jsx";

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

  // 🎯 LÓGICA MEJORADA PARA RANGO DE AÑOS
  const generateYearRangeOptions = (isMaxYear = false) => {
    const currentYear = new Date().getFullYear();
    const startYear = 1950;
    const years = [];

    // Si es el select "hasta" y hay un minYear seleccionado
    const minYear = filters.minYear ? parseInt(filters.minYear) : startYear;
    const actualStartYear = isMaxYear ? Math.max(minYear, startYear) : startYear;

    for (let year = currentYear; year >= actualStartYear; year -= 5) {
      years.push({ value: year.toString(), label: year.toString() });
    }

    // No agregamos opción vacía aquí, se maneja con placeholder
    return years;
  };

  // Opciones dinámicas para el rango de años (sin opción vacía)
  const yearRangeFromOptions = generateYearRangeOptions(false);
  const yearRangeToOptions = generateYearRangeOptions(true);

  // Manejar cambios en filtros con validación para rango de años
  const handleFilterChange = (field, value) => {
    onFiltersChange(prev => {
      const newFilters = { ...prev, [field]: value };

      // 🎯 VALIDACIÓN: Si minYear es mayor que maxYear, limpiar maxYear
      if (field === 'minYear' && prev.maxYear && parseInt(value) > parseInt(prev.maxYear)) {
        newFilters.maxYear = '';
      }

      return newFilters;
    });
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  // 🎯 UX: Determinar si mostrar shimmer (solo en Marca y solo si hay múltiples opciones)
  const shouldShowBrandShimmer = brandOptions.length > 2;

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-4">
      {/* Header de filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-2" />
          <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
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
              className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10"
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="h-4 w-4 mr-1" />
                <span className="text-slate-700 dark:text-slate-300">Menos</span>
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-4 w-4 mr-1" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Más filtros</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 🎯 FILTROS BÁSICOS OPTIMIZADOS - Solo los esenciales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

        {/* 🚗 MARCA - Con shimmer condicional (UX principal) */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Marca
          </label>
          {shouldShowBrandShimmer ? (
            <ThemeShimmerSelect
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              options={brandOptions}
              size="sm"
              intensity="normal"
              className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
            />
          ) : (
            <Select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              options={brandOptions}
              size="sm"
              className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
            />
          )}
        </div>

        {/* 🏎️ MODELO - Sin shimmer (jerarquía visual) */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Modelo
          </label>
          <Select
            value={filters.model}
            onChange={(e) => handleFilterChange('model', e.target.value)}
            options={modelOptions}
            size="sm"
            className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* 📅 AÑO - Sin shimmer */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Año
          </label>
          <Select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            options={yearOptions}
            size="sm"
            className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* 🎨 COLOR - Sin shimmer */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Color
          </label>
          <Select
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
            options={colorOptions}
            size="sm"
            className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* 🔧 FILTROS AVANZADOS - Expandibles */}
      {isExpanded && (
        <div className="border-t border-white/20 dark:border-white/10 pt-4">
          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">
            Filtros Avanzados
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* 📆 RANGO DE AÑOS - Con validación mejorada */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rango de Años
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Select
                    value={filters.minYear}
                    onChange={(e) => handleFilterChange('minYear', e.target.value)}
                    options={yearRangeFromOptions}
                    size="sm"
                    placeholder="Desde"
                    className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <Select
                    value={filters.maxYear}
                    onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                    options={yearRangeToOptions}
                    size="sm"
                    placeholder="Hasta"
                    className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
                    disabled={!filters.minYear}
                  />
                  {/* Indicador debajo del selector "Hasta" */}
                  {filters.minYear && !filters.maxYear && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Selecciona el año máximo
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ⚡ CATEGORÍAS RÁPIDAS */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                  className="w-full justify-start text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
                >
                  ✨ Autos nuevos (últimos 3 años)
                </Button>
                <Button
                  onClick={() => {
                    const currentYear = new Date().getFullYear();
                    handleFilterChange('minYear', '1950');
                    handleFilterChange('maxYear', (currentYear - 25).toString());
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
                >
                  🏛️ Autos vintage (+25 años)
                </Button>
              </div>
            </div>

            {/* 📊 ESTADÍSTICAS */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Estadísticas
              </label>
              <div className="bg-white/20 dark:bg-white/10 rounded-lg p-3 space-y-1">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Total de autos: <span className="font-medium text-slate-800 dark:text-slate-200">{cars.length}</span>
                </div>
                {brandOptions.length > 1 && (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Marcas únicas: <span className="font-medium text-slate-800 dark:text-slate-200">{brandOptions.length - 1}</span>
                  </div>
                )}
                {yearOptions.length > 1 && (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Años disponibles: <span className="font-medium text-slate-800 dark:text-slate-200">{yearOptions.length - 1}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🎯 ACCIONES RÁPIDAS ADICIONALES */}
          <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
            <div className="flex flex-wrap gap-2">
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
                    className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
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
                    className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
                  >
                    🆕 Año más reciente
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🏷️ INDICADOR DE FILTROS ACTIVOS */}
      {hasActiveFilters && !isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/20 dark:border-white/10">
          <div className="flex flex-wrap gap-2">
            {filters.brand && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                Marca: {filters.brand}
                <button
                  onClick={() => handleFilterChange('brand', '')}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.model && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                Modelo: {filters.model}
                <button
                  onClick={() => handleFilterChange('model', '')}
                  className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.year && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                Año: {filters.year}
                <button
                  onClick={() => handleFilterChange('year', '')}
                  className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.color && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200">
                Color: {filters.color}
                <button
                  onClick={() => handleFilterChange('color', '')}
                  className="ml-1 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filters.minYear || filters.maxYear) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200">
                Rango: {filters.minYear || '∞'} - {filters.maxYear || '∞'}
                <button
                  onClick={() => {
                    handleFilterChange('minYear', '');
                    handleFilterChange('maxYear', '');
                  }}
                  className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* 🔄 SEGUNDO BOTÓN DE RESTABLECER (solo si hay filtros activos y expandido) */}
      {hasActiveFilters && isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Restablecer todo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarFilters;