// src/services/bookingService.js - VERSIÓN FINAL CORRECTA SEGÚN EL BACKEND
import api, { movieService, purchaseService } from './api.js';

class BookingService {
  // 🎬 Obtener horarios de una película
  async getShowtimes(movieId, selectedDate = null) {
    try {
      const params = {};
      if (selectedDate) {
        params.start_date = selectedDate;
        params.end_date = selectedDate;
      }

      const response = await movieService.getShowtimes(movieId, params);
      return {
        success: true,
        data: response,
        message: 'Horarios obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener horarios'
      };
    }
  }

  // 🏢 Obtener teatros para una película
  async getMovieTheaters(movieId) {
    try {
      const response = await movieService.getTheaters(movieId);
      return {
        success: true,
        data: response,
        message: 'Teatros obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error fetching movie theaters:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener teatros'
      };
    }
  }

  // 🎫 CREAR RESERVA - FORMATO EXACTO QUE ESPERA EL BACKEND
  async createBooking(bookingData) {
    try {
      console.log('📝 Datos recibidos en createBooking:', bookingData);

      // Validar datos requeridos
      if (!bookingData.movie) {
        throw new Error('Falta información de la película');
      }

      let purchasePayload;

      // Normalizar selectedDate a string ISO "YYYY-MM-DD" (puede llegar como string o como Date)
      let showDate = null;
      const rawDate = bookingData.selectedDate;
      if (rawDate) {
        if (typeof rawDate === 'string') {
          showDate = rawDate.split('T')[0]; // recortar timezone si viene como ISO completo
        } else if (rawDate instanceof Date) {
          showDate = rawDate.toISOString().split('T')[0];
        }
        // Si es un objeto {dayName, dayNumber, monthName} no se puede convertir de forma segura → null
      }
      const showTime = bookingData.showtime?.time || null;

      const showtimeId = bookingData.showtime?.id || null;

      if (bookingData.paymentMethod === 'pse' && bookingData.pseData) {
        // PSE payload
        const pse = bookingData.pseData;
        purchasePayload = {
          movie_id: bookingData.movie.id,
          quantity: bookingData.ticketCount || 1,
          show_date: showDate,
          show_time: showTime,
          showtime_id: showtimeId,
          pse_info: {
            bank_code: pse.bankCode,
            bank_name: pse.bankName,
            document_type: pse.documentType,
            document_number: pse.documentNumber,
            payer_email: pse.payerEmail,
          }
        };
      } else {
        // Card payload
        const card = bookingData.cardData || {};
        const [expiryMonth, expiryYear] = (card.expiry || '12/25').split('/');
        const cardNumber = (card.number || '').replace(/\s/g, '') || '1234567812345678';

        purchasePayload = {
          movie_id: bookingData.movie.id,
          quantity: bookingData.ticketCount || 1,
          show_date: showDate,
          show_time: showTime,
          showtime_id: showtimeId,
          payment_info: {
            card_number: cardNumber,
            card_holder: card.name || bookingData.userName || "Cliente Cinema",
            expiry_month: parseInt(expiryMonth, 10) || 12,
            expiry_year: parseInt(`20${expiryYear}`, 10) || 2025,
            cvv: card.cvv || "123"
          }
        };
      }

      console.log('🚀 Payload CORRECTO enviado a /purchases:', purchasePayload);

      // Usar API directa en lugar del purchaseService
      const response = await api.post('/purchases', purchasePayload);

      console.log('✅ Respuesta de /purchases:', response.data);

      return {
        success: true,
        data: response.data,
        message: 'Reserva creada exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en createBooking:', error);
      console.error('📊 Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      return {
        success: false,
        data: null,
        message: error.response?.data?.detail || error.response?.data?.message || error.message || 'Error al crear la reserva'
      };
    }
  }

  // 💳 Confirmar pago - SIMULADO (no hay endpoint real de confirmación)
  async confirmPayment(purchaseId, paymentData) {
    try {
      console.log('💳 Simulando confirmación de pago para:', purchaseId, paymentData);

      // Como no hay endpoint real de confirmación, simulamos la respuesta exitosa
      const mockConfirmation = {
        id: purchaseId,
        transaction_id: paymentData.transactionId,
        payment_status: 'confirmed',
        booking_number: `BK-${purchaseId}`,
        assigned_seats: this.generateSeatNumbers(paymentData.ticketCount || 1),
        qr_code: `QR-${purchaseId}-${Date.now()}`,
        confirmation_date: new Date().toISOString()
      };

      console.log('✅ Pago simulado confirmado:', mockConfirmation);

      return {
        success: true,
        data: mockConfirmation,
        message: 'Pago confirmado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error confirmando pago:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Error al confirmar el pago'
      };
    }
  }

  // 📋 Obtener historial de compras del usuario
  async getUserBookings() {
    try {
      const response = await api.get('/purchases');
      return {
        success: true,
        data: response.data,
        message: 'Historial obtenido exitosamente'
      };
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener el historial'
      };
    }
  }

  // ❌ Cancelar una compra — llama al endpoint real
  async cancelBooking(purchaseId) {
    try {
      const data = await purchaseService.cancel(purchaseId);
      return { success: true, data, message: 'Compra cancelada exitosamente' };
    } catch (error) {
      console.error('Error cancelling purchase:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.detail || 'Error al cancelar la compra',
      };
    }
  }

  // 🔍 Obtener detalles de una compra específica
  async getBookingDetails(purchaseId) {
    try {
      const response = await api.get(`/purchases/${purchaseId}`);
      return {
        success: true,
        data: response.data,
        message: 'Detalles obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error fetching purchase details:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener los detalles'
      };
    }
  }

  // 📅 Obtener disponibilidad completa de una película
  async getMovieAvailability(movieId) {
    try {
      const response = await movieService.getAvailability(movieId);
      return {
        success: true,
        data: response,
        message: 'Disponibilidad obtenida exitosamente'
      };
    } catch (error) {
      console.error('Error fetching movie availability:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener disponibilidad'
      };
    }
  }

  // 🪑 Generar números de asientos simulados
  generateSeatNumbers(count) {
    const rows = ['J', 'K', 'L', 'M', 'N'];
    const seats = [];
    const startSeat = Math.floor(Math.random() * 15) + 1;

    for (let i = 0; i < count; i++) {
      const row = rows[Math.floor(Math.random() * rows.length)];
      seats.push(`${row}${startSeat + i}`);
    }

    return seats;
  }
}

export default new BookingService();