// src/components/cinema/FoodCarousel.jsx
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {FloatingParticles, GlassCard} from '../ui';

const FoodCarousel = ({ combos = [], autoPlay = true, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === combos.length - 1 ? 0 : prevIndex + 1
    );
  }, [combos.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? combos.length - 1 : prevIndex - 1
    );
  }, [combos.length]);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || combos.length <= 1) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, nextSlide, interval, combos.length]);

  if (!combos.length) return null;

  return (
    <div className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0">
        {combos.map((combo, index) => (
          <div
            key={combo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={combo.image}
              alt={combo.name}
              className="w-full h-full object-cover scale-105"
              style={{ filter: 'blur(1px)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          </div>
        ))}
      </div>

      <FloatingParticles count={20} className="opacity-20" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* Food Info */}
            <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {combos[currentIndex].name}
                </h1>
                <p className="text-lg text-white/90 leading-relaxed">
                  {combos[currentIndex].description}
                </p>
              </div>

              {combos[currentIndex].price && (
                <div className="text-center lg:text-left">
                  <GlassCard variant="premium" className="inline-block px-6 py-3 glow-secondary">
                    <p className="text-orange-400 font-bold text-2xl">
                      ${combos[currentIndex].price.toLocaleString('es-CO')}
                    </p>
                  </GlassCard>
                </div>
              )}
            </div>

            {/* Food Image */}
            <div className="order-1 lg:order-2 flex justify-center">
              <GlassCard variant="premium" className="p-4 premium-card max-w-md">
                <img
                  src={combos[currentIndex].image}
                  alt={combos[currentIndex].name}
                  className="w-full rounded-lg shadow-2xl"
                />
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full glass hover:glass-hover transition-all duration-200 group"
      >
        <ChevronLeftIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full glass hover:glass-hover transition-all duration-200 group"
      >
        <ChevronRightIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-3">
          {combos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-orange-400 scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodCarousel;
