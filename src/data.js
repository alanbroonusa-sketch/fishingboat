// Coordenadas de los puntos de pesca
export const fishingSpots = [
  {
    id: 'punta-coyote',
    name: 'Punta Coyote',
    lat: 24.350398,
    lng: -110.216412,
    description: 'Excelente para pesca de superficie',
    image: 'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?w=800&q=80'
  },
  {
    id: 'el-bajito',
    name: 'El Bajito',
    lat: 24.476320,
    lng: -110.128936,
    description: 'Zona de arrecifes y aguas profundas',
    image: 'https://images.unsplash.com/photo-1582967787606-1c26d33e4a61?w=800&q=80'
  },
  {
    id: 'la-partida-afuera',
    name: 'La Partida - Afuera',
    lat: 24.562999,
    lng: -110.285411,
    description: 'Aguas abiertas, pesca deportiva',
    image: 'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?w=800&q=80'
  },
  {
    id: 'el-charrito',
    name: 'El Charrito',
    lat: 24.722172,
    lng: -110.312104,
    description: 'Pesca de fondo y arrastre',
    image: 'https://images.unsplash.com/photo-1582967787606-1c26d33e4a61?w=800&q=80'
  },
  {
    id: 'el-charro',
    name: 'El Charro',
    lat: 24.890059,
    lng: -110.216158,
    description: 'Zona privilegiada para marlin y atún',
    image: 'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?w=800&q=80'
  }
];

// URL del backend (cambiar a produccion cuando sea necesario)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Funcion para obtener datos climáticos desde el backend con NVIDIA FourCastNet
export const fetchWeatherData = async (spotId, lat, lng) => {
  try {
    // Intentar obtener datos del backend que usa NVIDIA FourCastNet
    const response = await fetch(`${BACKEND_URL}/api/weather?lat=${lat}&lng=${lng}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Generar pronostico por horas
    const forecastResponse = await fetch(`${BACKEND_URL}/api/forecast?lat=${lat}&lng=${lng}&hours=24`);
    if (forecastResponse.ok) {
      data.forecast = await forecastResponse.json();
    }
    
    console.log('✅ Datos obtenidos del backend:', data.spotId);
    return data;
  } catch (error) {
    console.warn('⚠️  Error conectando al backend, usando datos simulados:', error.message);
    
    // Fallback a datos simulados si el backend no esta disponible
    return getSimulatedWeatherData(spotId, lat, lng);
  }
};

// Funcion para obtener datos simulados (fallback)
const getSimulatedWeatherData = (spotId, lat, lng) => {
  const now = new Date();
  const hour = now.getHours();
  
  // Generar datos realistas basados en la ubicacion
  const baseTemp = 22 + (lat - 24) * 2; // Temperatura base ajustada por latitud
  const baseWind = 8 + Math.random() * 12;
  const baseWave = 2 + Math.random() * 4;
  
  return {
    spotId,
    timestamp: now.toISOString(),
    wind: {
      speedKnots: parseFloat(baseWind.toFixed(1)),
      speedKmh: parseFloat((baseWind * 1.852).toFixed(1)),
      direction: Math.floor(Math.random() * 360),
      directionText: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]
    },
    waves: {
      heightFeet: parseFloat(baseWave.toFixed(1)),
      heightMeters: parseFloat((baseWave * 0.3048).toFixed(2)),
      periodSeconds: Math.floor(6 + Math.random() * 8)
    },
    seaTemperature: {
      celsius: parseFloat((baseTemp + Math.random() * 3).toFixed(1)),
      fahrenheit: parseFloat(((baseTemp + Math.random() * 3) * 9/5 + 32).toFixed(1))
    },
    pressure: {
      hPa: Math.floor(1010 + Math.random() * 20),
      trend: Math.random() > 0.5 ? 'rising' : 'falling'
    },
    tides: {
      high: [
        { time: `${String(Math.floor(5 + Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, height: 1.8 },
        { time: `${String(Math.floor(17 + Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, height: 1.6 }
      ],
      low: [
        { time: `${String(Math.floor(11 + Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, height: 0.4 },
        { time: `${String(Math.floor(23 + Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, height: 0.5 }
      ],
      coefficient: Math.floor(60 + Math.random() * 40)
    },
    moon: {
      phase: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'][Math.floor(Math.random() * 8)],
      illumination: Math.floor(Math.random() * 100)
    },
    clouds: {
      coverage: Math.floor(Math.random() * 100),
      visibilityKm: Math.floor(8 + Math.random() * 12)
    },
    rain: {
      probability: Math.floor(Math.random() * 100),
      intensity: ['None', 'Light', 'Moderate', 'Heavy'][Math.floor(Math.random() * 4)]
    },
    forecast: generateHourlyForecast(hour)
  };
};

const generateHourlyForecast = (currentHour) => {
  const forecast = [];
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    forecast.push({
      hour: `${String(hour).padStart(2, '0')}:00`,
      temp: parseFloat((22 + Math.sin(i / 6) * 3 + Math.random() * 2).toFixed(1)),
      windSpeed: parseFloat((8 + Math.random() * 8).toFixed(1)),
      waveHeight: parseFloat((2 + Math.random() * 3).toFixed(1)),
      rainProb: Math.floor(Math.random() * 50)
    });
  }
  return forecast;
};

// Calcular índice de pesca basado en múltiples factores
export const calculateFishingIndex = (weatherData) => {
  let score = 50;
  
  // Viento (óptimo 5-15 nudos)
  if (weatherData.wind.speedKnots >= 5 && weatherData.wind.speedKnots <= 15) {
    score += 15;
  } else if (weatherData.wind.speedKnots > 20) {
    score -= 20;
  }
  
  // Olas (óptimo 1-3 pies)
  if (weatherData.waves.heightFeet >= 1 && weatherData.waves.heightFeet <= 3) {
    score += 15;
  } else if (weatherData.waves.heightFeet > 5) {
    score -= 15;
  }
  
  // Presión atmosférica (estable es mejor)
  if (weatherData.pressure.hPa >= 1013 && weatherData.pressure.hPa <= 1020) {
    score += 10;
  }
  
  // Lluvia
  if (weatherData.rain.probability < 30) {
    score += 10;
  } else if (weatherData.rain.probability > 70) {
    score -= 15;
  }
  
  // Coeficiente de marea (alto es mejor para pesca)
  if (weatherData.tides.coefficient >= 80) {
    score += 10;
  }
  
  // Iluminación lunar (varía según preferencia, pero 40-60% es bueno)
  if (weatherData.moon.illumination >= 40 && weatherData.moon.illumination <= 60) {
    score += 5;
  }
  
  return Math.min(100, Math.max(0, score));
};

// Obtener recomendación basada en el índice
export const getRecommendation = (score) => {
  if (score >= 80) {
    return { text: '¡Condiciones Excelentes!', color: 'text-green-600', bg: 'bg-green-100' };
  } else if (score >= 60) {
    return { text: 'Buenas Condiciones', color: 'text-blue-600', bg: 'bg-blue-100' };
  } else if (score >= 40) {
    return { text: 'Condiciones Regulares', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  } else {
    return { text: 'Condiciones Desfavorables', color: 'text-red-600', bg: 'bg-red-100' };
  }
};
