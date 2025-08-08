// src/pages/RegisterPage.jsx
import RegisterForm from '../components/forms/RegisterForm';
import GlassCard from '../components/ui/GlassCard';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20" />
        {/* Elementos flotantes animados */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          >
            <div className="w-2 h-2 bg-blue-400/30 rounded-full blur-sm" />
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 via-blue-600 to-purple-500 shadow-2xl shadow-blue-500/25 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
            <span className="text-3xl relative z-10">🚗</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
            Únete a TuCarro
          </h1>
          <p className="text-gray-300 text-lg">
            Crea tu cuenta y gestiona tus vehículos
          </p>
        </div>

        {/* Formulario separado */}
        <GlassCard className="p-8 space-y-6">
          <RegisterForm />
        </GlassCard>
      </div>
    </div>
  );
};

export default RegisterPage;