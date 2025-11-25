interface BurnerEmailIconProps {
  className?: string;
  size?: number;
}

export function BurnerEmailIcon({ className = "", size = 24 }: BurnerEmailIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Flame gradient */}
        <linearGradient id="flameGrad" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#E63946" stopOpacity="1" />
          <stop offset="40%" stopColor="#FF5A3D" stopOpacity="1" />
          <stop offset="70%" stopColor="#FF8B35" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFD66B" stopOpacity="1" />
        </linearGradient>

        {/* Envelope gradient */}
        <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C41E3A" stopOpacity="1" />
          <stop offset="100%" stopColor="#8B1A35" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Envelope body - main rectangle */}
      <rect x="15" y="50" width="70" height="35" fill="url(#envGrad)" rx="2" />

      {/* Envelope flap opened - top triangle */}
      <path d="M 15 50 L 50 68 L 85 50" fill="#A82A47" strokeWidth="0" />

      {/* Envelope front flap shadow */}
      <path d="M 15 50 L 50 65 L 85 50 L 85 55 L 50 70 L 15 55 Z" fill="#5D0E41" opacity="0.3" />

      {/* LEFT FLAME - Outer */}
      <path
        d="M 38 48 Q 32 42, 35 30 Q 28 38, 30 18 Q 33 28, 40 24 Q 36 35, 42 48 Z"
        fill="url(#flameGrad)"
        opacity="1"
      />

      {/* CENTER FLAME - Main/Tallest */}
      <path
        d="M 48 46 Q 46 38, 50 20 Q 54 32, 58 16 Q 60 28, 56 46 Z"
        fill="url(#flameGrad)"
        opacity="1"
      />

      {/* RIGHT FLAME - Outer */}
      <path
        d="M 62 48 Q 68 42, 65 30 Q 72 38, 70 18 Q 67 28, 60 24 Q 64 35, 58 48 Z"
        fill="url(#flameGrad)"
        opacity="1"
      />

      {/* LEFT INNER FLAME - Darker orange */}
      <path
        d="M 40 46 Q 36 40, 37 32 Q 33 38, 34 24 Q 37 32, 41 46 Z"
        fill="#FF6B3D"
        opacity="0.8"
      />

      {/* CENTER INNER FLAME - Orange */}
      <path
        d="M 50 44 Q 49 37, 52 26 Q 55 34, 57 26 Q 55 36, 50 44 Z"
        fill="#FF8B35"
        opacity="0.85"
      />

      {/* RIGHT INNER FLAME - Darker orange */}
      <path
        d="M 60 46 Q 64 40, 63 32 Q 67 38, 66 24 Q 63 32, 59 46 Z"
        fill="#FF6B3D"
        opacity="0.8"
      />

      {/* Flame highlight center glow */}
      <ellipse cx="50" cy="35" rx="5" ry="8" fill="#FFD66B" opacity="0.7" />
      <ellipse cx="50" cy="32" rx="3" ry="5" fill="#FFF5DC" opacity="0.6" />
    </svg>
  );
}
