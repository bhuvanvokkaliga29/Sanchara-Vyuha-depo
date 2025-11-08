import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Leaf, Droplet, Heart, Zap, TrendingUp, BarChart3, Sparkles, TrendingDown, AlertTriangle, Globe, Download, Mic, Trophy, Eye, EyeOff, X, Cloud, Users } from 'lucide-react';
import { 
  SustainabilityMetrics, 
  EmissionTrendData, 
  FuelOptimizationData, 
  AIInsight,
  ForecastMetric,
  RouteOptimization,
  DepotEnergyStatus,
  AnomalyAlert,
  CityImpactScenario,
  BusEcoMetrics,
  WeatherInsight,
  ComfortIndex,
  LeaderboardEntry
} from '../types';

interface SustainabilityDashboardProps {
  metrics: SustainabilityMetrics;
  emissionTrend: EmissionTrendData[];
  fuelOptimization: FuelOptimizationData[];
  insights: AIInsight[];
  forecast: ForecastMetric;
  routeOptimizations: RouteOptimization[];
  depotEnergy: DepotEnergyStatus;
  anomalies: AnomalyAlert[];
  cityImpact: CityImpactScenario;
  busEcoMetrics: BusEcoMetrics[];
  weatherInsight: WeatherInsight;
  comfortIndex: ComfortIndex;
  leaderboard: LeaderboardEntry[];
}

export const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({
  metrics,
  emissionTrend,
  fuelOptimization,
  insights,
  forecast,
  routeOptimizations,
  depotEnergy,
  anomalies,
  cityImpact,
  busEcoMetrics,
  weatherInsight,
  comfortIndex,
  leaderboard
}) => {
  const [carbonCount, setCarbonCount] = useState(0);
  const [ecoScore, setEcoScore] = useState(0);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [publicDisplayMode, setPublicDisplayMode] = useState(false);
  const [sortBy, setSortBy] = useState<'efficiency' | 'co2Saved'>('co2Saved');
  const [visibleAnomalies, setVisibleAnomalies] = useState<AnomalyAlert[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const carbonInterval = setInterval(() => {
      setCarbonCount(prev => {
        const diff = metrics.carbonSaved - prev;
        if (Math.abs(diff) < 1) return metrics.carbonSaved;
        return prev + Math.sign(diff) * Math.min(Math.abs(diff), 15);
      });
    }, 20);

    return () => clearInterval(carbonInterval);
  }, [metrics.carbonSaved]);

  useEffect(() => {
    const ecoInterval = setInterval(() => {
      setEcoScore(prev => {
        const diff = metrics.ecoScore - prev;
        if (Math.abs(diff) < 1) return metrics.ecoScore;
        return prev + Math.sign(diff) * 1;
      });
    }, 30);

    return () => clearInterval(ecoInterval);
  }, [metrics.ecoScore]);

  useEffect(() => {
    if (insights.length === 0) return;
    
    const insightInterval = setInterval(() => {
      setCurrentInsightIndex(prev => (prev + 1) % insights.length);
    }, 5000);

    return () => clearInterval(insightInterval);
  }, [insights.length]);

  useEffect(() => {
    setVisibleAnomalies(anomalies);
  }, [anomalies]);

  const getEcoScoreColor = (score: number) => {
    if (score >= 81) return '#4CAF50';
    if (score >= 51) return '#F59E0B';
    return '#EF4444';
  };

  const ecoScoreData = [
    { name: 'Score', value: ecoScore },
    { name: 'Remaining', value: 100 - ecoScore }
  ];

  const COLORS = [getEcoScoreColor(ecoScore), '#E5E7EB'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-green-200 dark:border-green-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'eco':
        return '🌱';
      case 'efficiency':
        return '⚡';
      case 'achievement':
        return '🏆';
      default:
        return '💡';
    }
  };

  const dismissAnomaly = (id: string) => {
    setVisibleAnomalies(prev => prev.filter(a => a.id !== id));
  };

  const sortedOptimizations = Array.isArray(routeOptimizations) 
    ? [...routeOptimizations].sort((a, b) => 
        sortBy === 'co2Saved' ? b.co2Saved - a.co2Saved : b.efficiency - a.efficiency
      )
    : [];

  const paginatedBusMetrics = Array.isArray(busEcoMetrics)
    ? busEcoMetrics.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : [];

  const generateReport = () => {
    const report = `
BMTC Depot 3 - Sustainability Weekly Report
============================================

Carbon Emissions: ${metrics.carbonSaved} kg CO₂ saved
Fuel Efficiency: ${metrics.fuelEfficiency.savedThisWeek}L saved this week
Eco Score: ${metrics.ecoScore}/100 (Grade ${metrics.ecoScore >= 81 ? 'A' : metrics.ecoScore >= 51 ? 'B' : 'C'})
EV Readiness: ${metrics.evReadiness}% of routes ready

Top Performing Routes:
${sortedOptimizations.slice(0, 3).map((r, i) => `${i + 1}. ${r.route} - ${r.efficiency}% efficiency, ${r.co2Saved} kg CO₂/day saved`).join('\n')}

AI Recommendations:
${insights.map(i => `- ${i.message} (${i.impact})`).join('\n')}
    `.trim();
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sustainability-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return '☀️';
      case 'rainy':
        return '🌧️';
      case 'cloudy':
        return '☁️';
      default:
        return '🌤️';
    }
  };

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  if (publicDisplayMode) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setPublicDisplayMode(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <EyeOff className="h-4 w-4" />
            <span>Exit Public Mode</span>
          </button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            🌱 BMTC Green Intelligence
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400">
            Real-Time Sustainability Dashboard
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-3xl p-8 text-center shadow-2xl">
            <Leaf className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-gray-600 dark:text-gray-400 text-xl mb-2">Carbon Saved</h3>
            <p className="text-6xl font-bold text-gray-900 dark:text-white">{carbonCount.toLocaleString()}</p>
            <p className="text-2xl text-gray-500 dark:text-gray-400 mt-2">kg CO₂</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-3xl p-8 text-center shadow-2xl">
            <Droplet className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-gray-600 dark:text-gray-400 text-xl mb-2">Fuel Saved</h3>
            <p className="text-6xl font-bold text-gray-900 dark:text-white">{metrics.fuelEfficiency.savedThisWeek}</p>
            <p className="text-2xl text-gray-500 dark:text-gray-400 mt-2">Litres</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-3xl p-8 text-center shadow-2xl">
            <Heart className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-gray-600 dark:text-gray-400 text-xl mb-2">Eco Score</h3>
            <p className="text-6xl font-bold text-gray-900 dark:text-white">{ecoScore}</p>
            <p className="text-2xl text-gray-500 dark:text-gray-400 mt-2">/ 100</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800 rounded-3xl p-8 text-center shadow-2xl">
            <Zap className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-gray-600 dark:text-gray-400 text-xl mb-2">EV Ready</h3>
            <p className="text-6xl font-bold text-gray-900 dark:text-white">{metrics.evReadiness}%</p>
            <p className="text-2xl text-gray-500 dark:text-gray-400 mt-2">Routes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Leaf className="h-8 w-8 text-green-500 dark:text-green-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sustainability Dashboard – Green Intelligence Stats
          </h2>
        </div>
        <button
          onClick={() => setPublicDisplayMode(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <Eye className="h-4 w-4" />
          <span>Public Display Mode</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800/50 backdrop-blur-sm border border-green-200 dark:border-green-700 rounded-2xl p-6 shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 dark:bg-green-600 rounded-xl p-3 shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              +12% this week
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Carbon Emission Saved
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {carbonCount.toLocaleString()}
            <span className="text-lg ml-1 text-gray-500 dark:text-gray-400">kg CO₂</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Estimated CO₂ saved through optimized routes
          </p>
          <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(carbonCount / 1500) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800/50 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-2xl p-6 shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 dark:bg-blue-600 rounded-xl p-3 shadow-lg">
              <Droplet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              Optimized
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Fuel Efficiency
          </h3>
          <div className="flex items-baseline space-x-2 mb-1">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics.fuelEfficiency.optimized}
              <span className="text-lg ml-1 text-gray-500 dark:text-gray-400">L/100km</span>
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Baseline: {metrics.fuelEfficiency.baseline} L/100km
          </p>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3">
            Saved {metrics.fuelEfficiency.savedThisWeek} L this week
          </p>
          <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
              style={{ width: `${(metrics.fuelEfficiency.optimized / metrics.fuelEfficiency.baseline) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800/50 backdrop-blur-sm border border-green-200 dark:border-green-700 rounded-2xl p-6 shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-3 shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              ecoScore >= 81 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
              ecoScore >= 51 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
              'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              Level {ecoScore >= 81 ? 'A' : ecoScore >= 51 ? 'B' : 'C'}
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Eco Score
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <ResponsiveContainer width={80} height={80}>
                <PieChart>
                  <Pie
                    data={ecoScoreData}
                    cx={40}
                    cy={40}
                    innerRadius={25}
                    outerRadius={35}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {ecoScoreData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-xl font-bold" style={{ color: getEcoScoreColor(ecoScore) }}>
                  {ecoScore}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Environmental performance rating
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Target: 90</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {ecoScore >= 90 ? '✓' : `${90 - ecoScore} to go`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800/50 backdrop-blur-sm border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 shadow-lg hover:shadow-yellow-200 dark:hover:shadow-yellow-900/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-3 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              Growing
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            EV Readiness
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {metrics.evReadiness}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Routes suitable for electric buses
          </p>
          <div className="w-full bg-yellow-100 dark:bg-yellow-900/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${metrics.evReadiness}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {Math.round((metrics.evReadiness / 100) * 40)} of 40 routes ready
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800/50 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-2xl p-6 shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-3 shadow-lg">
              {forecast.trend === 'down' ? (
                <TrendingDown className="h-6 w-6 text-white" />
              ) : (
                <TrendingUp className="h-6 w-6 text-white" />
              )}
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              forecast.trend === 'down' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              {forecast.trend === 'down' ? '↓' : '↑'} {Math.abs(forecast.changePercentage)}%
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            AI Forecast
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tomorrow's CO₂</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {forecast.predicted}
            <span className="text-lg ml-1 text-gray-500 dark:text-gray-400">kg</span>
          </p>
          <p className={`text-xs font-semibold ${
            forecast.trend === 'down' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {forecast.trend === 'down' ? 'Improving' : 'Needs attention'}
          </p>
        </div>
      </div>

      {visibleAnomalies.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800/50 border border-red-200 dark:border-red-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 animate-pulse" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Anomaly Detector
            </h3>
          </div>
          <div className="space-y-3">
            {visibleAnomalies.map((anomaly) => (
              <div 
                key={anomaly.id}
                className={`flex items-start justify-between p-4 rounded-lg border-l-4 ${
                  anomaly.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  anomaly.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      anomaly.severity === 'high' ? 'bg-red-500 text-white' :
                      anomaly.severity === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {anomaly.severity.toUpperCase()}
                    </span>
                    {anomaly.route && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Route {anomaly.route}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {anomaly.message}
                  </p>
                </div>
                <button
                  onClick={() => dismissAnomaly(anomaly.id)}
                  className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Weather-Aware Insights
              </h3>
            </div>
            <span className="text-3xl">{getWeatherIcon(weatherInsight.condition)}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {weatherInsight.impact}
          </p>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold ${
              weatherInsight.fuelEfficiencyChange < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {weatherInsight.fuelEfficiencyChange > 0 ? '+' : ''}{weatherInsight.fuelEfficiencyChange}% fuel efficiency
            </span>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Passenger Comfort Index
            </h3>
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {comfortIndex.score}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">/ 10</p>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
            Peak time crowd reduced by {comfortIndex.crowdReduction}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500 dark:text-green-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Smart Route Optimizer
              </h3>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'efficiency' | 'co2Saved')}
              className="text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            >
              <option value="co2Saved">Sort by CO₂</option>
              <option value="efficiency">Sort by Efficiency</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-600 dark:text-gray-400">Route</th>
                  <th className="text-center py-2 text-gray-600 dark:text-gray-400">Efficiency</th>
                  <th className="text-center py-2 text-gray-600 dark:text-gray-400">CO₂/day</th>
                  <th className="text-left py-2 text-gray-600 dark:text-gray-400">Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {sortedOptimizations.map((opt) => (
                  <tr key={opt.route} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{opt.route}</td>
                    <td className="text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        opt.efficiency >= 85 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        opt.efficiency >= 75 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {opt.efficiency}%
                      </span>
                    </td>
                    <td className="text-center text-gray-900 dark:text-white font-medium">
                      {opt.co2Saved} kg
                    </td>
                    <td className="text-gray-600 dark:text-gray-400 text-xs">{opt.suggestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Depot Energy & EV Charging
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">⚡ Depot Power Usage</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {depotEnergy.powerUsage} kWh/day
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                  style={{ width: `${(depotEnergy.powerUsage / 300) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">🔋 EV Charging Load</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {depotEnergy.evChargingLoad} kWh/day
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    (depotEnergy.evChargingLoad / depotEnergy.powerUsage) > 0.85 
                      ? 'bg-gradient-to-r from-red-400 to-red-600' 
                      : 'bg-gradient-to-r from-green-400 to-green-600'
                  }`}
                  style={{ width: `${(depotEnergy.evChargingLoad / depotEnergy.powerUsage) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <span className={`text-sm font-semibold ${
                depotEnergy.weeklyChange < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {depotEnergy.weeklyChange < 0 ? '↓' : '↑'} {Math.abs(depotEnergy.weeklyChange)}% this week
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800/50 border border-teal-200 dark:border-teal-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="h-6 w-6 text-teal-500 dark:text-teal-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            City Impact Simulator
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              {cityImpact.depotsAdopting}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Depots Adopting</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {(cityImpact.co2SavedPerMonth / 1000).toFixed(1)} tons
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">CO₂ Saved/Month</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {(cityImpact.fuelSavedPerMonth / 1000).toFixed(1)}K L
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Fuel Saved/Month</p>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="text-2xl">🌿</span>
          <p>If {cityImpact.depotsAdopting} depots adopt this system → {(cityImpact.co2SavedPerMonth / 1000).toFixed(1)} tons CO₂ saved per month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-green-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Emission Reduction Trend
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">(Last 7 Days)</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={emissionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="day" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="co2Saved" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
                name="CO₂ Saved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-blue-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Fuel Optimization by Depot
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fuelOptimization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="depot" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Litres Saved', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="litresSaved" 
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
                name="Litres Saved"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Bus-Level Eco Data
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              ←
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage + 1} of {Math.ceil(busEcoMetrics.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(Math.ceil(busEcoMetrics.length / itemsPerPage) - 1, currentPage + 1))}
              disabled={currentPage >= Math.ceil(busEcoMetrics.length / itemsPerPage) - 1}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Bus No</th>
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Route</th>
                <th className="text-center py-2 text-gray-600 dark:text-gray-400">Fuel Saved (L)</th>
                <th className="text-center py-2 text-gray-600 dark:text-gray-400">CO₂ Saved (kg)</th>
                <th className="text-center py-2 text-gray-600 dark:text-gray-400">Eco Rating</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBusMetrics.map((bus) => (
                <tr key={bus.busNo} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{bus.busNo}</td>
                  <td className="text-gray-600 dark:text-gray-400">{bus.route}</td>
                  <td className="text-center text-gray-900 dark:text-white">{bus.fuelSaved}</td>
                  <td className="text-center text-gray-900 dark:text-white">{bus.co2Saved}</td>
                  <td className="text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      bus.ecoRating.startsWith('A') ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      bus.ecoRating.startsWith('B') ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {bus.ecoRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-800/50 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="h-6 w-6 text-amber-500 dark:text-amber-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Eco Leaderboard
            </h3>
          </div>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div 
                key={entry.depot}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  entry.rank <= 3 
                    ? 'bg-gradient-to-r from-amber-100 to-white dark:from-amber-900/30 dark:to-gray-800' 
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getRankMedal(entry.rank)}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{entry.depot}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Eco Score</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{entry.ecoScore}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ 100</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800/50 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Download className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Report Generator
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Generate a comprehensive sustainability report with all key metrics and AI recommendations.
          </p>
          <button
            onClick={generateReport}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition shadow-lg"
          >
            <Download className="h-5 w-5" />
            <span>Generate Weekly Report</span>
          </button>
          <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center space-x-2 mb-3">
              <Mic className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">AI Voice Query (Beta)</p>
            </div>
            <button className="w-full px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition">
              🎙️ Click to ask AI about sustainability
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Try: "Show today's emission trend" or "Display top eco-efficient route"
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800/50 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-6 w-6 text-purple-500 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            AI Insights – Smart Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => (
            <div
              key={insight.id}
              className={`bg-white dark:bg-gray-800 border-l-4 ${
                insight.type === 'eco' ? 'border-green-500' :
                insight.type === 'efficiency' ? 'border-blue-500' :
                'border-yellow-500'
              } rounded-lg p-4 shadow-md transition-all duration-500 ${
                index === currentInsightIndex ? 'ring-2 ring-purple-400 dark:ring-purple-600 scale-105' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl mt-1">{getInsightIcon(insight.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {insight.message}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                    {insight.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
