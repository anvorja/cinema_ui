// src/pages/LoginPage.jsx
import LoginForm from '../components/forms/LoginForm';
import GlassCard from '../components/ui/GlassCard';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-amber-500 shadow-2xl mb-6 animate-glow">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3L4 14h5l-1 7 9-11h-5l1-7z"/>
            </svg>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent mb-2">
            TuCarro
          </h1>

          <p className="text-gray-400">
            Sistema de Gestión Premium
          </p>
        </div>

        {/* Login Card con formulario separado */}
        <GlassCard className="p-8 hover-lift" intensity="strong" glow>
          <LoginForm />
        </GlassCard>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            © 2025 TuCarro Premium.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;