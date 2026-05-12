import { Link } from 'react-router-dom';
import { fishingSpots } from './data';
import { Anchor, Waves, Wind, MapPin } from 'lucide-react';
import LocationMapSVG from './LocationMapSVG';

const LandingPage = () => {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="py-8 px-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Anchor className="w-10 h-10 text-sand-300" />
            <h1 className="text-3xl font-display font-bold text-white">
              FishTrack<span className="text-sand-400">Pro</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Características</a>
            <a href="#locations" className="text-white/80 hover:text-white transition-colors">Ubicaciones</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">Nosotros</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Planifica Tu Próxima<br />
            <span className="text-sand-400">Aventura de Pesca</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            Accede a información meteorológica marina en tiempo real, mareas, 
            fases lunares y más. Todo lo que necesitas para una salida de pesca exitosa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#locations"
              className="px-8 py-4 bg-sand-500 hover:bg-sand-400 text-ocean-950 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Ver Ubicaciones
            </a>
            <a 
              href="#features"
              className="px-8 py-4 glass-effect text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
            >
              Saber Más
            </a>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-20 px-6 bg-ocean-900/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-display font-bold text-white text-center mb-16">
            Datos Esenciales Para Pescadores
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Wind className="w-8 h-8" />}
              title="Viento y Olas"
              description="Velocidad, dirección del viento y altura de olas en tiempo real"
            />
            <FeatureCard
              icon={<Waves className="w-8 h-8" />}
              title="Mareas"
              description="Horarios de pleamar y bajamar con coeficientes de marea"
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Temperatura del Mar"
              description="Datos SST para identificar zonas de pesca óptimas"
            />
            <FeatureCard
              icon={<Anchor className="w-8 h-8" />}
              title="Fase Lunar"
              description="Iluminación lunar y su impacto en la actividad pesquera"
            />
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section id="locations" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-display font-bold text-white text-center mb-4">
            Puntos de Pesca Disponibles
          </h3>
          <p className="text-white/70 text-center mb-16 max-w-2xl mx-auto">
            Selecciona una ubicación para ver el dashboard completo con toda la 
            información meteorológica y marina disponible
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fishingSpots.map((spot) => (
              <Link
                key={spot.id}
                to={`/dashboard/${spot.id}`}
                className="group relative overflow-hidden rounded-2xl card-hover"
              >
                {/* Mapa SVG personalizado como fondo */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-900/60 to-transparent z-10" />
                <div className="w-full h-80 bg-ocean-800">
                  <LocationMapSVG 
                    lat={spot.lat} 
                    lng={spot.lng} 
                    spotName={spot.name} 
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center gap-2 text-sand-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{spot.lat.toFixed(4)}, {Math.abs(spot.lng).toFixed(4)}</span>
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white mb-2">
                    {spot.name}
                  </h4>
                  <p className="text-white/80 mb-4">{spot.description}</p>
                  <div className="flex items-center text-sand-400 font-medium">
                    Ver Dashboard
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-ocean-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-display font-bold text-white mb-6">
            ¿Listo Para Tu Próxima Salida?
          </h3>
          <p className="text-white/80 text-lg mb-8">
            Consulta las condiciones actuales y planifica tu aventura con la mejor información disponible
          </p>
          <a 
            href="#locations"
            className="inline-block px-10 py-4 bg-sand-500 hover:bg-sand-400 text-ocean-950 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Explorar Ubicaciones
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-ocean-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Anchor className="w-8 h-8 text-sand-400" />
              <span className="text-xl font-display font-bold text-white">
                FishTrack<span className="text-sand-400">Pro</span>
              </span>
            </div>
            <p className="text-white/60 text-sm">
              © 2024 FishTrack Pro. Datos proporcionados por fuentes meteorológicas marinas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-effect rounded-xl p-6 hover:bg-white/15 transition-all">
    <div className="text-sand-400 mb-4">{icon}</div>
    <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
    <p className="text-white/70">{description}</p>
  </div>
);

export default LandingPage;
