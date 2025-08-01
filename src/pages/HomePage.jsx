// // src/pages/HomePage.jsx - Dark Mode mejorado
// import { Link } from 'react-router-dom';
// import Button from '../components/ui/Button';
// import {useAuth} from "../hooks/useAuth.js";
//
// const HomePage = () => {
//   const { isAuthenticated } = useAuth();
//
//   const features = [
//     {
//       icon: '📝',
//       title: 'Registro Fácil',
//       description: 'Añade información detallada de tus autos con validaciones automáticas'
//     },
//     {
//       icon: '🔍',
//       title: 'Búsqueda Avanzada',
//       description: 'Encuentra tus autos por marca, modelo, año, color o placa'
//     },
//     {
//       icon: '📊',
//       title: 'Estadísticas',
//       description: 'Ve estadísticas de tu colección y categoriza tus autos'
//     },
//     {
//       icon: '🏺',
//       title: 'Autos Clásicos',
//       description: 'Identifica automáticamente autos vintage de más de 25 años'
//     },
//     {
//       icon: '🔒',
//       title: 'Seguro y Privado',
//       description: 'Tus datos están protegidos con autenticación JWT segura'
//     },
//     {
//       icon: '📱',
//       title: 'Responsive',
//       description: 'Accede desde cualquier dispositivo, móvil, tablet o desktop'
//     }
//   ];
//
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
//       {/* Hero Section - Mejorado para dark mode */}
//       <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-blue-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
//               🚗 TuCarro
//             </h1>
//             {/* MEJORADO: Mejor contraste en subtítulo */}
//             <p className="text-xl md:text-2xl text-blue-100 dark:text-slate-200 mb-8 max-w-3xl mx-auto font-medium">
//               Gestiona tu colección de autos de forma simple y organizada
//             </p>
//
//             {isAuthenticated ? (
//               <div className="space-x-4">
//                 <Button
//                   as={Link}
//                   to="/cars"
//                   variant="ghost"
//                   className="bg-white dark:bg-slate-100 text-primary-600 dark:text-primary-700 hover:bg-gray-100 dark:hover:bg-slate-200 font-semibold py-3 px-8 transition-colors duration-200 shadow-lg"
//                 >
//                   🚙 Ver Mis Autos
//                 </Button>
//                 <Button
//                   as={Link}
//                   to="/profile"
//                   variant="ghost"
//                   className="border-2 border-white dark:border-slate-200 text-white dark:text-slate-200 hover:bg-white hover:text-primary-600 dark:hover:bg-slate-200 dark:hover:text-primary-700 font-semibold py-3 px-8 transition-colors duration-200"
//                 >
//                   👤 Mi Perfil
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-x-4">
//                 <Button
//                   as={Link}
//                   to="/register"
//                   variant="ghost"
//                   className="bg-white dark:bg-slate-100 text-primary-600 dark:text-primary-700 hover:bg-gray-100 dark:hover:bg-slate-200 font-semibold py-3 px-8 transition-colors duration-200 shadow-lg"
//                 >
//                   📝 Empezar Gratis
//                 </Button>
//                 <Button
//                   as={Link}
//                   to="/login"
//                   variant="ghost"
//                   className="border-2 border-white dark:border-slate-200 text-white dark:text-slate-200 hover:bg-white hover:text-primary-600 dark:hover:bg-slate-200 dark:hover:text-primary-700 font-semibold py-3 px-8 transition-colors duration-200"
//                 >
//                   🔑 Iniciar Sesión
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//
//       {/* Features Section - MEJORADO significativamente */}
//       <div className="py-24 bg-white dark:bg-slate-800 transition-colors duration-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             {/* MEJORADO: Mejor contraste en títulos */}
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-200">
//               Todo lo que necesitas para gestionar tus autos
//             </h2>
//             {/* MEJORADO: Subtítulo más legible */}
//             <p className="text-xl text-gray-600 dark:text-slate-300 transition-colors duration-200 font-medium">
//               Simple, rápido y completamente gratuito
//             </p>
//           </div>
//
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="text-center p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 group border border-transparent dark:border-slate-700 hover:shadow-lg dark:hover:shadow-xl"
//               >
//                 <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-200">
//                   {feature.icon}
//                 </div>
//                 {/* MEJORADO: Títulos más prominentes */}
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3 transition-colors duration-200">
//                   {feature.title}
//                 </h3>
//                 {/* MEJORADO: Descripción más legible */}
//                 <p className="text-gray-600 dark:text-slate-300 transition-colors duration-200 leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//
//       {/* CTA Section - Mejorado */}
//       {!isAuthenticated && (
//         <div className="bg-gray-900 dark:bg-slate-950 py-16 transition-colors duration-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h2 className="text-3xl font-bold text-white dark:text-slate-100 mb-4">
//               ¿Listo para organizar tu colección?
//             </h2>
//             {/* MEJORADO: Mejor legibilidad */}
//             <p className="text-xl text-gray-300 dark:text-slate-300 mb-8 transition-colors duration-200 font-medium">
//               Únete a TuCarro y comienza a gestionar tus autos hoy mismo
//             </p>
//             <Button
//               as={Link}
//               to="/register"
//               size="lg"
//               className="text-lg py-3 px-8 shadow-lg hover:shadow-xl transition-shadow duration-200"
//             >
//               🚀 Comenzar Ahora
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default HomePage;


// src/pages/HomePage.jsx - Diseño mejorado con glassmorphism y UX moderna
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import {
  PenTool,
  Search,
  BarChart3,
  Award,
  Shield,
  Smartphone,
  Sparkles,
  Car,
  Users,
  Star
} from 'lucide-react';

// Componente GlassCard para efectos glassmórficos
const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
    <div
      className={`
        backdrop-blur-xl bg-white/10 dark:bg-white/5
        border border-white/20 dark:border-white/10
        rounded-2xl shadow-2xl
        ${hover ? 'hover:bg-white/15 dark:hover:bg-white/10 hover:border-white/30 dark:hover:border-white/20 hover:shadow-3xl hover:-translate-y-1' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Componente para efectos de brillo animado
const ShimmerEffect = ({ children, className = "" }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shimmer" />
      {children}
    </div>
  );
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Registro Fácil",
      description: "Añade información detallada de tus autos con validaciones automáticas y formularios intuitivos",
      gradient: "from-blue-400 to-purple-500"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Búsqueda Avanzada",
      description: "Encuentra tus autos por marca, modelo, año, color o placa con filtros inteligentes",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Estadísticas",
      description: "Ve estadísticas de tu colección y categoriza tus autos con análisis detallados",
      gradient: "from-pink-400 to-red-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Autos Clásicos",
      description: "Identifica automáticamente autos vintage de más de 25 años con reconocimiento inteligente",
      gradient: "from-orange-400 to-yellow-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Seguro y Privado",
      description: "Tus datos están protegidos con autenticación JWT segura y encriptación avanzada",
      gradient: "from-green-400 to-teal-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Responsive",
      description: "Accede desde cualquier dispositivo, móvil, tablet o desktop con experiencia optimizada",
      gradient: "from-cyan-400 to-blue-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Usuarios Activos", icon: <Users className="w-6 h-6" /> },
    { number: "50K+", label: "Autos Registrados", icon: <Car className="w-6 h-6" /> },
    { number: "4.9", label: "Rating Promedio", icon: <Star className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Hero Section Mejorado */}
      <div className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShimmerEffect>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
                <span className="block">🚗 TuCarro</span>
              </h1>
            </ShimmerEffect>

            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Gestiona tu colección de autos de forma{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">
                simple y organizada
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {!isAuthenticated ? (
                <>
                  <ShimmerEffect>
                    <Button
                      as={Link}
                      to="/register"
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Empezar Gratis
                    </Button>
                  </ShimmerEffect>

                  <Button
                    as={Link}
                    to="/login"
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300"
                  >
                    Iniciar Sesión
                  </Button>
                </>
              ) : (
                <Button
                  as={Link}
                  to="/cars"
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Car className="w-5 h-5 mr-2" />
                  Ver Mis Autos
                </Button>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
              {stats.map((stat, index) => (
                <GlassCard key={index} className="p-6 text-center">
                  <div className="flex justify-center mb-3 text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Mejorado */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Todo lo que necesitas para gestionar tus autos
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple, rápido y completamente gratuito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard key={index} className="p-8 group">
                <div className="relative">
                  {/* Icono con gradiente animado */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <div className="text-white w-full h-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Efecto de brillo al hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final Section */}
      {!isAuthenticated && (
        <div className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <GlassCard className="p-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                ¿Listo para organizar tu colección?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Únete a miles de usuarios que ya confían en TuCarro para gestionar sus vehículos
              </p>

              <ShimmerEffect>
                <Button
                  as={Link}
                  to="/register"
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-5 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Comenzar Ahora
                </Button>
              </ShimmerEffect>

              <p className="text-gray-400 text-sm mt-6">
                Gratis para siempre • Sin tarjeta de crédito • Configuración en 2 minutos
              </p>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Footer mejorado */}
      <div className="relative z-10 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 TuCarro Premium. Gestiona tu colección de autos de forma simple y organizada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;