import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fishingSpots, fetchWeatherData, calculateFishingIndex, getRecommendation } from './data';
import { 
  ArrowLeft, Wind, Waves, Thermometer, Gauge, Anchor, Moon, 
  Cloud, CloudRain, MapPin, Clock, Droplets, Eye, TrendingUp, TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { spotId } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fishingIndex, setFishingIndex] = useState(0);
  
  const spot = fishingSpots.find(s => s.id === spotId);

  useEffect(() => {
    const loadData = async () => {
      if (spot) {
        setLoading(true);
        try {
          const data = await fetchWeatherData(spot.id, spot.lat, spot.lng);
          setWeatherData(data);
          setFishingIndex(calculateFishingIndex(data));
        } catch (error) {
          console.error('Error loading weather data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
    // Refresh data every 30 minutes
    const interval = setInterval(loadData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [spot]);

  if (!spot) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Ubicación no encontrada</h2>
          <Link to="/" className="text-sand-400 hover:text-sand-300">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !weatherData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando datos del clima...</p>
        </div>
      </div>
    );
  }

  const recommendation = getRecommendation(fishingIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-950 via-ocean-900 to-ocean-800">
      {/* Header */}
      <header className="py-6 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link 
            to="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Link>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-sand-400" />
            <h1 className="text-2xl font-display font-bold text-white">{spot.name}</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Fishing Index & Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            {/* Main Fishing Score */}
            <div className="md:col-span-1 glass-effect rounded-2xl p-6 text-center">
              <h3 className="text-white/70 text-sm uppercase tracking-wide mb-4">Índice de Pesca</h3>
              <div className={`text-6xl font-bold mb-2 ${recommendation.color}`}>
                {fishingIndex}
              </div>
              <div className={`inline-block px-4 py-2 rounded-full ${recommendation.bg} ${recommendation.color} font-medium`}>
                {recommendation.text}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={<Wind className="w-6 h-6" />}
                label="Viento"
                value={`${weatherData.wind.speedKnots} nudos`}
                subValue={`${weatherData.wind.speedKmh} km/h ${weatherData.wind.directionText}`}
              />
              <StatCard
                icon={<Waves className="w-6 h-6" />}
                label="Olas"
                value={`${weatherData.waves.heightFeet} pies`}
                subValue={`Periodo: ${weatherData.waves.periodSeconds}s`}
              />
              <StatCard
                icon={<Thermometer className="w-6 h-6" />}
                label="Temp. Mar"
                value={`${weatherData.seaTemperature.celsius}°C`}
                subValue={`${weatherData.seaTemperature.fahrenheit}°F`}
              />
              <StatCard
                icon={<Gauge className="w-6 h-6" />}
                label="Presión"
                value={`${weatherData.pressure.hPa} hPa`}
                subValue={weatherData.pressure.trend === 'rising' ? '↑ Subiendo' : '↓ Bajando'}
                trendIcon={weatherData.pressure.trend === 'rising' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              />
              <StatCard
                icon={<Cloud className="w-6 h-6" />}
                label="Nubosidad"
                value={`${weatherData.clouds.coverage}%`}
                subValue={`Visibilidad: ${weatherData.clouds.visibilityKm} km`}
              />
              <StatCard
                icon={<CloudRain className="w-6 h-6" />}
                label="Lluvia"
                value={`${weatherData.rain.probability}% prob.`}
                subValue={weatherData.rain.intensity}
              />
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Tides */}
            <DetailCard title="Mareas" icon={<Anchor className="w-5 h-5" />}>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div>
                    <p className="text-green-400 text-sm font-medium">Pleamar (High Tide)</p>
                    <p className="text-white/60 text-xs">Mayor altura del día</p>
                  </div>
                  <div className="text-right">
                    {weatherData.tides.high.map((tide, i) => (
                      <div key={i} className="text-white font-semibold">
                        {tide.time} <span className="text-white/60 text-sm">({tide.height}m)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Bajamar (Low Tide)</p>
                    <p className="text-white/60 text-xs">Menor altura del día</p>
                  </div>
                  <div className="text-right">
                    {weatherData.tides.low.map((tide, i) => (
                      <div key={i} className="text-white font-semibold">
                        {tide.time} <span className="text-white/60 text-sm">({tide.height}m)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Coeficiente de Marea</span>
                    <span className={`text-2xl font-bold ${weatherData.tides.coefficient >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {weatherData.tides.coefficient}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${weatherData.tides.coefficient >= 80 ? 'bg-green-400' : 'bg-yellow-400'}`}
                      style={{ width: `${weatherData.tides.coefficient}%` }}
                    />
                  </div>
                </div>
              </div>
            </DetailCard>

            {/* Moon Phase */}
            <DetailCard title="Fase Lunar" icon={<Moon className="w-5 h-5" />}>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <div 
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-200 to-gray-400 shadow-lg"
                    style={{
                      background: `linear-gradient(${weatherData.moon.illumination}%, rgba(255,255,255,0.8), rgba(100,100,100,0.3))`
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white mb-2">{weatherData.moon.phase}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Iluminación</span>
                      <span className="text-white font-semibold">{weatherData.moon.illumination}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sand-400"
                        style={{ width: `${weatherData.moon.illumination}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-sm pt-2">
                      {weatherData.moon.illumination > 50 
                        ? 'Excelente para pesca nocturna' 
                        : 'Buena visibilidad bajo el agua'}
                    </p>
                  </div>
                </div>
              </div>
            </DetailCard>
          </div>

          {/* Hourly Forecast Chart */}
          <DetailCard title="Pronóstico por Hora (Próximas 24h)" icon={<Clock className="w-5 h-5" />}>
            <div className="h-64" style={{ minHeight: '256px' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                <LineChart data={weatherData.forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="rgba(255,255,255,0.6)" 
                    tick={{ fontSize: 12 }}
                    interval={3}
                  />
                  <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    name="Temp (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="windSpeed" 
                    stroke="#38bdf8" 
                    strokeWidth={2}
                    name="Viento (nudos)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waveHeight" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Olas (pies)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DetailCard>

          {/* Rain Probability */}
          <DetailCard title="Probabilidad de Lluvia" icon={<Droplets className="w-5 h-5" />}>
            <div className="h-48" style={{ minHeight: '192px' }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={192}>
                <BarChart data={weatherData.forecast.filter((_, i) => i % 2 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="rgba(255,255,255,0.6)" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar 
                    dataKey="rainProb" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DetailCard>

          {/* Location Info */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sand-400" />
              Información de Ubicación
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-white/70 mb-2">Coordenadas</p>
                <p className="text-white font-mono text-lg">
                  {spot.lat.toFixed(6)}, {spot.lng.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-white/70 mb-2">Descripción</p>
                <p className="text-white">{spot.description}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm">
                Última actualización: {new Date(weatherData.timestamp).toLocaleString('es-MX')}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, trendIcon }) => (
  <div className="glass-effect rounded-xl p-4 hover:bg-white/15 transition-all">
    <div className="flex items-start justify-between mb-2">
      <div className="text-sand-400">{icon}</div>
      {trendIcon && <div className="text-white/60">{trendIcon}</div>}
    </div>
    <p className="text-white/60 text-sm mb-1">{label}</p>
    <p className="text-white font-semibold text-lg">{value}</p>
    <p className="text-white/50 text-xs">{subValue}</p>
  </div>
);

const DetailCard = ({ title, icon, children }) => (
  <div className="glass-effect rounded-2xl p-6">
    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <span className="text-sand-400">{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

export default Dashboard;
