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
      accent: 'text-board-amberink',
      ring: 'ring-board-amber/20 bg-board-amber/10',
    },
    {
      title: 'Usuarios',
      value: users.length,
      subtitle: `${users.filter(u => u.is_active).length} activos`,
      icon: Users,
      accent: 'text-board-okink',
      ring: 'ring-board-ok/20 bg-board-ok/10',
    },
    {
      title: 'Compras',
      value: purchases.length,
      subtitle: `${purchases.filter(p => p.status === 'confirmed').length} confirmadas`,
      icon: ShoppingCart,
      accent: 'text-board-amberink',
      ring: 'ring-board-amber/20 bg-board-amber/10',
    },
    {
      title: 'Ingresos',
      value: `$${(stats.total_revenue || 0).toLocaleString('es-CO')}`,
      subtitle: 'COP acumulado',
      icon: DollarSign,
      accent: 'text-board-amberink',
      ring: 'ring-board-amber/20 bg-board-amber/10',
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
            className="bg-board-panel border-board-line hover:border-board-line2 transition-colors duration-200"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-data text-[11px] font-bold text-board-mute uppercase mb-2">
                    {card.title}
                  </p>
                  <p className="font-data text-3xl font-bold text-board-ink leading-none mb-1 truncate">
                    {card.value}
                  </p>
                  <p className="text-xs text-board-mute">{card.subtitle}</p>
                </div>
                <div className={`p-2.5 rounded-[3px] ring-1 ${card.ring} shrink-0`}>
                  <Icon className={`h-5 w-5 ${card.accent}`} />
                </div>
              </div>

              {card.trend != null && (
                <div className="mt-3 pt-3 border-t border-board-line flex items-center gap-1 text-xs text-board-okink">
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
