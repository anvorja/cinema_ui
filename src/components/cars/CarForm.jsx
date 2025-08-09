// src/components/cars/CarForm.jsx
import {useEffect, useState} from 'react';
import {useToast} from '../../hooks/useToast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const CarForm = ({ initialData, onSubmit, onCancel, allCars }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    plateNumber: '',
    color: '',
    photoUrl: ''
  });

  const [errors, setErrors] = useState({});

  const getBaseBrandOptions = () => [
    'Aston Martin', 'Audi', 'BMW', 'Bentley', 'Bugatti', 'Cadillac',
    'Chevrolet', 'Chrysler', 'Citroën', 'Dodge', 'Ferrari', 'Fiat',
    'Ford', 'Genesis', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar',
    'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln',
    'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi',
    'Nissan', 'Peugeot', 'Porsche', 'Ram', 'Renault', 'Rolls-Royce',
    'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
  ];

  const getDynamicBrandOptions = () => {
    // Obtener marcas de autos existentes
    const existingBrands = allCars
        .map(car => car.brand)
        .filter(brand => brand && brand.trim() !== ''); // Filtrar valores vacíos

    // Combinar con marcas base y eliminar duplicados
    const allBrands = [...new Set([...getBaseBrandOptions(), ...existingBrands])];

    // Ordenar alfabéticamente
    allBrands.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    // Crear opciones para el select
    return [
      {value: '', label: 'Selecciona una marca'},
      ...allBrands.map(brand => ({
        value: brand,
        label: brand
      })),
      {value: 'Otro', label: 'Otro'}
    ];
  };

  const getDynamicColorOptions = () => {
    // Colores base
    const baseColors = [
      'Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul', 'Verde',
      'Amarillo', 'Naranja', 'Morado', 'Marrón', 'Beige', 'Dorado'
    ];

    // Obtener colores de autos existentes
    const existingColors = allCars
        .map(car => car.color)
        .filter(color => color && color.trim() !== '');

    // Combinar y eliminar duplicados
    const allColors = [...new Set([...baseColors, ...existingColors])];

    // Ordenar alfabéticamente
    allColors.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

    return [
      { value: '', label: 'Selecciona un color' },
      ...allColors.map(color => ({
        value: color,
        label: color
      })),
      { value: 'Otro', label: 'Otro' }
    ];
  };

  const brandOptions = getDynamicBrandOptions();
  const colorOptions = getDynamicColorOptions();

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || '',
        model: initialData.model || '',
        year: initialData.year?.toString() || '',
        plateNumber: initialData.plate_number || initialData.plateNumber || '',
        color: initialData.color || '',
        photoUrl: initialData.photo_url || initialData.photoUrl || '' // SOPORTE PARA AMBOS FORMATOS
      });
    }
  }, [initialData]);

  // Generar opciones de años
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const years = [];

    years.push({ value: '', label: 'Selecciona un año' });

    for (let year = currentYear; year >= startYear; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }

    return years;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar placa colombiana
  const validatePlate = (plate) => {
    // Formato tradicional: ABC123 (3 letras + 3 números)
    // Formato nuevo: ABC12D (3 letras + 2 números + 1 letra)
    const traditionalFormat = /^[A-Z]{3}[0-9]{3}$/;
    const newFormat = /^[A-Z]{3}[0-9]{2}[A-Z]$/;

    return traditionalFormat.test(plate) || newFormat.test(plate);
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido';
    }

    if (!formData.year) {
      newErrors.year = 'El año es requerido';
    } else {
      const year = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.year = `El año debe estar entre 1900 y ${currentYear}`;
      }
    }

    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = 'La placa es requerida';
    } else {
      const plateUpper = formData.plateNumber.toUpperCase().replace(/\s/g, '');
      if (!validatePlate(plateUpper)) {
        newErrors.plateNumber = 'Formato de placa inválido (Ej: ABC123 o ABC12D)';
      }
    }

    if (!formData.color.trim()) {
      newErrors.color = 'El color es requerido';
    }

    if (formData.photoUrl && !isValidUrl(formData.photoUrl)) {
      newErrors.photoUrl = 'URL de foto inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Formatear placa automáticamente
  const formatPlate = (value) => {
    // Convertir a mayúsculas y remover espacios
    const cleaned = value.toUpperCase().replace(/\s/g, '');

    // Limitar a 6 caracteres
    if (cleaned.length <= 6) {
      return cleaned;
    }

    return cleaned.substring(0, 6);
  };

  // Manejar cambio de placa con formato automático
  const handlePlateChange = (e) => {
    const formatted = formatPlate(e.target.value);
    handleInputChange({
      target: {
        name: 'plateNumber',
        value: formatted
      }
    });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Por favor corrige los errores en el formulario', 'error');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para envío
      const submitData = {
        ...formData,
        year: parseInt(formData.year),
        plateNumber: formData.plateNumber.toUpperCase(),
        photoUrl: formData.photoUrl.trim() || null
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error en formulario:', error);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!initialData;

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca *
          </label>
          <Select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              options={brandOptions}
              error={errors.brand}
          />
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo *
          </label>
          <Input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Ej: Corolla, Civic, Focus"
              error={errors.model}
          />
        </div>

        {/* Año y Placa en la misma fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año *
            </label>
            <Select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                options={generateYearOptions()}
                error={errors.year}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placa *
            </label>
            <Input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handlePlateChange}
                placeholder="ABC123 o ABC12D"
                maxLength={6}
                error={errors.plateNumber}
                className="uppercase"
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato: ABC123 (tradicional) o ABC12D (nuevo)
            </p>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color *
          </label>
          <Select
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              options={colorOptions}
              error={errors.color}
          />
        </div>

        {/* URL de Foto (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de Foto (opcional)
          </label>
          <Input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/foto-auto.jpg"
              error={errors.photoUrl}
          />
          <p className="mt-1 text-xs text-gray-500">
            Agrega una URL de imagen para mostrar una foto de tu auto
          </p>
        </div>

        {/* Vista previa de imagen */}
        {formData.photoUrl && isValidUrl(formData.photoUrl) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vista previa
              </label>
              <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={formData.photoUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target;
                      if (target instanceof HTMLImageElement) {
                        target.style.display = 'none';
                      }
                    }}
                />
              </div>
            </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              disabled={loading}
          >
            Cancelar
          </Button>
          <Button
              type="submit"
              disabled={loading}
          >
            {loading ? 'Guardando...' : (isEditing ? '✏️ Actualizar Auto' : '🚗 Crear Auto')}
          </Button>
        </div>
      </form>
  );
};

export default CarForm;