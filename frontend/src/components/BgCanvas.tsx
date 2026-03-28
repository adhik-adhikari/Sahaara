import { useEffect, useRef } from "react";

interface Orb {
  x: number; y: number; r: number;
  vx: number; vy: number;
  hue: number; sat: number;
}
interface Pt {
  x: number; y: number; r: number;
  vx: number; vy: number;
  life: number; maxLife: number; hue: number;
}

export default function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let CW = 0, CH = 0;
    let orbs: Orb[] = [];
    let pts: Pt[] = [];
    let rafId = 0;

    const init = () => {
      CW = canvas.width  = window.innerWidth;
      CH = canvas.height = window.innerHeight;
      orbs = Array.from({ length: 5 }, (_, i) => ({
        x: Math.random() * CW, y: Math.random() * CH,
        r: Math.random() * 200 + 130,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.1,
        hue: [210, 180, 200, 165, 220][i],
        sat: [40, 45, 38, 50, 35][i],
      }));
      pts = Array.from({ length: 80 }, () => ({
        x: Math.random() * CW, y: Math.random() * CH,
        r: Math.random() * 1.1 + 0.2,
        vy: -(Math.random() * 0.14 + 0.035),
        vx: (Math.random() - 0.5) * 0.045,
        life: 0, maxLife: Math.random() * 260 + 150,
        hue: Math.random() * 40 + 190,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = "#080b12";
      ctx.fillRect(0, 0, CW, CH);

      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = CW + o.r;
        if (o.x > CW + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = CH + o.r;
        if (o.y > CH + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},${o.sat}%,28%,0.065)`);
        g.addColorStop(1, `hsla(${o.hue},${o.sat}%,18%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
      });

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.life > p.maxLife || p.y < -5) {
          p.x = Math.random() * CW; p.y = CH + 5;
          p.life = 0; p.maxLife = Math.random() * 260 + 150;
        }
        const a = Math.sin((p.life / p.maxLife) * Math.PI) * 0.38;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},50%,72%,${a})`; ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", init); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
