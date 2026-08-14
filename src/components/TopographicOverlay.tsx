import React from "react";

interface TopographicOverlayProps {
  opacity?: number;
  className?: string;
}

export default function TopographicOverlay({ opacity = 0.04, className = "" }: TopographicOverlayProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      <svg
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        fill="none"
        stroke="currentColor"
      >
        <g strokeWidth="1" stroke="rgba(255, 255, 255, 0.8)">
          <path d="M-100,200 C300,150 500,400 900,300 C1300,200 1400,600 1600,500" />
          <path d="M-100,260 C280,210 480,460 880,360 C1280,260 1380,660 1600,560" />
          <path d="M-100,320 C260,270 460,520 860,420 C1260,320 1360,720 1600,620" />
          <path d="M-100,380 C240,330 440,580 840,480 C1240,380 1340,780 1600,680" />
          
          <path d="M200,900 C400,600 700,700 1100,500 C1350,380 1500,450 1600,350" />
          <path d="M250,900 C450,660 750,760 1150,560 C1400,440 1550,510 1600,410" />
          <path d="M300,900 C500,720 800,820 1200,620 C1450,500 1600,570 1650,470" />

          {/* Cartographic crosshair markers */}
          <circle cx="350" cy="280" r="4" fill="currentColor" />
          <line x1="330" y1="280" x2="370" y2="280" />
          <line x1="350" y1="260" x2="350" y2="300" />

          <circle cx="1150" cy="620" r="4" fill="currentColor" />
          <line x1="1130" y1="620" x2="1170" y2="620" />
          <line x1="1150" y1="600" x2="1150" y2="640" />
        </g>
      </svg>
    </div>
  );
}
