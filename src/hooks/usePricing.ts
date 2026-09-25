// src/hooks/usePricing.ts
//
// Precios que muestra la compra, tal como los calcula booking-service.
import { useQuery } from '@tanstack/react-query';
import { pricingService } from '../services/api';

export interface ConcessionItem {
  code: string;
  category: string;
  name: string;
  description: string;
  price: number;
}

export interface Pricing {
  movie_id: number;
  ticket_prices: { general: number; preferential: number };
  preferential_rows: string[];
  service_fee_with_concessions: number;
  concessions: ConcessionItem[];
}

export interface PriceLine {
  kind: 'ticket' | 'concession' | 'service_fee';
  code: string;
  description: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Quote {
  lines: PriceLine[];
  total: number;
}

export interface ConcessionSelection {
  code: string;
  quantity: number;
}

export interface QuotePayload {
  movie_id: number;
  quantity: number;
  selected_seats: string[] | null;
  showtime_id?: number | null;
  concessions: ConcessionSelection[];
}

export const pricingKeys = {
  pricing: (movieId) => ['pricing', movieId],
  quote: (payload: QuotePayload | null) => ['pricing', 'quote', payload],
};

export const usePricing = (movieId) =>
  useQuery<Pricing>({
    queryKey: pricingKeys.pricing(movieId),
    queryFn: () => pricingService.get(movieId),
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000,
  });

export const useQuote = (payload: QuotePayload | null) =>
  useQuery<Quote>({
    queryKey: pricingKeys.quote(payload),
    queryFn: () => pricingService.quote(payload),
    enabled: !!payload,
  });

// Una silla es preferencial si su fila está en las filas que define el backend.
export const isPreferentialSeat = (seatId: string, rows: string[] | undefined): boolean =>
  !!rows && rows.includes(seatId.charAt(0).toUpperCase());
