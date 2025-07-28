// // src/components/cars/CarCard.jsx
// import { useState } from 'react';
// import {
//   PencilIcon,
//   TrashIcon,
//   EyeIcon,
//   CalendarIcon,
//   TagIcon,
//   SwatchIcon
// } from '@heroicons/react/24/outline';
// import Button from '../ui/Button';
// import PropTypes from "prop-types";
//
// const CarCard = ({ car, onEdit, onDelete }) => {
//   const [showDetails, setShowDetails] = useState(false);
//   const [imageError, setImageError] = useState(false);
//
//   // Calcular la edad del auto
//   const currentYear = new Date().getFullYear();
//   const carAge = currentYear - car.year;
//
//   // Determinar si es vintage o nuevo
//   const isVintage = car.is_vintage || carAge >= 25;
//   const isNew = car.is_new || carAge <= 3;
//
//   // Placeholder para imagen
//   const getCarEmoji = (brand) => {
//     const brandEmojis = {
//       'toyota': '🚗',
//       'honda': '🚙',
//       'ford': '🚐',
//       'chevrolet': '🚕',
//       'nissan': '🚘',
//       'bmw': '🏎️',
//       'mercedes': '🚗',
//       'audi': '🚙',
//       'volkswagen': '🚐',
//       'hyundai': '🚕',
//       'kia': '🚘',
//       'mazda': '🚗',
//       'subaru': '🚙',
//       'mitsubishi': '🚐'
//     };
//     return brandEmojis[brand?.toLowerCase()] || '🚗';
//   };
//
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No especificada';
//     return new Date(dateString).toLocaleDateString('es-ES', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };
//
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
//       {/* Header de la tarjeta */}
//       <div className="p-6">
//         {/* Imagen o emoji del auto */}
//         <div className="flex items-center mb-4">
//           <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl mr-4">
//             {car.photo_url && !imageError ? (
//               <img
//                 src={car.photo_url}
//                 alt={`${car.brand} ${car.model}`}
//                 className="w-full h-full object-cover rounded-lg"
//                 onError={() => setImageError(true)}
//               />
//             ) : (
//               getCarEmoji(car.brand)
//             )}
//           </div>
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-gray-900">
//               {car.brand} {car.model}
//             </h3>
//             <p className="text-sm text-gray-600">Año {car.year}</p>
//             <div className="flex items-center mt-1">
//               <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                 {car.plate_number}
//               </span>
//               {isVintage && (
//                 <span className="ml-2 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
//                   🏛️ Vintage
//                 </span>
//               )}
//               {isNew && (
//                 <span className="ml-2 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
//                   ✨ Nuevo
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//
//         {/* Información básica */}
//         <div className="space-y-2 mb-4">
//           <div className="flex items-center text-sm text-gray-600">
//             <SwatchIcon className="h-4 w-4 mr-2" />
//             <span>Color: {car.color}</span>
//           </div>
//           <div className="flex items-center text-sm text-gray-600">
//             <CalendarIcon className="h-4 w-4 mr-2" />
//             <span>Antigüedad: {carAge} año{carAge !== 1 ? 's' : ''}</span>
//           </div>
//         </div>
//
//         {/* Detalles expandibles */}
//         {showDetails && (
//           <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
//             <div className="flex items-center text-sm text-gray-600">
//               <TagIcon className="h-4 w-4 mr-2" />
//               <span>ID: {car.car_id}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <CalendarIcon className="h-4 w-4 mr-2" />
//               <span>Registrado: {formatDate(car.created_at)}</span>
//             </div>
//             {car.updated_at && car.updated_at !== car.created_at && (
//               <div className="flex items-center text-sm text-gray-600">
//                 <PencilIcon className="h-4 w-4 mr-2" />
//                 <span>Actualizado: {formatDate(car.updated_at)}</span>
//               </div>
//             )}
//             {car.photo_url && (
//               <div className="flex items-center text-sm text-gray-600">
//                 <EyeIcon className="h-4 w-4 mr-2" />
//                 <span>Tiene foto</span>
//               </div>
//             )}
//           </div>
//         )}
//
//         {/* Acciones */}
//         <div className="flex items-center justify-between mt-6">
//           <Button
//             onClick={() => setShowDetails(!showDetails)}
//             variant="ghost"
//             size="sm"
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <EyeIcon className="h-4 w-4 mr-1" />
//             {showDetails ? 'Menos' : 'Más'} detalles
//           </Button>
//
//           <div className="flex space-x-2">
//             <Button
//               onClick={() => onEdit(car)}
//               variant="secondary"
//               size="sm"
//               className="flex items-center"
//             >
//               <PencilIcon className="h-4 w-4 mr-1" />
//               Editar
//             </Button>
//             <Button
//               onClick={() => onDelete(car.car_id)}
//               variant="danger"
//               size="sm"
//               className="flex items-center"
//             >
//               <TrashIcon className="h-4 w-4 mr-1" />
//               Eliminar
//             </Button>
//           </div>
//         </div>
//       </div>
//
//       {/* Indicador de estado visual */}
//       <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
//     </div>
//   );
// };
//
// export default CarCard;

// src/components/cars/CarCard.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const CarCard = ({ car, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calcular la edad del auto
  const currentYear = new Date().getFullYear();
  const carAge = currentYear - car.year;

  // Determinar si es vintage o nuevo
  const isVintage = car.is_vintage || carAge >= 25;
  const isNew = car.is_new || carAge <= 3;

  // Placeholder para imagen
  const getCarEmoji = (brand) => {
    const brandEmojis = {
      'toyota': '🚗',
      'honda': '🚙',
      'ford': '🚐',
      'chevrolet': '🚕',
      'nissan': '🚘',
      'bmw': '🏎️',
      'mercedes': '🚗',
      'audi': '🚙',
      'volkswagen': '🚐',
      'hyundai': '🚕',
      'kia': '🚘',
      'mazda': '🚗',
      'subaru': '🚙',
      'mitsubishi': '🚐'
    };
    return brandEmojis[brand?.toLowerCase()] || '🚗';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header de la tarjeta */}
      <div className="p-6">
        {/* Imagen o emoji del auto */}
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl mr-4">
            {car.photo_url && !imageError ? (
              <img
                src={car.photo_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              getCarEmoji(car.brand)
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-600">Año {car.year}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {car.plate_number}
              </span>
              {isVintage && (
                <span className="ml-2 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                  🏛️ Vintage
                </span>
              )}
              {isNew && (
                <span className="ml-2 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  ✨ Nuevo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Información básica */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <SwatchIcon className="h-4 w-4 mr-2" />
            <span>Color: {car.color}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Antigüedad: {carAge} año{carAge !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Detalles expandibles */}
        {showDetails && (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <TagIcon className="h-4 w-4 mr-2" />
              <span>ID: {car.car_id}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>Registrado: {formatDate(car.created_at)}</span>
            </div>
            {car.updated_at && car.updated_at !== car.created_at && (
              <div className="flex items-center text-sm text-gray-600">
                <PencilIcon className="h-4 w-4 mr-2" />
                <span>Actualizado: {formatDate(car.updated_at)}</span>
              </div>
            )}
            {car.photo_url && (
              <div className="flex items-center text-sm text-gray-600">
                <EyeIcon className="h-4 w-4 mr-2" />
                <span>Tiene foto</span>
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            {showDetails ? 'Menos' : 'Más'} detalles
          </Button>

          <div className="flex space-x-2">
            <Button
              onClick={() => onEdit(car)}
              variant="secondary"
              size="sm"
              className="flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              onClick={() => onDelete(car.car_id)}
              variant="danger"
              size="sm"
              className="flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Indicador de estado visual */}
      <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
    </div>
  );
};

// ✅ PropTypes para definir la estructura del objeto car
CarCard.propTypes = {
  car: PropTypes.shape({
    car_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    plate_number: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    photo_url: PropTypes.string,
    is_vintage: PropTypes.bool,
    is_new: PropTypes.bool,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CarCard;