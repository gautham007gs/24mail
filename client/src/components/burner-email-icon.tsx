interface BurnerEmailIconProps {
  className?: string;
  size?: number;
}

export function BurnerEmailIcon({ className = "", size = 24 }: BurnerEmailIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Flame gradient - Yellow to Orange to Red to Dark Red */}
        <linearGradient id="flameGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" stopOpacity="1" />
          <stop offset="30%" stopColor="#FF8C42" stopOpacity="1" />
          <stop offset="70%" stopColor="#FF5A3D" stopOpacity="1" />
          <stop offset="100%" stopColor="#E63946" stopOpacity="1" />
        </linearGradient>

        {/* Envelope gradient - Red to Deep Burgundy */}
        <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C41E3A" stopOpacity="1" />
          <stop offset="100%" stopColor="#8B1A35" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Envelope Back */}
      <g>
        {/* Main envelope rectangle */}
        <rect x="20" y="62" width="80" height="45" fill="url(#envGrad)" rx="4" strokeWidth="0" />

        {/* Envelope flap (open) */}
        <path d="M 20 62 L 60 82 L 100 62 Z" fill="#A82A47" strokeWidth="0" opacity="0.7" />

        {/* Envelope front edge highlight */}
        <path d="M 20 62 L 60 80 L 100 62 L 100 67 L 60 85 L 20 67 Z" fill="#5D0E41" opacity="0.4" />
      </g>

      {/* Flames emerging from envelope */}
      <g>
        {/* Left flame outer */}
        <path
          d="M 45 60 Q 38 48, 40 32 Q 35 42, 36 20 Q 38 30, 44 26 Q 42 40, 48 55 Z"
          fill="url(#flameGrad)"
          strokeWidth="0"
        />

        {/* Center flame (main) */}
        <path
          d="M 50 58 Q 48 45, 52 25 Q 55 38, 58 22 Q 60 35, 58 52 Z"
          fill="url(#flameGrad)"
          strokeWidth="0"
          opacity="0.98"
        />

        {/* Right flame outer */}
        <path
          d="M 68 62 Q 75 48, 74 32 Q 80 42, 82 20 Q 80 30, 74 26 Q 76 40, 70 55 Z"
          fill="url(#flameGrad)"
          strokeWidth="0"
        />

        {/* Left inner flame (darker) */}
        <path
          d="M 46 56 Q 42 48, 43 38 Q 40 45, 42 30 Q 44 40, 47 50 Z"
          fill="#FF6B3D"
          opacity="0.85"
          strokeWidth="0"
        />

        {/* Center inner flame (orange) */}
        <path
          d="M 52 54 Q 51 45, 54 32 Q 56 42, 57 30 Q 56 42, 54 50 Z"
          fill="#FF8C42"
          opacity="0.9"
          strokeWidth="0"
        />

        {/* Right inner flame (darker) */}
        <path
          d="M 68 56 Q 72 48, 71 38 Q 75 45, 73 30 Q 70 40, 69 50 Z"
          fill="#FF6B3D"
          opacity="0.85"
          strokeWidth="0"
        />

        {/* Flame glow center */}
        <ellipse cx="60" cy="42" rx="6" ry="10" fill="#FFE066" opacity="0.5" />
        <ellipse cx="60" cy="38" rx="4" ry="6" fill="#FFF5E1" opacity="0.6" />
      </g>
    </svg>
  );
}
