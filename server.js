import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuracion de la API de NVIDIA
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_FOURCASTNET_URL = process.env.NVIDIA_FOURCASTNET_URL || 'https://ai.api.nvidia.com/v1/cv/nvidia/fourcastnet';

if (!NVIDIA_API_KEY) {
  console.warn('⚠️  ADVERTENCIA: NVIDIA_API_KEY no esta configurada en el archivo .env');
  console.warn('   Las llamadas a la API de NVIDIA fallaran hasta que configures tu API key.');
}

/**
 * Endpoint para obtener datos meteorologicos desde NVIDIA FourCastNet
 * FourCastNet devuelve predicciones globales en formato NetCDF o imagenes
 * Este endpoint procesa los datos y devuelve informacion para coordenadas especificas
 */
app.get('/api/weather', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Se requieren los parametros lat y lng' });
  }

  try {
    // Nota: La API de FourCastNet trabaja con datos globales en formato de imagen/NetCDF
    // Para este ejemplo, simulamos la llamada y procesamiento
    // En produccion, deberias descargar el NetCDF y extraer los datos para las coordenadas especificas
    
    // Ejemplo de llamada a la API de NVIDIA (ajustar segun la documentacion actual)
    const response = await axios.post(
      NVIDIA_FOURCASTNET_URL,
      {
        // Parametros segun la documentacion de FourCastNet
        // Esto puede variar dependiendo de la version de la API
        input_data: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        },
        forecast_hours: 24,
      },
      {
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );

    // Procesar respuesta de NVIDIA y convertir al formato esperado por el frontend
    const nvidiaData = response.data;
    
    // Transformar datos de NVIDIA al formato de la aplicacion
    const weatherData = transformNvidiaData(nvidiaData, lat, lng);
    
    res.json(weatherData);
  } catch (error) {
    console.error('Error llamando a NVIDIA FourCastNet:', error.message);
    
    // Si hay error con NVIDIA, devolver datos simulados como fallback
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    // Fallback a datos simulados para desarrollo
    res.json(await getSimulatedWeatherData(lat, lng));
  }
});

/**
 * Endpoint para obtener pronostico por horas
 */
app.get('/api/forecast', async (req, res) => {
  const { lat, lng, hours = 24 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Se requieren los parametros lat y lng' });
  }

  try {
    // Llamada similar a FourCastNet para obtener serie temporal
    const response = await axios.post(
      NVIDIA_FOURCASTNET_URL,
      {
        input_data: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        },
        forecast_hours: parseInt(hours),
      },
      {
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );

    const forecastData = transformForecastData(response.data, hours);
    res.json(forecastData);
  } catch (error) {
    console.error('Error obteniendo pronostico:', error.message);
    // Fallback a datos simulados
    res.json(getSimulatedForecastData(parseInt(hours)));
  }
});

/**
 * Endpoint de health check
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    nvidia_configured: !!NVIDIA_API_KEY && NVIDIA_API_KEY !== 'tu_api_key_aqui'
  });
});

// Funcion para transformar datos de NVIDIA al formato de la aplicacion
function transformNvidiaData(data, lat, lng) {
  // Esta funcion debe adaptarse segun la estructura real de respuesta de FourCastNet
  // FourCastNet tipicamente devuelve campos meteorologicos globales
  
  const now = new Date();
  
  // Estructura esperada por el frontend
  return {
    spotId: `nvidia-${lat}-${lng}`,
    timestamp: now.toISOString(),
    wind: {
      speedKnots: data.wind_speed_knots || 10.5,
      speedKmh: data.wind_speed_kmh || 19.4,
      direction: data.wind_direction || 270,
      directionText: data.wind_direction_text || 'W'
    },
    waves: {
      heightFeet: data.wave_height_feet || 3.2,
      heightMeters: data.wave_height_meters || 0.98,
      periodSeconds: data.wave_period || 8
    },
    seaTemperature: {
      celsius: data.sea_temp_celsius || 23.5,
      fahrenheit: data.sea_temp_fahrenheit || 74.3
    },
    pressure: {
      hPa: data.pressure_hpa || 1015,
      trend: data.pressure_trend || 'stable'
    },
    tides: {
      high: [
        { time: '06:30', height: 1.8 },
        { time: '18:45', height: 1.6 }
      ],
      low: [
        { time: '12:15', height: 0.4 },
        { time: '00:30', height: 0.5 }
      ],
      coefficient: 85
    },
    moon: {
      phase: 'Waxing Gibbous',
      illumination: 72
    },
    clouds: {
      coverage: data.cloud_cover || 35,
      visibilityKm: data.visibility_km || 15
    },
    rain: {
      probability: data.rain_probability || 20,
      intensity: data.rain_intensity || 'Light'
    },
    forecast: [] // Se llena con el endpoint de forecast
  };
}

function transformForecastData(data, hours = 24) {
  // Transformar datos de serie temporal de NVIDIA
  const forecast = [];
  const now = new Date();
  
  for (let i = 0; i < hours; i++) {
    const hour = (now.getHours() + i) % 24;
    forecast.push({
      hour: `${String(hour).padStart(2, '0')}:00`,
      temp: data.temperatures?.[i] || (22 + Math.sin(i / 6) * 3),
      windSpeed: data.wind_speeds?.[i] || (8 + Math.random() * 8),
      waveHeight: data.wave_heights?.[i] || (2 + Math.random() * 3),
      rainProb: data.rain_probability?.[i] || Math.floor(Math.random() * 50)
    });
  }
  
  return forecast;
}

// Datos simulados como fallback cuando NVIDIA no esta disponible
async function getSimulatedWeatherData(lat, lng) {
  const now = new Date();
  const baseTemp = 22 + (lat - 24) * 2;
  const baseWind = 8 + Math.random() * 12;
  const baseWave = 2 + Math.random() * 4;
  
  return {
    spotId: `simulated-${lat}-${lng}`,
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
    forecast: getSimulatedForecastData(24)
  };
}

function getSimulatedForecastData(hours = 24) {
  const forecast = [];
  const currentHour = new Date().getHours();
  
  for (let i = 0; i < hours; i++) {
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
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌊 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 Endpoint de clima: http://localhost:${PORT}/api/weather`);
  console.log(`📊 Endpoint de pronostico: http://localhost:${PORT}/api/forecast`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('🔑 NVIDIA API Key configurada:', !!NVIDIA_API_KEY && NVIDIA_API_KEY !== 'tu_api_key_aqui' ? '✅ SI' : '❌ NO');
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('   1. Edita el archivo .env y agrega tu API key de NVIDIA');
  console.log('   2. FourCastNet devuelve datos globales que deben procesarse para coordenadas especificas');
  console.log('   3. Sin API key valida, el servidor usara datos simulados como fallback');
});
