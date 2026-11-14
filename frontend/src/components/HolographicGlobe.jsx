import { useEffect, useRef } from "react";

function HolographicGlobe() {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrame;
    let rotation = 0;

    const resize = () => {

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    };

    const draw = () => {

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      const cx = width / 2;
      const cy = height / 2;

      const radius = Math.min(width, height) * 0.34;

      ctx.clearRect(0, 0, width, height);

      // Outer glow

      const glow = ctx.createRadialGradient(
        cx, cy, radius * 0.2,
        cx, cy, radius * 1.5
      );

      glow.addColorStop(0, "rgba(255, 23, 68, 0.15)");
      glow.addColorStop(1, "rgba(255, 23, 68, 0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);


      // Rotating longitude lines

      ctx.save();

      ctx.translate(cx, cy);
      ctx.rotate(rotation * 0.25);

      for (let i = 0; i < 6; i++) {

        const angle = (Math.PI * i) / 6;

        ctx.beginPath();

        ctx.ellipse(
          0,
          0,
          radius * Math.abs(Math.cos(angle)),
          radius,
          0,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle = "rgba(255, 40, 85, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();

      }

      ctx.restore();


      // Latitude lines

      for (let i = -2; i <= 2; i++) {

        const y = i * radius * 0.35;

        const lineWidth = Math.sqrt(
          Math.max(0, radius * radius - y * y)
        );

        ctx.beginPath();

        ctx.ellipse(
          cx,
          cy + y,
          lineWidth,
          radius * 0.12,
          0,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle = "rgba(255, 70, 105, 0.4)";
        ctx.stroke();

      }


      // Globe boundary

      ctx.beginPath();

      ctx.arc(cx, cy, radius, 0, Math.PI * 2);

      ctx.strokeStyle = "#ff1744";
      ctx.lineWidth = 1.5;

      ctx.shadowBlur = 22;
      ctx.shadowColor = "#ff1744";

      ctx.stroke();

      ctx.shadowBlur = 0;


      // Rotating orbital rings

      ctx.save();

      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      ctx.beginPath();

      ctx.ellipse(
        0, 0,
        radius * 1.35,
        radius * 0.35,
        0, 0, Math.PI * 2
      );

      ctx.strokeStyle = "rgba(255, 23, 68, 0.7)";
      ctx.lineWidth = 1.2;
      ctx.stroke();


      // Orbiting glowing point

      const px = radius * 1.35 * Math.cos(rotation * 2);
      const py = radius * 0.35 * Math.sin(rotation * 2);

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);

      ctx.fillStyle = "#ff536f";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#ff1744";
      ctx.fill();

      ctx.restore();


      // Central security core

      const pulse = 1 + Math.sin(rotation * 3) * 0.12;

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        9 * pulse,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "#ff1744";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#ff1744";
      ctx.fill();

      ctx.shadowBlur = 0;


      rotation += 0.003;

      animationFrame = requestAnimationFrame(draw);

    };


    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {

      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);

    };

  }, []);


  return (
    <canvas
      ref={canvasRef}
      className="holographic-globe"
    />
  );

}

export default HolographicGlobe;