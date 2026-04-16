// src/components/cinema/FoodCategoryGrid.jsx
import { GlassCard, ShimmerEffect } from '../common';

const FoodCategoryGrid = ({ categories = [] }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <FoodCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

const FoodCategoryCard = ({ category }) => {
  return (
    <div className="group cursor-pointer">
      <ShimmerEffect>
        <GlassCard variant="premium" className="overflow-hidden premium-card">
          <div className="aspect-square relative">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg mb-1">{category.name}</h3>
              <p className="text-white/80 text-sm mb-2">{category.description}</p>
              {category.itemCount && (
                <p className="text-orange-400 text-xs font-medium">
                  {category.itemCount} productos disponibles
                </p>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </GlassCard>
      </ShimmerEffect>
    </div>
  );
};

export { FoodCategoryGrid, FoodCategoryCard };
