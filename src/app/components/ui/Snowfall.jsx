"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Snowfall – realistic canvas snow that plays for a few seconds, then fades out.
 *
 * Usage:
 *   <Snowfall />                       // 5 seconds
 *   <Snowfall durationMs={8000} />     // 8 seconds
 *   <Snowfall durationMs={0} />        // never stops
 *
 * Props:
 *   durationMs - how long new snow keeps falling (0 = forever). Default 5000.
 *   fadeMs     - fade-out time after durationMs. Default 1500.
 *   count      - flakes on desktop (halved on mobile)
 *   speed      - fall speed multiplier
 *   wind       - sideways drift strength
 *   zIndex     - stacking order (overlay never blocks clicks)
 *   respectReducedMotion - true = no snow for users with reduced motion on
 */

// Soft round flake: white core, icy-blue rim so it shows on white pages too
function makeSoftSprite(size) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const h = size / 2;
  const grad = g.createRadialGradient(h, h, 0, h, h, h);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.75, "rgba(190,220,250,0.7)");
  grad.addColorStop(1, "rgba(190,220,250,0)");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(h, h, h, 0, Math.PI * 2);
  g.fill();
  return c;
}

// Six-armed ice crystal for the bigger, closer flakes
function makeCrystalSprite(size) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const h = size / 2;
  g.translate(h, h);
  g.lineCap = "round";

  const arms = (width, color) => {
    g.lineWidth = width;
    g.strokeStyle = color;
    for (let i = 0; i < 6; i++) {
      g.save();
      g.rotate((i * Math.PI) / 3);
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(0, -h * 0.9);
      // small side branches
      g.moveTo(0, -h * 0.5);
      g.lineTo(h * 0.22, -h * 0.72);
      g.moveTo(0, -h * 0.5);
      g.lineTo(-h * 0.22, -h * 0.72);
      g.stroke();
      g.restore();
    }
  };

  arms(size * 0.14, "rgba(150,200,245,0.55)"); // icy outer glow
  arms(size * 0.06, "rgba(255,255,255,1)"); // bright inner line

  const core = g.createRadialGradient(0, 0, 0, 0, 0, h * 0.28);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(1, "rgba(200,225,250,0)");
  g.fillStyle = core;
  g.beginPath();
  g.arc(0, 0, h * 0.28, 0, Math.PI * 2);
  g.fill();
  return c;
}

export default function Snowfall({
  durationMs = 3000,
  fadeMs = 1500,
  count = 130,
  speed = 1,
  wind = 0.6,
  zIndex = 9999,
  respectReducedMotion = false,
  className = "",
}) {
  const canvasRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (
      respectReducedMotion &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDone(true);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const soft = makeSoftSprite(64);
    const crystal = makeCrystalSprite(96);

    let width = 0;
    let height = 0;
    let flakes = [];
    let rafId = null;
    let t = 0;
    const start = performance.now();

    // depth: 0 = far (small, slow, faint) … 1 = near (big, fast)
    const makeFlake = (randomY) => {
      const depth = Math.pow(Math.random(), 1.6);
      const size = 4 + depth * 20; // px diameter
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -size,
        size,
        vy: (0.5 + depth * 1.8) * speed,
        phase: Math.random() * Math.PI * 2,
        sway: 0.4 + Math.random() * 0.9,
        spin: (Math.random() - 0.5) * 0.02,
        rot: Math.random() * Math.PI * 2,
        alpha: 0.45 + depth * 0.5,
        isCrystal: depth > 0.72,
      };
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const total = width < 768 ? Math.round(count * 0.5) : count;
      flakes = Array.from({ length: total }, () => makeFlake(true));
    };

    const draw = (now) => {
      const elapsed = now - start;
      const active = durationMs === 0 || elapsed < durationMs;
      t += 0.012;

      // global opacity: quick fade-in, fade-out after durationMs
      let global = Math.min(1, elapsed / 500);
      if (!active) global *= Math.max(0, 1 - (elapsed - durationMs) / fadeMs);

      if (global <= 0 && !active) {
        ctx.clearRect(0, 0, width, height);
        setDone(true);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (const f of flakes) {
        ctx.globalAlpha = f.alpha * global;
        ctx.save();
        ctx.translate(f.x, f.y);
        if (f.isCrystal) {
          ctx.rotate(f.rot);
          ctx.drawImage(crystal, -f.size / 2, -f.size / 2, f.size, f.size);
        } else {
          ctx.drawImage(soft, -f.size / 2, -f.size / 2, f.size, f.size);
        }
        ctx.restore();

        f.y += f.vy;
        f.x += Math.sin(t * f.sway + f.phase) * wind * (0.4 + f.size / 24);
        f.rot += f.spin;

        if (f.y > height + f.size) {
          if (active) {
            Object.assign(f, makeFlake(false), { x: Math.random() * width });
          } else {
            f.alpha = 0; // let it drop out quietly
          }
        }
        if (f.x > width + f.size) f.x = -f.size;
        else if (f.x < -f.size) f.x = width + f.size;
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };

    resize();
    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [durationMs, fadeMs, count, speed, wind, respectReducedMotion]);

  if (done) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex,
      }}
    />
  );
}