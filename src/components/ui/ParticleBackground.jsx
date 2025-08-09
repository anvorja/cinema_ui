// src/components/ui/ParticleBackground.jsx
import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme'; // Asumiendo que tienes este hook

const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 15000));

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          direction: Math.random() * 360
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    // Regenerar partículas cuando cambie el tamaño de ventana
    const handleResize = () => generateParticles();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradientes de fondo animados */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full animate-pulse ${
            theme === 'dark' ? 'bg-white/20' : 'bg-gray-400/20'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.speed}s`,
            opacity: particle.opacity,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Íconos de autos flotantes */}
      <div className="absolute inset-0">
        <svg className="absolute top-1/4 left-1/4 w-8 h-8 text-blue-400/20 animate-bounce" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>

        <svg className="absolute top-3/4 right-1/4 w-6 h-6 text-purple-400/20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>

        <svg className="absolute bottom-1/4 left-3/4 w-10 h-10 text-amber-400/20 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    </div>
  );
};

export default ParticleBackground;