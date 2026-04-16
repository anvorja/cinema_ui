// src/components/effects/FloatingParticles.jsx
import { useEffect, useRef } from 'react';

const FloatingParticles = ({ count = 50, className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = Array.from({ length: count }, (_, i) => {
      const particle = document.createElement('div');
      particle.className = `absolute w-1 h-1 bg-white/20 rounded-full animate-float-${i % 3}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.style.animationDuration = `${10 + Math.random() * 20}s`;
      return particle;
    });

    particles.forEach(particle => {
      containerRef.current.appendChild(particle);
    });

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    />
  );
};

export { FloatingParticles };