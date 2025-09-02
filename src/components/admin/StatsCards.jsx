// src/components/admin/StatsCards.jsx
import React from 'react';
import { Film, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const StatsCards = ({ movies, users, purchases, stats }) => {
  const cards = [
    {
      title: 'Películas',
      value: movies.length,
      subtitle: `${movies.filter(m => m.is_active).length} activas`,
      icon: Film,
      color: 'text-blue-500',
      bgColor: 'bg-blue-900/20'
    },
    {
      title: 'Usuarios',
      value: users.length,
      subtitle: `${users.filter(u => u.is_active).length} activos`,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-900/20'
    },
    {
      title: 'Compras',
      value: purchases.length,
      subtitle: `${purchases.filter(p => p.status === 'completed').length} completadas`,
      icon: ShoppingCart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-900/20'
    },
    {
      title: 'Ingresos Total',
      value: `$${(stats.total_revenue || 0).toLocaleString()}`,
      subtitle: 'COP',
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-semibold text-white mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500">
                  {card.subtitle}
                </p>
              </div>

              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>

            {/* Opcional: Agregar indicador de tendencia */}
            {index === 3 && stats.revenue_trend && (
              <div className="mt-4 flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-green-400">
                  +{stats.revenue_trend}% vs mes anterior
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;