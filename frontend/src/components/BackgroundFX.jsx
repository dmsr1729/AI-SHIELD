import { useEffect, useRef } from "react";

function BackgroundFX() {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrame;
    let particles = [];

    const resize = () => {

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      particles = Array.from({ length: 65 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.35 + 0.1,
        opacity: Math.random() * 0.5 + 0.15
      }));

    };

    const animate = () => {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles

      particles.forEach((p) => {

        p.y -= p.speed;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();

        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255, 45, 85, ${p.opacity})`;

        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff1744";

        ctx.fill();

      });

      // Connect nearby particles

      for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

          const a = particles[i];
          const b = particles[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {

            ctx.beginPath();

            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.strokeStyle =
              `rgba(255, 23, 68, ${0.12 * (1 - distance / 130)})`;

            ctx.lineWidth = 0.7;
            ctx.stroke();

          }

        }

      }

      animationFrame = requestAnimationFrame(animate);

    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {

      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);

    };

  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="background-fx"
    />
  );

}

export default BackgroundFX;