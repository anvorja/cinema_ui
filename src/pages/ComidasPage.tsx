// src/pages/ComidasPage.jsx
import { useState, useEffect } from 'react';
import { FoodCategoryGrid } from '../components/cinema/FoodCategoryGrid.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FoodCarousel from "../components/cinema/FoodCarousel.jsx";

const ComidasPage = () => {
  const [loading, setLoading] = useState(true);
  const [foodCombos, setFoodCombos] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadFoodData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data para combos del carrusel
      const mockFoodCombos = [
        {
          id: 1,
          name: 'Nevado Arequipe 300 ml',
          description: 'Delicioso helado de arequipe con topping especial',
          image: 'https://res.cloudinary.com/dv2xu8dwr/image/upload/v1777367384/nevado-arequipe_eweujt.png',
          price: 8500
        },
        {
          id: 2,
          name: 'Okinawa Combo',
          description: '1 Ceviche (a escoger) + ½ Cinema Roll + ½ California Roll + ½ Philadelphia Roll + ½ Royal Tiger',
          image: 'https://cdn.inoutdelivery.com/cinecolombia.inoutdelivery.com/xl/1704904207746-011024_Boton-Ceviche-Cine%20Colombia_bajo%20peso.jpg',
          price: 24500
        },
        {
          id: 3,
          name: 'Kurashiki Combo',
          description: '½ Philadelphia Roll + ½ Salmón Teriyaki + ½ Spider Roll + ½ Cinema Roll',
          image: 'https://res.cloudinary.com/dv2xu8dwr/image/upload/v1777367195/kurakashi_h1lmvi.png',
          price: 22000
        }
      ];

      // Mock data para categorías de comida
      const mockCategories = [
        {
          id: 1,
          name: 'Confitería',
          description: 'Dulces, palomitas y snacks',
          image: 'https://res.cloudinary.com/dv2xu8dwr/image/upload/v1777367016/confiteria_b2llrp.jpg',
          itemCount: 25
        },
        {
          id: 2,
          name: 'Juan Valdez',
          description: 'El mejor café colombiano',
          image: 'https://res.cloudinary.com/dv2xu8dwr/image/upload/v1777365720/Nevado-chai-Juan-Valdez_aoro0w.jpg',
          itemCount: 18
        },
        {
          id: 3,
          name: 'Barras de Sushi',
          description: 'Sushi fresco y delicioso',
          image: 'https://res.cloudinary.com/dv2xu8dwr/image/upload/v1777366442/sushi-barras_ob1bqb.png',
          itemCount: 32
        },
        {
          id: 4,
          name: 'Cinepolitan',
          description: 'Comida italiana premium',
          image: 'https://res.cloudinary.com/dv2xu8dwr/image/upload/v1777366578/pepperoni_bchtn2.png',
          itemCount: 15
        }
      ];

      setFoodCombos(mockFoodCombos);
      setCategories(mockCategories);
      setLoading(false);
    };

    loadFoodData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="xl" text="Cargando el menú" />
      </div>
    );
  }

  return (
    <div>
      <FoodCarousel combos={foodCombos} />

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <h2 className="font-board text-4xl font-bold tracking-[0.06em] uppercase">Menú</h2>
        <p className="mt-3 max-w-[65ch] text-[17px] leading-relaxed text-[#c3bfb2]">
          Esta sección es informativa. <strong className="text-[#f2b705]">Agrega tu comida durante la compra de boletas.</strong>
        </p>

        <div className="mt-8">
          <FoodCategoryGrid categories={categories} />
        </div>

        <ul className="mt-10 max-w-3xl space-y-1 font-data text-xs text-[#8f8b80]">
          <li>* Productos sujetos a disponibilidad del punto de venta.</li>
          <li>** Los precios de lista para algunos productos son diferentes en los multiplex Bío Cauca, Mercurio y Ventura Terreros.</li>
          <li>*** Imágenes de referencia.</li>
        </ul>
      </section>
    </div>
  );
};

export default ComidasPage;