'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, Droplets, AlertTriangle, Eye, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface WeatherData {
  temperature: number;
  rainIntensity: number;
  visibility: number;
  windSpeed: number;
  weatherCode: number;
}

interface RiskGaugeProps {
  value: number;
  label: string;
  maxValue?: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ value, label, maxValue = 100 }) => {
  const color = value > 70 ? '#ef4444' : value > 50 ? '#f59e0b' : '#10b981';
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 mb-2">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke="rgba(100,116,139,0.3)"
            strokeWidth="4"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="35"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${(value / maxValue) * 220} 220`}
            initial={{ strokeDasharray: '0 220' }}
            animate={{ strokeDasharray: `${(value / maxValue) * 220} 220` }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-300">{label}</p>
    </div>
  );
};

const WeatherImpactPanel: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    rainIntensity: 3.2,
    visibility: 8.5,
    windSpeed: 12,
    weatherCode: 1,
  });

  const [weatherIndex, setWeatherIndex] = useState(68);
  const [loading, setLoading] = useState(false);

  // Fetch weather from Open-Meteo API
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Polokwane coordinates: -23.9003, 29.4316
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-23.9003&longitude=29.4316&current=temperature_2m,rain,visibility,wind_speed_10m,weather_code&timezone=Africa/Johannesburg'
        );
        const data = await response.json();
        
        if (data.current) {
          const current = data.current;
          setWeather({
            temperature: Math.round(current.temperature_2m),
            rainIntensity: current.rain || 0,
            visibility: current.visibility / 1000,
            windSpeed: current.wind_speed_10m,
            weatherCode: current.weather_code,
          });

          // Calculate weather index (0-100)
          let index = 30;
          if (current.rain > 2) index += 25;
          if (current.rain > 5) index += 20;
          if (current.wind_speed_10m > 30) index += 15;
          if ((current.visibility / 1000) < 5) index += 10;
          setWeatherIndex(Math.min(index, 100));
        }
      } catch (error) {
        console.log('Weather fetch failed, using mock data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getWeatherDescription = (code: number) => {
    const descriptions: Record<number, string> = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      71: 'Slight Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Hail',
      99: 'Thunderstorm with Hail',
    };
    return descriptions[code] || 'Unknown';
  };

  const impactData = [
    { metric: 'Road Accident Risk', value: weather.rainIntensity > 2 ? 47 : 12, change: '+47%' },
    { metric: 'Traffic Congestion', value: weather.windSpeed > 20 ? 35 : 18, change: '+18%' },
    { metric: 'Hospital Load', value: weather.rainIntensity > 2 ? 42 : 15, change: '+27%' },
    { metric: 'Infrastructure Risk', value: weather.visibility < 5 ? 55 : 22, change: '+33%' },
  ];

  const forecast = [
    { time: '12:00', temp: 28, rain: 2, wind: 12 },
    { time: '14:00', temp: 30, rain: 3.5, wind: 14 },
    { time: '16:00', temp: 29, rain: 5.2, wind: 18 },
    { time: '18:00', temp: 26, rain: 4.1, wind: 16 },
    { time: '20:00', temp: 24, rain: 1.2, wind: 10 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      {/* Weather Alert Banner */}
      {weather.rainIntensity > 2 && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300 text-sm">Heavy Rain Warning</p>
            <p className="text-xs text-red-200/80 mt-1">
              Polokwane & Capricorn districts • {Math.round(47 + weather.rainIntensity * 10)}% higher crash risk on N1
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Weather Hero Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Current Weather */}
          <div className="md:col-span-2">
            <p className="text-sm text-slate-400 mb-3">Current Weather</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  {getWeatherDescription(weather.weatherCode)}
                </span>
                <span className="text-2xl font-bold text-white">{weather.temperature}°C</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Rain
                  </p>
                  <p className="text-lg font-bold text-blue-300">{weather.rainIntensity.toFixed(1)}mm</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Wind className="w-3 h-3" /> Wind
                  </p>
                  <p className="text-lg font-bold text-amber-300">{Math.round(weather.windSpeed)}km/h</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Visibility
                  </p>
                  <p className="text-lg font-bold text-cyan-300">{weather.visibility.toFixed(1)}km</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Risk Index
                  </p>
                  <p className="text-lg font-bold text-red-300">{weatherIndex}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Gauges */}
          <div className="md:col-span-3 flex justify-around items-center">
            <RiskGauge value={impactData[0].value} label="Accident Risk" />
            <RiskGauge value={impactData[1].value} label="Congestion" />
            <RiskGauge value={impactData[2].value} label="Hospital Load" />
            <RiskGauge value={impactData[3].value} label="Infrastructure" />
          </div>
        </div>

        {/* Impact Summary */}
        <div className="border-t border-slate-700/50 pt-4 mt-4">
          <p className="text-sm font-semibold text-slate-300 mb-3">Weather Impact on Services</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {impactData.map((impact, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="bg-slate-800/30 border border-slate-700/30 rounded p-2"
              >
                <p className="text-xs text-slate-400">{impact.metric}</p>
                <p className="text-sm font-bold text-white mt-1">{impact.value}%</p>
                <p className={`text-xs mt-1 ${impact.value > 40 ? 'text-red-400' : 'text-amber-400'}`}>
                  {impact.change}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 6-Hour Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">6-Hour Safety Impact Forecast</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
            <XAxis dataKey="time" stroke="rgba(148,163,184,0.6)" />
            <YAxis stroke="rgba(148,163,184,0.6)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(100,116,139,0.5)',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="rain"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Rain (mm)"
            />
            <Line
              type="monotone"
              dataKey="wind"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Wind (km/h)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default WeatherImpactPanel;
