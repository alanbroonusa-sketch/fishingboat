// Componente SVG para mapa de ubicación personalizado
// Simula un estilo Google Maps con la costa de Baja California Sur

const LocationMapSVG = ({ lat, lng, spotName }) => {
  // Calcular posición del pin basado en coordenadas reales
  // Las coordenadas están en el rango: lat 24.35-24.89, lng -110.12 a -110.31
  const minLat = 24.3;
  const maxLat = 24.95;
  const minLng = -110.35;
  const maxLng = -110.1;
  
  // Normalizar coordenadas a porcentajes del SVG
  const xPercent = ((lng - minLng) / (maxLng - minLng)) * 100;
  const yPercent = ((maxLat - lat) / (maxLat - minLat)) * 100;
  
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Definiciones para gradientes y filtros */}
      <defs>
        <linearGradient id={`ocean-gradient-${spotName}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        
        <linearGradient id={`land-gradient-${spotName}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        
        <filter id={`glow-${spotName}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <pattern id={`grid-pattern-${spotName}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        </pattern>
      </defs>
      
      {/* Fondo oceánico */}
      <rect width="400" height="300" fill={`url(#ocean-gradient-${spotName})`} />
      
      {/* Patrón de cuadrícula tipo mapa */}
      <rect width="400" height="300" fill={`url(#grid-pattern-${spotName})`} />
      
      {/* Línea de costa simplificada de Baja California Sur */}
      <path 
        d="M 0,0 L 150,0 L 160,20 L 155,40 L 165,60 L 158,80 L 170,100 L 162,120 L 175,140 L 168,160 L 180,180 L 172,200 L 185,220 L 175,240 L 190,260 L 180,280 L 200,300 L 0,300 Z" 
        fill={`url(#land-gradient-${spotName})`}
        opacity="0.9"
      />
      
      {/* Segunda sección de costa */}
      <path 
        d="M 220,0 L 400,0 L 400,300 L 240,300 L 235,280 L 245,260 L 238,240 L 250,220 L 242,200 L 255,180 L 248,160 L 260,140 L 252,120 L 265,100 L 258,80 L 270,60 L 262,40 L 275,20 L 265,0 Z" 
        fill={`url(#land-gradient-${spotName})`}
        opacity="0.9"
      />
      
      {/* Líneas de profundidad (isobatas) */}
      <path d="M 180,50 Q 200,80 190,110 T 200,170" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" strokeDasharray="5,5" />
      <path d="M 190,40 Q 210,70 200,100 T 210,160" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" strokeDasharray="5,5" />
      <path d="M 200,30 Q 220,60 210,90 T 220,150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" strokeDasharray="5,5" />
      
      {/* Pin de ubicación con efecto glow */}
      <g filter={`url(#glow-${spotName})`} transform={`translate(${xPercent * 4}, ${yPercent * 3})`}>
        {/* Sombra del pin */}
        <ellipse cx="0" cy="5" rx="8" ry="3" fill="rgba(0,0,0,0.3)" />
        
        {/* Cuerpo del pin */}
        <path 
          d="M 0,-15 C 0,-15 12,-5 12,8 C 12,13 8,18 0,22 C -8,18 -12,13 -12,8 C -12,-5 0,-15 0,-15 Z" 
          fill="#ef4444"
          stroke="#ffffff"
          strokeWidth="2"
        />
        
        {/* Círculo central del pin */}
        <circle cx="0" cy="0" r="5" fill="#ffffff" />
        <circle cx="0" cy="0" r="3" fill="#ef4444" />
      </g>
      
      {/* Etiqueta de coordenadas */}
      <g transform={`translate(${xPercent * 4 + 15}, ${yPercent * 3 - 10})`}>
        <rect x="0" y="0" width="90" height="20" rx="3" fill="rgba(15, 23, 42, 0.8)" />
        <text x="45" y="14" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </text>
      </g>
      
      {/* Brújula decorativa */}
      <g transform="translate(370, 30)">
        <circle cx="0" cy="0" r="12" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <polygon points="0,-8 2,0 0,8 -2,0" fill="#ef4444" />
        <text x="0" y="-10" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">N</text>
      </g>
      
      {/* Escala de distancia */}
      <g transform="translate(20, 280)">
        <line x1="0" y1="0" x2="60" y2="0" stroke="#ffffff" strokeWidth="2" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#ffffff" strokeWidth="2" />
        <line x1="60" y1="-3" x2="60" y2="3" stroke="#ffffff" strokeWidth="2" />
        <text x="30" y="12" textAnchor="middle" fill="#ffffff" fontSize="8">5 km</text>
      </g>
      
      {/* Nombre de la ubicación */}
      <rect x="10" y="10" width="180" height="24" rx="4" fill="rgba(15, 23, 42, 0.9)" />
      <text x="100" y="26" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
        {spotName.toUpperCase()}
      </text>
    </svg>
  );
};

export default LocationMapSVG;
