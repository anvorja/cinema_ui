// src/pages/ComidasPage.jsx
import { useState, useEffect } from 'react';
import { FoodCategoryGrid } from '../components/cinema/FoodCategoryGrid.jsx';
import {FloatingParticles, GlassCard} from '../components/common';
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
          image: '/api/placeholder/600/400',
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
          image: '/api/placeholder/600/400',
          price: 22000
        }
      ];

      // Mock data para categorías de comida
      const mockCategories = [
        {
          id: 1,
          name: 'Confitería',
          description: 'Dulces, palomitas y snacks',
          image: 'https://res.cloudinary.com/dv2xu8dwr/image/upload/v1777366670/30597_jstnwi.png',
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
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <FloatingParticles count={25} className="opacity-20" />

      {/* Hero Carousel de Comidas */}
      <section className="mb-16">
        <FoodCarousel combos={foodCombos} />
      </section>

      {/* Información y Categorías */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Comidas</h2>
            <GlassCard variant="default" className="p-6 max-w-4xl">
              <p className="text-white/90 leading-relaxed">
                Esta sección es informativa.{' '}
                <span className="font-semibold text-orange-400">
                  Podrás agregar tu comida en el proceso de compra de boletas.
                </span>
              </p>
            </GlassCard>
          </div>

          <FoodCategoryGrid categories={categories} />

          {/* Disclaimers */}
          <div className="mt-12 space-y-4 max-w-4xl">
            <GlassCard variant="default" className="p-4">
              <p className="text-white/70 text-sm">
                *PRODUCTOS SUJETOS A DISPONIBILIDAD DEL PUNTO DE VENTA.
              </p>
            </GlassCard>

            <GlassCard variant="default" className="p-4">
              <p className="text-white/70 text-sm">
                **LOS PRECIOS DE LISTA PARA ALGUNOS PRODUCTOS SON DIFERENTES EN LOS MULTIPLEX BÍO CAUCA, MERCURIO Y VENTURA TERREROS.
              </p>
            </GlassCard>

            <GlassCard variant="default" className="p-4">
              <p className="text-white/70 text-sm">
                ***IMÁGENES DE REFERENCIA.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComidasPage;