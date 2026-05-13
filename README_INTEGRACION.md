# Integración de NVIDIA FourCastNet

## 📋 Resumen

Se ha integrado la API de **NVIDIA FourCastNet** al proyecto FishTrack Pro mediante un backend ligero en Node.js que:

1. Consulta la API de NVIDIA FourCastNet para obtener predicciones meteorológicas
2. Procesa los datos globales para extraer información específica por coordenadas
3. Devuelve un JSON limpio al frontend en React

## 🚀 Cómo usar

### 1. Configurar tu API Key de NVIDIA

Edita el archivo `.env` y agrega tu API key:

```bash
NVIDIA_API_KEY=tu_api_key_aqui
```

Puedes obtener tu API key en: https://build.nvidia.com/nvidia/fourcastnet/deploy

### 2. Iniciar el proyecto

**Opción A: Backend y frontend juntos (recomendado para desarrollo)**

```bash
npm run dev:all
```

Esto iniciará:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:5173`

**Opción B: Solo backend**

```bash
npm run server
```

**Opción C: Solo frontend (con datos simulados)**

```bash
npm run dev
```

## 📡 Endpoints del Backend

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/weather?lat={lat}&lng={lng}` | Obtiene datos meteorológicos actuales |
| `GET /api/forecast?lat={lat}&lng={lng}&hours=24` | Obtiene pronóstico por horas |
| `GET /api/health` | Verifica el estado del servidor |

## 🔄 Flujo de Datos

```
Frontend (React)
    ↓
Backend (Node.js/Express)
    ↓
NVIDIA FourCastNet API
    ↓
Procesamiento de datos
    ↓
JSON limpio → Frontend
```

## ⚠️ Consideraciones Importantes

1. **FourCastNet devuelve datos globales**: La API de FourCastNet típicamente devuelve imágenes o archivos NetCDF con datos globales. El backend incluye funciones de transformación que deben adaptarse según la estructura exacta de respuesta de la API.

2. **Fallback automático**: Si la API de NVIDIA no está disponible o la API key no es válida, el sistema usa datos simulados automáticamente para que la aplicación siga funcionando.

3. **Datos oceanográficos**: FourCastNet se especializa en predicciones atmosféricas. Para datos específicos de olas, mareas y temperatura del mar, considera complementar con:
   - Open-Meteo (gratis, sin API key)
   - Stormglass (tiene plan gratuito)
   - NOAA (datos gratuitos)

## 🛠️ Archivos Modificados/Creados

| Archivo | Propósito |
|---------|-----------|
| `server.js` | Backend Express que conecta con NVIDIA |
| `.env` | Variables de entorno (API keys, puertos) |
| `.env.example` | Ejemplo de configuración |
| `src/data.js` | Actualizado para consumir el backend |
| `package.json` | Nuevos scripts y dependencias |

## 🔧 Personalización

### Cambiar el puerto del backend

En `.env`:
```
PORT=3001
```

### Usar otro URL para el backend en producción

En el frontend (`.env` del frontend o variables de entorno):
```
VITE_BACKEND_URL=https://tu-backend.com
```

### Adaptar las funciones de transformación

Edita `server.js` y modifica las funciones:
- `transformNvidiaData()` - Para datos actuales
- `transformForecastData()` - Para pronósticos

## 📝 Notas sobre FourCastNet

FourCastNet es un modelo de IA de NVIDIA que proporciona:
- Predicciones meteorológicas de alta resolución
- Variables atmosféricas globales
- Pronósticos hasta 24 horas

**Documentación oficial**: https://build.nvidia.com/nvidia/fourcastnet/modelcard

## 🐛 Solución de Problemas

### El backend no inicia
- Verifica que el archivo `.env` exista
- Asegúrate de que el puerto 3001 no esté en uso

### Error de API key
- El backend usará datos simulados como fallback
- Verifica tu API key en https://build.nvidia.com

### CORS errors en el frontend
- El backend ya incluye CORS habilitado
- Verifica que `VITE_BACKEND_URL` sea correcto

---

**FishTrack Pro** - Predicciones meteorológicas para pesca con NVIDIA AI 🎣🌊
