
import React, { useEffect, useRef } from 'react';

interface PixelBlastProps {
  variant?: 'square' | 'circle';
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
}

const PixelBlast: React.FC<PixelBlastProps> = ({
  variant = 'square',
  pixelSize = 4,
  color = '#B19EEF',
  patternScale = 2,
  patternDensity = 1,
  enableRipples = true,
  rippleSpeed = 0.3,
  rippleThickness = 0.1,
  rippleIntensityScale = 1,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.25
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -2000, y: -2000 });
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
      }
    };

    const animate = () => {
      time.current += 0.05 * speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Adjusted gap for better density coverage
      const gap = Math.max(10, 30 / (patternDensity || 1));
      const cols = Math.ceil(canvas.width / gap) + 1;
      const rows = Math.ceil(canvas.height / gap) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap;
          const y = j * gap;

          const dx = mouse.current.x - x;
          const dy = mouse.current.y - y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          let finalX = x;
          let finalY = y;

          // Blast/Ripple Physics
          if (enableRipples) {
            const rippleForce = Math.sin(dist * rippleThickness - time.current * rippleSpeed * 5);
            const influence = Math.exp(-distSq / (200 * 200)) * 30 * rippleIntensityScale;
            
            const force = (influence * rippleForce);
            finalX += (dx / (dist + 0.1)) * force;
            finalY += (dy / (dist + 0.1)) * force;
          }

          // Organic oscillation
          const noise = Math.sin(x * 0.005 * patternScale + time.current * 0.2) * 
                        Math.cos(y * 0.005 * patternScale + time.current * 0.2);
          finalX += noise * 3;
          finalY += noise * 3;

          // Alpha & Transparency logic - slightly boosted for visibility
          let alpha = transparent ? 0.35 : 1.0;
          
          // Edge Fade calculation
          if (edgeFade > 0) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const distFromCenter = Math.sqrt(Math.pow(finalX - centerX, 2) + Math.pow(finalY - centerY, 2));
            const maxDist = Math.max(centerX, centerY);
            alpha *= Math.pow(Math.max(0, 1 - (distFromCenter / maxDist)), edgeFade * 4);
          }

          // Subtle interaction glow
          const glow = Math.exp(-distSq / (250 * 250)) * 0.5;
          ctx.globalAlpha = Math.min(1, alpha + glow);
          ctx.fillStyle = color;

          if (variant === 'square') {
            ctx.fillRect(finalX - pixelSize / 2, finalY - pixelSize / 2, pixelSize, pixelSize);
          } else {
            ctx.beginPath();
            ctx.arc(finalX, finalY, pixelSize / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    variant, pixelSize, color, patternScale, patternDensity, 
    enableRipples, rippleSpeed, rippleThickness, rippleIntensityScale, 
    speed, transparent, edgeFade
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block bg-transparent"
      style={{ opacity: 1 }}
    />
  );
};

export default PixelBlast;
