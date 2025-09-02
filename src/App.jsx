// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import CarteleraPage from "./pages/CarteleraPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import ProntoPage from "./pages/ProntoPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ComidasPage from "./pages/ComidasPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import {ThemeProvider} from "./components/providers/ThemeProvider.jsx";
import {BookingProvider} from "./components/providers/BookingProvider.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuthProvider from "./components/providers/AuthProvider.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

import AdminApp from "./components/admin/App.jsx";

function App() {
    return (
        <ThemeProvider>
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
                                <Route path="booking/:movieId/:theaterId/:showtimeId" element={<BookingPage />} />
                                <Route path="payment" element={<PaymentPage />} />
                                <Route path="payment-success" element={<PaymentSuccessPage />} />
                                <Route path="/profile" element={<ProfilePage />} />

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
