// src/components/admin/StatsCards.tsx
import { Film, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const StatsCards = ({ movies, users, purchases, stats }) => {
  const cards = [
    {
      title: 'Películas',
      value: movies.length,
      subtitle: `${movies.filter(m => m.is_active).length} activas`,
      icon: Film,
      accent: 'text-blue-400',
      ring: 'ring-blue-500/20 bg-blue-500/10',
    },
    {
      title: 'Usuarios',
      value: users.length,
      subtitle: `${users.filter(u => u.is_active).length} activos`,
      icon: Users,
      accent: 'text-emerald-400',
      ring: 'ring-emerald-500/20 bg-emerald-500/10',
    },
    {
      title: 'Compras',
      value: purchases.length,
      subtitle: `${purchases.filter(p => p.status === 'confirmed').length} confirmadas`,
      icon: ShoppingCart,
      accent: 'text-violet-400',
      ring: 'ring-violet-500/20 bg-violet-500/10',
    },
    {
      title: 'Ingresos',
      value: `$${(stats.total_revenue || 0).toLocaleString('es-CO')}`,
      subtitle: 'COP acumulado',
      icon: DollarSign,
      accent: 'text-amber-400',
      ring: 'ring-amber-500/20 bg-amber-500/10',
      trend: stats.revenue_trend,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="bg-zinc-900 border-zinc-800/60 hover:border-zinc-700 transition-colors duration-200"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-white leading-none mb-1 truncate">
                    {card.value}
                  </p>
                  <p className="text-xs text-zinc-600">{card.subtitle}</p>
                </div>
                <div className={`p-2.5 rounded-lg ring-1 ${card.ring} shrink-0`}>
                  <Icon className={`h-5 w-5 ${card.accent}`} />
                </div>
              </div>

              {card.trend != null && (
                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{card.trend}% vs mes anterior</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
