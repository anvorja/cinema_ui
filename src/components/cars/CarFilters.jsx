// // src/components/cars/CarFilters.jsx
// import { useState } from 'react';
// import {
//   FunnelIcon,
//   XMarkIcon,
//   ChevronDownIcon,
//   ChevronUpIcon
// } from '@heroicons/react/24/outline';
// import Button from '../ui/Button';
// import Select from '../ui/Select';
// import GlassSelect from "../ui/GlassSelect.jsx";
// import ThemeShimmerSelect from "../ui/ThemeShimmerSelect.jsx";
//
// const CarFilters = ({ filters, onFiltersChange, onClear, cars = [] }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//
//   // Extraer opciones únicas de los autos existentes
//   const getUniqueValues = (field) => {
//     const values = cars.map(car => car[field]).filter(Boolean);
//     return [...new Set(values)].sort();
//   };
//
//   // Generar opciones para selects
//   const brandOptions = [
//     { value: '', label: 'Todas las marcas' },
//     ...getUniqueValues('brand').map(brand => ({
//       value: brand,
//       label: brand
//     }))
//   ];
//
//   const modelOptions = [
//     { value: '', label: 'Todos los modelos' },
//     ...getUniqueValues('model').map(model => ({
//       value: model,
//       label: model
//     }))
//   ];
//
//   const colorOptions = [
//     { value: '', label: 'Todos los colores' },
//     ...getUniqueValues('color').map(color => ({
//       value: color,
//       label: color
//     }))
//   ];
//
//   const yearOptions = [
//     { value: '', label: 'Todos los años' },
//     ...getUniqueValues('year')
//       .sort((a, b) => b - a)
//       .map(year => ({
//         value: year.toString(),
//         label: year.toString()
//       }))
//   ];
//
//   // Generar rango de años para los filtros min/max
//   const generateYearRange = () => {
//     const currentYear = new Date().getFullYear();
//     const startYear = 1950;
//     const years = [];
//
//     for (let year = currentYear; year >= startYear; year -= 5) {
//       years.push({ value: year.toString(), label: year.toString() });
//     }
//
//     return years;
//   };
//
//   const yearRangeOptions = [
//     { value: '', label: 'Sin límite' },
//     ...generateYearRange()
//   ];
//
//   // Manejar cambios en filtros
//   const handleFilterChange = (field, value) => {
//     onFiltersChange(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };
//
//   // Verificar si hay filtros activos
//   const hasActiveFilters = Object.values(filters).some(value => value !== '');
//
//   // Contar filtros activos
//   const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;
//
//   return (
//     <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-4">
//       {/* Header de filtros */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center">
//           <FunnelIcon className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-2" />
//           <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">
//             Filtros
//             {activeFiltersCount > 0 && (
//               <span className="ml-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
//                 {activeFiltersCount}
//               </span>
//             )}
//           </h3>
//         </div>
//
//         <div className="flex items-center space-x-2">
//           {hasActiveFilters && (
//             <Button
//               onClick={onClear}
//               variant="ghost"
//               size="sm"
//               className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10"
//             >
//               <XMarkIcon className="h-4 w-4 mr-1" />
//               Limpiar
//             </Button>
//           )}
//           <Button
//             onClick={() => setIsExpanded(!isExpanded)}
//             variant="ghost"
//             size="sm"
//             className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10"
//           >
//             {isExpanded ? (
//               <>
//                 <ChevronUpIcon className="h-4 w-4 mr-1" />
//                 <span className="text-slate-700 dark:text-slate-300">Menos</span>
//               </>
//             ) : (
//               <>
//                 <ChevronDownIcon className="h-4 w-4 mr-1" />
//                 <span className="text-slate-700 dark:text-slate-300 font-medium">Más filtros</span>
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//
//       {/* Filtros básicos - siempre visibles */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//         <div>
//           <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//             Marca
//           </label>
// {/*<GlassSelect*/}
// {/*  value={filters.brand}*/}
// {/*  onChange={(e) => handleFilterChange('brand', e.target.value)}*/}
// {/*  options={brandOptions}*/}
// {/*  size="sm"*/}
// {/*/>*/}
//
// {/*          <Select*/}
// {/*  value={filters.model}*/}
// {/*  onChange={(e) => handleFilterChange('model', e.target.value)}*/}
// {/*  options={modelOptions}*/}
// {/*  size="sm"*/}
// {/*  enableShimmer={true} // 👈 ACTIVAR SHIMMER*/}
// {/*  className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"*/}
// {/*/>*/}
//             <ThemeShimmerSelect
//     value={filters.brand}
//     onChange={(e) => handleFilterChange('brand', e.target.value)}
//     options={brandOptions}
//     size="sm"
//     intensity="normal" // o "intense"
//     className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
//   />
//
//         </div>
//
//         <div>
//           <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//             Modelo
//           </label>
//           <Select
//             value={filters.model}
//             onChange={(e) => handleFilterChange('model', e.target.value)}
//             options={modelOptions}
//             size="sm"
//             className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
//           />
//         </div>
//
//         <div>
//           <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//             Año
//           </label>
//           <Select
//             value={filters.year}
//             onChange={(e) => handleFilterChange('year', e.target.value)}
//             options={yearOptions}
//             size="sm"
//             className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
//           />
//         </div>
//
//         <div>
//           <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//             Color
//           </label>
//           <Select
//             value={filters.color}
//             onChange={(e) => handleFilterChange('color', e.target.value)}
//             options={colorOptions}
//             size="sm"
//             className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
//           />
//         </div>
//       </div>
//
//       {/* Filtros avanzados - expandibles */}
//       {isExpanded && (
//         <div className="border-t border-white/20 dark:border-white/10 pt-4">
//           <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">
//             Filtros Avanzados
//           </h4>
//
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* Rango de años */}
//             <div className="md:col-span-2 lg:col-span-1">
//               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
//                 Rango de Años
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <Select
//                     value={filters.minYear}
//                     onChange={(e) => handleFilterChange('minYear', e.target.value)}
//                     options={[
//                       { value: '', label: 'Desde' },
//                       ...yearRangeOptions.slice(1)
//                     ]}
//                     size="sm"
//                     className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
//                   />
//                 </div>
//                 <div>
//                   <Select
//                     value={filters.maxYear}
//                     onChange={(e) => handleFilterChange('maxYear', e.target.value)}
//                     options={[
//                       { value: '', label: 'Hasta' },
//                       ...yearRangeOptions.slice(1)
//                     ]}
//                     size="sm"
//                     className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-200"
//                   />
//                 </div>
//               </div>
//             </div>
//
//             {/* Filtros rápidos por categorías */}
//             <div>
//               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
//                 Categorías Rápidas
//               </label>
//               <div className="space-y-2">
//                 <Button
//                   onClick={() => {
//                     const currentYear = new Date().getFullYear();
//                     handleFilterChange('minYear', (currentYear - 3).toString());
//                     handleFilterChange('maxYear', currentYear.toString());
//                   }}
//                   variant="ghost"
//                   size="sm"
//                   className="w-full justify-start text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
//                 >
//                   ✨ Autos nuevos (últimos 3 años)
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     const currentYear = new Date().getFullYear();
//                     handleFilterChange('maxYear', (currentYear - 25).toString());
//                   }}
//                   variant="ghost"
//                   size="sm"
//                   className="w-full justify-start text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
//                 >
//                   🏛️ Autos vintage (+25 años)
//                 </Button>
//               </div>
//             </div>
//
//             {/* Estadísticas del filtro */}
//             <div>
//               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
//                 Estadísticas
//               </label>
//               <div className="bg-white/20 dark:bg-white/10 rounded-lg p-3 space-y-1">
//                 <div className="text-xs text-slate-600 dark:text-slate-400">
//                   Total de autos: <span className="font-medium text-slate-800 dark:text-slate-200">{cars.length}</span>
//                 </div>
//                 {brandOptions.length > 1 && (
//                   <div className="text-xs text-slate-600 dark:text-slate-400">
//                     Marcas únicas: <span className="font-medium text-slate-800 dark:text-slate-200">{brandOptions.length - 1}</span>
//                   </div>
//                 )}
//                 {yearOptions.length > 1 && (
//                   <div className="text-xs text-slate-600 dark:text-slate-400">
//                     Años disponibles: <span className="font-medium text-slate-800 dark:text-slate-200">{yearOptions.length - 1}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//
//           {/* Acciones rápidas adicionales */}
//           <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 onClick={() => {
//                   onFiltersChange({
//                     brand: '',
//                     model: '',
//                     year: '',
//                     color: '',
//                     minYear: '',
//                     maxYear: ''
//                   });
//                 }}
//                 variant="ghost"
//                 size="sm"
//                 className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
//               >
//                 🔄 Resetear todo
//               </Button>
//
//               {cars.length > 0 && (
//                 <>
//                   <Button
//                     onClick={() => {
//                       const mostCommonBrand = brandOptions
//                         .slice(1)
//                         .reduce((a, b) =>
//                           cars.filter(car => car.brand === a.value).length >
//                           cars.filter(car => car.brand === b.value).length ? a : b
//                         );
//                       if (mostCommonBrand) {
//                         handleFilterChange('brand', mostCommonBrand.value);
//                       }
//                     }}
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
//                   >
//                     🏆 Marca más común
//                   </Button>
//
//                   <Button
//                     onClick={() => {
//                       const newestYear = Math.max(...cars.map(car => car.year));
//                       handleFilterChange('year', newestYear.toString());
//                     }}
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10"
//                   >
//                     🆕 Año más reciente
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//
//       {/* Indicador de filtros activos */}
//       {hasActiveFilters && !isExpanded && (
//         <div className="mt-3 pt-3 border-t border-white/20 dark:border-white/10">
//           <div className="flex flex-wrap gap-2">
//             {filters.brand && (
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
//                 Marca: {filters.brand}
//                 <button
//                   onClick={() => handleFilterChange('brand', '')}
//                   className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
//                 >
//                   <XMarkIcon className="h-3 w-3" />
//                 </button>
//               </span>
//             )}
//             {filters.model && (
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
//                 Modelo: {filters.model}
//                 <button
//                   onClick={() => handleFilterChange('model', '')}
//                   className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
//                 >
//                   <XMarkIcon className="h-3 w-3" />
//                 </button>
//               </span>
//             )}
//             {filters.year && (
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
//                 Año: {filters.year}
//                 <button
//                   onClick={() => handleFilterChange('year', '')}
//                   className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
//                 >
//                   <XMarkIcon className="h-3 w-3" />
//                 </button>
//               </span>
//             )}
//             {filters.color && (
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200">
//                 Color: {filters.color}
//                 <button
//                   onClick={() => handleFilterChange('color', '')}
//                   className="ml-1 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
//                 >
//                   <XMarkIcon className="h-3 w-3" />
//                 </button>
//               </span>
//             )}
//             {(filters.minYear || filters.maxYear) && (
//               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200">
//                 Rango: {filters.minYear || '∞'} - {filters.maxYear || '∞'}
//                 <button
//                   onClick={() => {
//                     handleFilterChange('minYear', '');
//                     handleFilterChange('maxYear', '');
//                   }}
//                   className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
//                 >
//                   <XMarkIcon className="h-3 w-3" />
//                 </button>
//               </span>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default CarFilters;


// // src/components/cars/CarFilters.jsx
// import { useState } from 'react';
// import {
//   FunnelIcon,
//   XMarkIcon,
//   ChevronDownIcon,
//   ChevronUpIcon
// } from '@heroicons/react/24/outline';
// import Button from '../ui/Button';
// import Select from '../ui/Select';
// import GlassSelect from "../ui/GlassSelect.jsx";
// import ThemeShimmerSelect from "../ui/ThemeShimmerSelect.jsx";
//
// const CarFilters = ({ filters, onFiltersChange, onClear, cars = [] }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//
//   // Extraer opciones únicas de los autos existentes
//   const getUniqueValues = (field) => {
//     const values = cars.map(car => car[field]).filter(Boolean);
//     return [...new Set(values)].sort();
//   };
//
//   // Generar opciones para selects
//   const brandOptions = [
//     { value: '', label: 'Todas las marcas' },
//     ...getUniqueValues('brand').map(brand => ({
//       value: brand,
//       label: brand
//     }))
//   ];
//
//   const modelOptions = [
//     { value: '', label: 'Todos los modelos' },
//     ...getUniqueValues('model').map(model => ({
//       value: model,
//       label: model
//     }))
//   ];
//
//   const colorOptions = [
//     { value: '', label: 'Todos los colores' },
//     ...getUniqueValues('color').map(color => ({
//       value: color,
//       label: color
//     }))
//   ];
//
//   const yearOptions = [
//     { value: '', label: 'Todos los años' },
//     ...getUniqueValues('year')
//       .sort((a, b) => b - a)
//       .map(year => ({
//         value: year.toString(),
//         label: year.toString()
//       }))
//   ];
//
//   // Generar rango de años para los filtros min/max
//   const generateYearRange = () => {
//     const currentYear = new Date().getFullYear();
//     const startYear = 1950;
//     const years = [];
//
//     for (let year = currentYear; year >= startYear; year -= 5) {
//       years.push({ value: year.toString(), label: year.toString() });
//     }
//
//     return years;
//   };
//
//   const yearRangeOptions = [
//     { value: '', label: 'Sin límite' },
//     ...generateYearRange()
//   ];
//
//   // Manejar cambios en filtros
//   const handleFilterChange = (field, value) => {
//     onFiltersChange(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };
//
//   // Verificar si hay filtros activos
//   const hasActiveFilters = Object.values(filters).some(value => value !== '');
//
//   // Contar filtros activos
//   const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;
//
//   return (
//     <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-4">
//       {/* Header de filtros */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <div className="relative">
//             <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-sm" />
//             <FunnelIcon className="relative h-5 w-5 text-blue-600 dark:text-blue-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
//             Filtros
//           </h3>
//           {activeFiltersCount > 0 && (
//             <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100/50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-500/30">
//               {activeFiltersCount}
//             </span>
//           )}
//         </div>
//
//         <div className="flex items-center space-x-2">
//           {hasActiveFilters && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={onClear}
//               className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
//             >
//               <XMarkIcon className="h-4 w-4 mr-1" />
//               Limpiar
//             </Button>
//           )}
//
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="text-slate-600 dark:text-slate-400"
//           >
//             {isExpanded ? (
//               <>
//                 <ChevronUpIcon className="h-4 w-4 mr-1" />
//                 <span className="text-slate-700 dark:text-slate-300">Menos</span>
//               </>
//             ) : (
//               <>
//                 <ChevronDownIcon className="h-4 w-4 mr-1" />
//                 <span className="text-slate-700 dark:text-slate-300 font-medium">Más filtros</span>
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//
//       {/* Filtros básicos - siempre visibles con ThemeShimmerSelect */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//         {/* Marca con ThemeShimmerSelect */}
//         <div>
//           <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//             Marca
//           </label>
//           <ThemeShimmerSelect
//             value={filters.brand}
//             onChange={(e) => handleFilterChange('brand', e.target.value)}
//             options={brandOptions}
//             size="sm"
//             intensity="normal"
//             className="glass-select-enhanced"
//           />
//         </div>
//
//         {/* Modelo con ThemeShimmerSelect */}
//         <div>
//           <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//             Modelo
//           </label>
//           <ThemeShimmerSelect
//             value={filters.model}
//             onChange={(e) => handleFilterChange('model', e.target.value)}
//             options={modelOptions}
//             size="sm"
//             intensity="normal"
//             className="glass-select-enhanced"
//           />
//         </div>
//
//         {/* Año con ThemeShimmerSelect */}
//         <div>
//           <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//             Año
//           </label>
//           <ThemeShimmerSelect
//             value={filters.year}
//             onChange={(e) => handleFilterChange('year', e.target.value)}
//             options={yearOptions}
//             size="sm"
//             intensity="normal"
//             className="glass-select-enhanced"
//           />
//         </div>
//
//         {/* Color con ThemeShimmerSelect */}
//         <div>
//           <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//             Color
//           </label>
//           <ThemeShimmerSelect
//             value={filters.color}
//             onChange={(e) => handleFilterChange('color', e.target.value)}
//             options={colorOptions}
//             size="sm"
//             intensity="normal"
//             className="glass-select-enhanced"
//           />
//         </div>
//       </div>
//
//       {/* Filtros expandidos */}
//       {isExpanded && (
//         <div className="space-y-4 border-t border-white/20 dark:border-white/10 pt-4">
//           {/* Rango de precio */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Precio mínimo
//               </label>
//               <input
//                 type="number"
//                 value={filters.minPrice}
//                 onChange={(e) => handleFilterChange('minPrice', e.target.value)}
//                 placeholder="Ej: 10000"
//                 className="w-full h-8 px-2 text-sm rounded-lg border backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-500/70 dark:placeholder-slate-400/70 transition-all duration-300 ease-out hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//               />
//             </div>
//
//             <div>
//               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Precio máximo
//               </label>
//               <input
//                 type="number"
//                 value={filters.maxPrice}
//                 onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
//                 placeholder="Ej: 50000"
//                 className="w-full h-8 px-2 text-sm rounded-lg border backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-500/70 dark:placeholder-slate-400/70 transition-all duration-300 ease-out hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//               />
//             </div>
//           </div>
//
//           {/* Rango de años */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Año desde
//               </label>
//               <Select
//                 value={filters.minYear}
//                 onChange={(e) => handleFilterChange('minYear', e.target.value)}
//                 options={yearRangeOptions}
//                 size="sm"
//                 className="glass-select-enhanced"
//               />
//             </div>
//
//             <div>
//               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Año hasta
//               </label>
//               <Select
//                 value={filters.maxYear}
//                 onChange={(e) => handleFilterChange('maxYear', e.target.value)}
//                 options={yearRangeOptions}
//                 size="sm"
//                 className="glass-select-enhanced"
//               />
//             </div>
//           </div>
//
//           {/* Búsqueda por placa */}
//           <div>
//             <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
//               Placa
//             </label>
//             <input
//               type="text"
//               value={filters.plate}
//               onChange={(e) => handleFilterChange('plate', e.target.value)}
//               placeholder="Ej: ABC123"
//               className="w-full h-8 px-2 text-sm rounded-lg border backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-500/70 dark:placeholder-slate-400/70 transition-all duration-300 ease-out hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default CarFilters;

// src/components/cars/CarFilters.jsx - IMPLEMENTACIÓN COMPLETA
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
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-4">
      {/* Header de filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-sm" />
            <FunnelIcon className="relative h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Filtros
          </h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100/50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-500/30">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-600 dark:text-slate-400"
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

      {/* ✨ FILTROS PRINCIPALES CON THEMESHIMMERSELECT ✨ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

        {/* 🚗 MARCA - ThemeShimmerSelect */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Marca
          </label>
          <ThemeShimmerSelect
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            options={brandOptions}
            size="sm"
            intensity="normal"
            enableGlassEffect={true}
            placeholder="Selecciona marca"
            className="glass-select-enhanced"
          />
        </div>

        {/* 🏎️ MODELO - ThemeShimmerSelect */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Modelo
          </label>
          <ThemeShimmerSelect
            value={filters.model}
            onChange={(e) => handleFilterChange('model', e.target.value)}
            options={modelOptions}
            size="sm"
            intensity="normal"
            enableGlassEffect={true}
            placeholder="Selecciona modelo"
            className="glass-select-enhanced"
          />
        </div>

        {/* 📅 AÑO - ThemeShimmerSelect */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Año
          </label>
          <ThemeShimmerSelect
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            options={yearOptions}
            size="sm"
            intensity="normal"
            enableGlassEffect={true}
            placeholder="Selecciona año"
            className="glass-select-enhanced"
          />
        </div>

        {/* 🎨 COLOR - ThemeShimmerSelect */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Color
          </label>
          <ThemeShimmerSelect
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
            options={colorOptions}
            size="sm"
            intensity="normal"
            enableGlassEffect={true}
            placeholder="Selecciona color"
            className="glass-select-enhanced"
          />
        </div>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="space-y-4 border-t border-white/20 dark:border-white/10 pt-4">

          {/* 💰 RANGO DE PRECIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Precio mínimo
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Ej: 10000"
                className="w-full h-8 px-2 text-sm rounded-lg border backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-500/70 dark:placeholder-slate-400/70 transition-all duration-300 ease-out hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 dark:focus:border-blue-300/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Precio máximo
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Ej: 50000"
                className="w-full h-8 px-2 text-sm rounded-lg border backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-500/70 dark:placeholder-slate-400/70 transition-all duration-300 ease-out hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 dark:focus:border-blue-300/50"
              />
            </div>
          </div>

          {/* 📆 RANGO DE AÑOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Año desde
              </label>
              <Select
                value={filters.minYear}
                onChange={(e) => handleFilterChange('minYear', e.target.value)}
                options={yearRangeOptions}
                size="sm"
                placeholder="Año mínimo"
                className="glass-select-enhanced backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Año hasta
              </label>
              <Select
                value={filters.maxYear}
                onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                options={yearRangeOptions}
                size="sm"
                placeholder="Año máximo"
                className="glass-select-enhanced backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10"
              />
            </div>
          </div>

          {/* 🔢 BÚSQUEDA POR PLACA */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Placa
            </label>
            <input
              type="text"
              value={filters.plate}
              onChange={(e) => handleFilterChange('plate', e.target.value)}
              placeholder="Ej: ABC123"
              className="w-full h-8 px-2 text-sm rounded-lg border backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-500/70 dark:placeholder-slate-400/70 transition-all duration-300 ease-out hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 dark:focus:border-blue-300/50"
            />
          </div>

          {/* 🔧 FILTROS ADICIONALES (Opcional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Transmisión
              </label>
              <ThemeShimmerSelect
                value={filters.transmission || ''}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                options={[
                  { value: '', label: 'Todas las transmisiones' },
                  { value: 'manual', label: 'Manual' },
                  { value: 'automatic', label: 'Automática' },
                  { value: 'cvt', label: 'CVT' }
                ]}
                size="sm"
                intensity="subtle"
                placeholder="Selecciona transmisión"
                className="glass-select-enhanced"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Combustible
              </label>
              <ThemeShimmerSelect
                value={filters.fuel || ''}
                onChange={(e) => handleFilterChange('fuel', e.target.value)}
                options={[
                  { value: '', label: 'Todos los combustibles' },
                  { value: 'gasoline', label: 'Gasolina' },
                  { value: 'diesel', label: 'Diésel' },
                  { value: 'hybrid', label: 'Híbrido' },
                  { value: 'electric', label: 'Eléctrico' }
                ]}
                size="sm"
                intensity="subtle"
                placeholder="Selecciona combustible"
                className="glass-select-enhanced"
              />
            </div>
          </div>
        </div>
      )}

      {/* 📊 RESUMEN DE FILTROS ACTIVOS */}
      {hasActiveFilters && (
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