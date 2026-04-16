// src/components/admin/index.js
export { default as AdminDashboard } from './AdminDashboard';
export { default as LoginForm } from './LoginForm';
export { default as DashboardHeader } from './DashboardHeader';
export { default as StatsCards } from './StatsCards';
export { default as TabNavigation } from './TabNavigation';
export { default as SearchBar } from './SearchBar';

// Movies components
export { default as MoviesTab } from './movies/MoviesTab';
export { default as MovieCard } from './movies/MovieCard';
export { default as MovieModal } from './movies/MovieModal';
export { default as ImageUpload } from './movies/ImageUpload';

// Users components
export { default as UsersTab } from './users/UsersTab';
export { default as UserRow } from './users/UserRow';

// Purchases components
export { default as PurchasesTab } from './purchases/PurchasesTab';
export { default as PurchaseRow } from './purchases/PurchaseRow';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useApi } from './hooks/useApi';
export { useCloudinary } from './hooks/useCloudinary';