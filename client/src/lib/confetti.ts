interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  va: number;
  size: number;
  color: string;
  alpha: number;
}

export function triggerConfetti() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const confettis: Confetti[] = [];
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  for (let i = 0; i < 50; i++) {
    confettis.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1) * 10,
      angle: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
    });
  }

  let animationId = 0;

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let idx = confettis.length - 1; idx >= 0; idx--) {
      const conf = confettis[idx];
      conf.x += conf.vx;
      conf.y += conf.vy;
      conf.vy += 0.2;
      conf.angle += conf.va;
      conf.alpha -= 0.015;

      ctx.save();
      ctx.globalAlpha = conf.alpha;
      ctx.translate(conf.x, conf.y);
      ctx.rotate(conf.angle);
      ctx.fillStyle = conf.color;
      ctx.fillRect(-conf.size / 2, -conf.size / 2, conf.size, conf.size);
      ctx.restore();

      if (conf.alpha <= 0) {
        confettis.splice(idx, 1);
      }
    }

    if (confettis.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      canvas.remove();
      cancelAnimationFrame(animationId);
    }
  }

  animate();
}