// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import CarteleraPage from "./pages/CarteleraPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import ProntoPage from "./pages/ProntoPage.jsx";
import SeatSelectionPage from "./pages/SeatSelectionPage.jsx";
import TicketConfirmPage from "./pages/TicketConfirmPage.jsx";
import FoodSelectionPage from "./pages/FoodSelectionPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ComidasPage from "./pages/ComidasPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import {ThemeProvider} from "./components/providers/ThemeProvider.jsx";
import {BookingProvider} from "./components/providers/BookingProvider.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import CardsPage from "./pages/CardsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AuthProvider from "./components/providers/AuthProvider.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

import AdminApp from "./components/admin/App.jsx";
import { Toaster } from "./components/ui/sonner";

function App() {
    return (
        <ThemeProvider>
            <Toaster richColors closeButton />
            <AuthProvider>
                <BookingProvider>
                    <Router>
                        <ScrollToTop />
                        <Routes>
                            <Route path="/admin/*" element={<AdminApp />} />

                            <Route path="/" element={<Layout />}>
                                <Route index element={<HomePage />} />
                                <Route path="cartelera" element={<CarteleraPage />} />
                                <Route path="pronto" element={<ProntoPage />} />
                                <Route path="comidas" element={<ComidasPage />} />

                                <Route path="movie/:id" element={<MovieDetailPage />} />
                                {/* Seat selection flow — specific paths before parameterized */}
                                <Route path="booking/tickets" element={<TicketConfirmPage />} />
                                <Route path="booking/food"    element={<FoodSelectionPage />} />
                                <Route path="booking/:movieId/:theaterId/:showtimeId?" element={<SeatSelectionPage />} />
                                <Route path="payment" element={<PaymentPage />} />
                                <Route path="payment-success" element={<PaymentSuccessPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/profile/purchases" element={<TransactionsPage />} />
                                <Route path="/profile/transactions" element={<TransactionsPage />} />
                                <Route path="/profile/cards" element={<CardsPage />} />
                                <Route path="/profile/settings" element={<SettingsPage />} />

                                <Route path="*" element={<NotFoundPage />} />

                                { /*TODO:*/ }
                                {/* Future routes for admin dashboard */}
                                {/* <Route path="admin/*" element={<AdminRoutes />} /> */}
                            </Route>
                        </Routes>
                    </Router>
                </BookingProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
