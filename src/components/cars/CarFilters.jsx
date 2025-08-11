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
import { useFilterOptions } from '../../hooks/useFilterOptions';

const CarFilters = ({ filters, onFiltersChange, onClear, allCars = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    getBrandOptions,
    getModelOptions,
    getColorOptions,
    getYearOptions,
    loading: optionsLoading,
    error: optionsError,
    hasOptions,
    stats
  } = useFilterOptions();

  // 🎯 FUNCIÓN PARA FILTRAR OPCIONES EN CASCADA BIDIRECCIONAL
  const getFilteredSelectOptions = (type) => {
    if (!allCars || allCars.length === 0) {
      // Si no hay carros, usar las opciones del hook
      switch (type) {
        case 'brands': return getBrandOptions(true);
        case 'models': return getModelOptions(true);
        case 'colors': return getColorOptions(true);
        case 'years': return getYearOptions(true);
        default: return [];
      }
    }

    // 🎯 FILTRAR CARROS SEGÚN TODOS LOS FILTROS ACTIVOS (bidireccional)
    let filteredCars = [...allCars];

    // Aplicar filtros EXCEPTO el que estamos calculando
    if (filters.brand && type !== 'brands') {
      filteredCars = filteredCars.filter(car => car.brand === filters.brand);
    }
    if (filters.model && type !== 'models') {
      filteredCars = filteredCars.filter(car => car.model === filters.model);
    }
    if (filters.year && type !== 'years') {
      filteredCars = filteredCars.filter(car => car.year.toString() === filters.year);
    }
    if (filters.color && type !== 'colors') {
      filteredCars = filteredCars.filter(car => car.color === filters.color);
    }

    // 🎯 NUEVO: Si hay modelo seleccionado, filtrar marcas también
    if (type === 'brands' && filters.model) {
      // Solo mostrar marcas que tengan ese modelo
      filteredCars = allCars.filter(car => car.model === filters.model);
    }

    // 🎯 NUEVO: Si hay año seleccionado, filtrar marcas y modelos
    if (type === 'brands' && filters.year) {
      filteredCars = allCars.filter(car => car.year.toString() === filters.year);
    }
    if (type === 'models' && filters.year) {
      filteredCars = allCars.filter(car => car.year.toString() === filters.year);
    }

    // 🎯 NUEVO: Si hay color seleccionado, filtrar marcas y modelos
    if (type === 'brands' && filters.color) {
      filteredCars = allCars.filter(car => car.color === filters.color);
    }
    if (type === 'models' && filters.color) {
      filteredCars = allCars.filter(car => car.color === filters.color);
    }

    // Extraer opciones únicas del subset filtrado
    let uniqueValues = [];
    switch (type) {
      case 'brands':
        uniqueValues = [...new Set(filteredCars.map(car => car.brand).filter(Boolean))];
        break;
      case 'models':
        uniqueValues = [...new Set(filteredCars.map(car => car.model).filter(Boolean))];
        break;
      case 'colors':
        uniqueValues = [...new Set(filteredCars.map(car => car.color).filter(Boolean))];
        break;
      case 'years':
        uniqueValues = [...new Set(filteredCars.map(car => car.year).filter(Boolean))];
        break;
      default:
        return [];
    }

    // Formatear opciones con etiquetas dinámicas
    const emptyLabels = {
      brands: (() => {
        if (filters.model) return `Marcas que tienen ${filters.model}`;
        if (filters.year) return `Marcas del año ${filters.year}`;
        if (filters.color) return `Marcas en color ${filters.color}`;
        return 'Todas las marcas';
      })(),
      models: (() => {
        if (filters.brand) return `Modelos de ${filters.brand}`;
        if (filters.year) return `Modelos del año ${filters.year}`;
        if (filters.color) return `Modelos en color ${filters.color}`;
        return 'Todos los modelos';
      })(),
      colors: (() => {
        if (filters.brand && filters.model) return `Colores del ${filters.brand} ${filters.model}`;
        if (filters.brand) return `Colores de ${filters.brand}`;
        if (filters.model) return `Colores del ${filters.model}`;
        return 'Todos los colores';
      })(),
      years: (() => {
        if (filters.brand && filters.model) return `Años del ${filters.brand} ${filters.model}`;
        if (filters.brand) return `Años de ${filters.brand}`;
        if (filters.model) return `Años del ${filters.model}`;
        return 'Todos los años';
      })()
    };

    const options = [{ value: '', label: emptyLabels[type] }];

    // Ordenar según el tipo
    if (type === 'years') {
      uniqueValues.sort((a, b) => b - a); // Años descendente
    } else {
      uniqueValues.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    }

    return [
      ...options,
      ...uniqueValues.map(value => ({
        value: value.toString(),
        label: value.toString()
      }))
    ];
  };

  // 🎯 OPCIONES SINCRONIZADAS
  const brandOptions = getFilteredSelectOptions('brands');
  const modelOptions = getFilteredSelectOptions('models');
  const colorOptions = getFilteredSelectOptions('colors');
  const yearOptions = getFilteredSelectOptions('years');

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

    return years;
  };

  // Opciones dinámicas para el rango de años (sin opción vacía)
  const yearRangeFromOptions = generateYearRangeOptions(false);
  const yearRangeToOptions = generateYearRangeOptions(true);

  // Manejar cambios en filtros con validación bidireccional
  const handleFilterChange = (field, value) => {
    onFiltersChange(prev => {
      const newFilters = { ...prev, [field]: value };

      // 🎯 VALIDACIONES PARA EVITAR CONFLICTOS

      // 1. Si se selecciona un año específico, limpiar rangos
      if (field === 'year' && value) {
        newFilters.minYear = '';
        newFilters.maxYear = '';
      }

      // 2. Si se selecciona minYear o maxYear, limpiar año específico
      if ((field === 'minYear' || field === 'maxYear') && value) {
        newFilters.year = '';
      }

      // 3. Si minYear es mayor que maxYear, limpiar maxYear
      if (field === 'minYear' && prev.maxYear && parseInt(value) > parseInt(prev.maxYear)) {
        newFilters.maxYear = '';
      }

      // 4. Si maxYear es menor que minYear, limpiar minYear
      if (field === 'maxYear' && prev.minYear && parseInt(value) < parseInt(prev.minYear)) {
        newFilters.minYear = '';
      }

      // 🎯 VALIDACIONES BIDIRECCIONALES PARA FILTROS EN CASCADA

      // 5. Si se cambia la marca, verificar compatibilidad con otros filtros
      if (field === 'brand' && value && allCars.length > 0) {
        const brandCars = allCars.filter(car => car.brand === value);

        // Si el modelo actual no existe en esta marca, limpiarlo
        if (prev.model && !brandCars.some(car => car.model === prev.model)) {
          newFilters.model = '';
        }

        // Si el año actual no existe en esta marca, limpiarlo
        if (prev.year && !brandCars.some(car => car.year.toString() === prev.year)) {
          newFilters.year = '';
          newFilters.minYear = '';
          newFilters.maxYear = '';
        }

        // Si el color actual no existe en esta marca, limpiarlo
        if (prev.color && !brandCars.some(car => car.color === prev.color)) {
          newFilters.color = '';
        }
      }

      // 6. Si se cambia el modelo, verificar compatibilidad con otros filtros
      if (field === 'model' && value && allCars.length > 0) {
        const modelCars = allCars.filter(car => car.model === value);

        // Si la marca actual no tiene este modelo, limpiarlo
        if (prev.brand && !modelCars.some(car => car.brand === prev.brand)) {
          newFilters.brand = '';
        }

        // Si el año actual no existe en este modelo, limpiarlo
        if (prev.year && !modelCars.some(car => car.year.toString() === prev.year)) {
          newFilters.year = '';
          newFilters.minYear = '';
          newFilters.maxYear = '';
        }

        // Si el color actual no existe en este modelo, limpiarlo
        if (prev.color && !modelCars.some(car => car.color === prev.color)) {
          newFilters.color = '';
        }
      }

      // 7. Si se cambia el año, verificar compatibilidad
      if (field === 'year' && value && allCars.length > 0) {
        const yearCars = allCars.filter(car => car.year.toString() === value);

        // Si la marca actual no tiene autos de este año, limpiarlo
        if (prev.brand && !yearCars.some(car => car.brand === prev.brand)) {
          newFilters.brand = '';
        }

        // Si el modelo actual no tiene autos de este año, limpiarlo
        if (prev.model && !yearCars.some(car => car.model === prev.model)) {
          newFilters.model = '';
        }

        // Si el color actual no existe en este año, limpiarlo
        if (prev.color && !yearCars.some(car => car.color === prev.color)) {
          newFilters.color = '';
        }
      }

      // 8. Si se cambia el color, verificar compatibilidad
      if (field === 'color' && value && allCars.length > 0) {
        const colorCars = allCars.filter(car => car.color === value);

        // Si la marca actual no tiene autos de este color, limpiarlo
        if (prev.brand && !colorCars.some(car => car.brand === prev.brand)) {
          newFilters.brand = '';
        }

        // Si el modelo actual no tiene autos de este color, limpiarlo
        if (prev.model && !colorCars.some(car => car.model === prev.model)) {
          newFilters.model = '';
        }

        // Si el año actual no tiene autos de este color, limpiarlo
        if (prev.year && !colorCars.some(car => car.year.toString() === prev.year)) {
          newFilters.year = '';
          newFilters.minYear = '';
          newFilters.maxYear = '';
        }
      }

      return newFilters;
    });
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  // 🎯 UX: Determinar si mostrar shimmer (solo en Marca y solo si hay múltiples opciones)
  const shouldShowBrandShimmer = brandOptions.length > 2 && !optionsLoading;

  // 📊 Mostrar mensaje si no hay opciones disponibles
  if (optionsError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
        <div className="flex items-center">
          <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm text-red-700 dark:text-red-300">
            Error al cargar opciones de filtros: {optionsError}
          </span>
        </div>
      </div>
    );
  }

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
              disabled={optionsLoading}
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
            disabled={optionsLoading}
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
            disabled={optionsLoading}
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
            disabled={optionsLoading}
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
                    disabled={optionsLoading}
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
                    disabled={optionsLoading}
                    className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* 🎯 ACCIONES RÁPIDAS */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Acciones Rápidas
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    // 🎯 LIMPIAR filtros conflictivos antes de aplicar "este año"
                    onFiltersChange(prev => ({
                      ...prev,
                      year: new Date().getFullYear().toString(),
                      minYear: '', // Limpiar rangos que podrían conflictuar
                      maxYear: ''
                    }));
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={optionsLoading}
                  className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10"
                >
                  🆕 Autos de este año
                </Button>
                <Button
                  onClick={() => {
                    const vintageYear = new Date().getFullYear() - 25;
                    // 🎯 LIMPIAR filtros conflictivos antes de aplicar "vintage"
                    onFiltersChange(prev => ({
                      ...prev,
                      year: '', // Limpiar año específico
                      minYear: '', // Limpiar año mínimo
                      maxYear: vintageYear.toString()
                    }));
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={optionsLoading}
                  className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10"
                >
                  🎖️ Autos vintage (+25 años)
                </Button>
                <Button
                  onClick={() => {
                    // 🎯 NUEVO: Filtro para autos nuevos (últimos 3 años)
                    const newCarYear = new Date().getFullYear() - 3;
                    onFiltersChange(prev => ({
                      ...prev,
                      year: '', // Limpiar año específico
                      minYear: newCarYear.toString(),
                      maxYear: ''
                    }));
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={optionsLoading}
                  className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10"
                >
                  ✨ Autos nuevos (3 años)
                </Button>
              </div>
            </div>

            {/* 📊 ESTADÍSTICAS DE FILTROS */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Estadísticas
              </label>
              <div className="bg-white/20 dark:bg-white/10 rounded-lg p-3 space-y-1">
                {optionsLoading ? (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Cargando estadísticas...
                  </div>
                ) : stats ? (
                  <>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Total de autos: <span className="font-medium text-slate-800 dark:text-slate-200">{stats.totalCars}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Marcas únicas: <span className="font-medium text-slate-800 dark:text-slate-200">{stats.uniqueBrands}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Modelos únicos: <span className="font-medium text-slate-800 dark:text-slate-200">{stats.uniqueModels}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Colores únicos: <span className="font-medium text-slate-800 dark:text-slate-200">{stats.uniqueColors}</span>
                    </div>
                    {stats.yearRange && (
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Años: <span className="font-medium text-slate-800 dark:text-slate-200">{stats.yearRange.min} - {stats.yearRange.max}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    No hay datos disponibles
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🎯 INFORMACIÓN SOBRE FILTROS */}
          {!hasOptions && !optionsLoading && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center">
                <div className="text-amber-600 dark:text-amber-400 text-sm">
                  💡 <strong>Tip:</strong> Agrega algunos autos para poder usar los filtros avanzados
                </div>
              </div>
            </div>
          )}

          {/* 🚨 ADVERTENCIA SOBRE FILTROS CONFLICTIVOS */}
          {hasActiveFilters && (
            (() => {
              const hasConflictingFilters =
                (filters.year && (filters.minYear || filters.maxYear)) ||
                (filters.minYear && filters.maxYear && parseInt(filters.minYear) > parseInt(filters.maxYear));

              if (hasConflictingFilters) {
                return (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center">
                      <XMarkIcon className="h-4 w-4 text-red-500 mr-2" />
                      <div className="text-red-600 dark:text-red-400 text-sm">
                        <strong>Filtros conflictivos:</strong> Los filtros actuales pueden no mostrar resultados.
                        Usa las acciones rápidas o ajusta los filtros manualmente.
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()
          )}

          {/* 📊 RESUMEN DE FILTROS ACTIVOS */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  📌 Filtros activos: {activeFiltersCount}
                </div>
                <div className="flex flex-wrap gap-1">
                  {filters.brand && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                      Marca: {filters.brand}
                      <button
                        onClick={() => handleFilterChange('brand', '')}
                        className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.model && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                      Modelo: {filters.model}
                      <button
                        onClick={() => handleFilterChange('model', '')}
                        className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.year && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                      Año: {filters.year}
                      <button
                        onClick={() => handleFilterChange('year', '')}
                        className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.color && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200">
                      Color: {filters.color}
                      <button
                        onClick={() => handleFilterChange('color', '')}
                        className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.minYear && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200">
                      Desde: {filters.minYear}
                      <button
                        onClick={() => handleFilterChange('minYear', '')}
                        className="ml-1 hover:bg-cyan-200 dark:hover:bg-cyan-800 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.maxYear && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200">
                      Hasta: {filters.maxYear}
                      <button
                        onClick={() => handleFilterChange('maxYear', '')}
                        className="ml-1 hover:bg-pink-200 dark:hover:bg-pink-800 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarFilters;