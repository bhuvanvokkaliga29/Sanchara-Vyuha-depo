import { useState, useMemo, useEffect, useRef } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FilterControls } from './components/FilterControls';
import { StopCard } from './components/StopCard';
import { RouteMap } from './components/RouteMap';
import { Analytics } from './components/Analytics';
import { BusMonitoring } from './components/BusMonitoring';
import { IntegrationPanel } from './components/IntegrationPanel';
import { PeakHours } from './components/PeakHours';
import { SettingsModal } from './components/SettingsModal';
import { SustainabilityDashboard } from './components/SustainabilityDashboard';
import { 
  mockRouteData, 
  mockNotifications, 
  mockSustainabilityMetrics,
  mockEmissionTrendData,
  mockFuelOptimizationData,
  mockAIInsights,
  mockForecastMetric,
  mockRouteOptimizations,
  mockDepotEnergy,
  mockAnomalyAlerts,
  mockCityImpact,
  mockBusEcoMetrics,
  mockWeatherInsight,
  mockComfortIndex,
  mockLeaderboard
} from './data/mockData';
import { Stop, Notification, SustainabilityMetrics } from './types';
import { BusSimulationService } from './services/busSimulation';

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [congestionFilter, setCongestionFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [incidentFilter, setIncidentFilter] = useState(false);
  const [sortBy, setSortBy] = useState('stop_no');
  const [activeTab, setActiveTab] = useState('overview');
  const [routeData, setRouteData] = useState(mockRouteData);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<SustainabilityMetrics>(mockSustainabilityMetrics);
  const simulationService = useRef<BusSimulationService | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    simulationService.current = new BusSimulationService(routeData.stops);

    simulationService.current.setUpdateCallback((updatedStops) => {
      setRouteData(prevData => ({
        ...prevData,
        stops: updatedStops,
        total_buses: updatedStops.reduce((sum, stop) => sum + stop.inside_buses.length, 0)
      }));
    });

    simulationService.current.startSimulation();

    return () => {
      if (simulationService.current) {
        simulationService.current.stopSimulation();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRouteData(prevData => ({
        ...prevData,
        stops: prevData.stops.map(stop => ({
          ...stop,
          people_detected_cctv: Math.max(15, Math.min(200,
            stop.people_detected_cctv + Math.floor((Math.random() - 0.5) * 10)
          )),
          waiting_passengers: Math.max(10, Math.min(250,
            stop.waiting_passengers + Math.floor((Math.random() - 0.5) * 10)
          )),
          inside_buses: stop.inside_buses.map(bus => ({
            ...bus,
            current_onboard: Math.max(0, Math.min(
              bus.max_capacity,
              Math.round(bus.current_onboard + (Math.random() - 0.5) * 3)
            ))
          }))
        }))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSustainabilityMetrics(prev => ({
        ...prev,
        carbonSaved: prev.carbonSaved + Math.floor(Math.random() * 5),
        fuelEfficiency: {
          ...prev.fuelEfficiency,
          savedThisWeek: prev.fuelEfficiency.savedThisWeek + Math.floor(Math.random() * 2)
        },
        ecoScore: Math.min(100, Math.max(0, prev.ecoScore + (Math.random() > 0.5 ? 1 : -1))),
        evReadiness: Math.min(100, Math.max(0, prev.evReadiness + (Math.random() > 0.7 ? 1 : 0)))
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleDispatchBus = (stopNo: number, stopName: string) => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    const newBusId = `365J-S${Math.floor(Math.random() * 90) + 10}`;

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'dispatch',
      title: 'Spare Bus Dispatched',
      message: `Spare bus ${newBusId} dispatched to ${stopName} at ${currentTime}`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'low'
    };

    setNotifications(prev => [newNotification, ...prev]);

    setRouteData(prevData => {
      const firstStop = prevData.stops[0];
      const targetStop = prevData.stops.find(s => s.stop_no === stopNo);

      if (!firstStop || !targetStop) return prevData;

      const newBus = {
        bus_id: newBusId,
        driver: 'Spare Driver',
        vehicle_no: `KA-01-SP-${Math.floor(Math.random() * 9999)}`,
        current_onboard: 0,
        max_capacity: 60,
        status: 'dispatched' as const,
        current_stop: 1,
        destination_stop: stopNo,
        dispatch_time: currentTime
      };

      return {
        ...prevData,
        total_buses: prevData.total_buses + 1,
        stops: prevData.stops.map(stop => {
          if (stop.stop_no === 1) {
            return {
              ...stop,
              inside_buses: [...stop.inside_buses, newBus]
            };
          }
          if (stop.stop_no === stopNo) {
            return {
              ...stop,
              lastDispatchTime: Date.now()
            };
          }
          return stop;
        })
      };
    });

    if (simulationService.current) {
      simulationService.current.markBusAsDispatched(newBusId, stopNo);
    }
  };

  const filteredAndSortedStops = useMemo(() => {
    let filtered = routeData.stops.filter((stop: Stop) => {
      const matchesSearch = searchTerm === '' ||
        stop.stop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stop.inside_buses.some(bus => bus.bus_id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCongestion = congestionFilter === '' || stop.congestion_level === congestionFilter;
      const matchesAction = actionFilter === '' || stop.recommended_action.toLowerCase().includes(actionFilter.toLowerCase());
      const matchesIncident = !incidentFilter || stop.incident_flag;

      return matchesSearch && matchesCongestion && matchesAction && matchesIncident;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'congestion':
          const congestionOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return congestionOrder[b.congestion_level] - congestionOrder[a.congestion_level];
        case 'passengers':
          const aPassengers = a.inside_buses.reduce((sum, bus) => sum + bus.current_onboard, 0);
          const bPassengers = b.inside_buses.reduce((sum, bus) => sum + bus.current_onboard, 0);
          return bPassengers - aPassengers;
        case 'people_detected':
          return b.people_detected_cctv - a.people_detected_cctv;
        default:
          return a.stop_no - b.stop_no;
      }
    });

    return filtered;
  }, [routeData.stops, searchTerm, congestionFilter, actionFilter, incidentFilter, sortBy]);

  const tabs = [
    { id: 'overview', label: 'Stop Overview', count: filteredAndSortedStops.length },
    { id: 'monitoring', label: 'Bus Monitoring', count: routeData.total_buses },
    { id: 'sustainability', label: '🌱 Sustainability', count: null },
    { id: 'map', label: 'Route Map', count: null },
    { id: 'analytics', label: 'Analytics', count: null },
    { id: 'peak-hours', label: 'Peak Hours', count: null },
    { id: 'integration', label: 'Integrations', count: null }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-gold-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-300 dark:bg-gray-700 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gold-400 dark:bg-gray-600 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-gold-200 dark:bg-gray-700 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-gold-300 dark:bg-gray-600 rounded-full"></div>
      </div>

      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSettingsClick={() => setShowSettings(true)}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <main className="container mx-auto px-6 py-8">
        <StatsOverview routeData={routeData} />

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gold-200 dark:border-gray-700 rounded-2xl p-6 mb-8 shadow-gold dark:shadow-gray-900 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gold-gradient text-white shadow-gold transform scale-105 animate-pulse-gold'
                    : 'bg-cream-100 dark:bg-gray-700 text-gold-800 dark:text-gray-200 hover:bg-gold-100 dark:hover:bg-gray-600 hover:text-gold-900 dark:hover:text-white hover:scale-105 hover:shadow-gold transition-all duration-300'
                } transform hover:rotate-1`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <FilterControls
              congestionFilter={congestionFilter}
              actionFilter={actionFilter}
              incidentFilter={incidentFilter}
              sortBy={sortBy}
              onCongestionFilterChange={setCongestionFilter}
              onActionFilterChange={setActionFilter}
              onIncidentFilterChange={setIncidentFilter}
              onSortChange={setSortBy}
            />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              {filteredAndSortedStops.map((stop) => (
                <div key={stop.stop_no} className="animate-fade-in-up" style={{animationDelay: `${0.05 * stop.stop_no}s`}}>
                  <StopCard
                  key={stop.stop_no}
                  stop={stop}
                  onDispatchBus={handleDispatchBus}
                />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'monitoring' && <div className="animate-fade-in-up"><BusMonitoring stops={routeData.stops} /></div>}
        {activeTab === 'sustainability' && (
          <div className="animate-fade-in-up">
            <SustainabilityDashboard 
              metrics={sustainabilityMetrics}
              emissionTrend={mockEmissionTrendData}
              fuelOptimization={mockFuelOptimizationData}
              insights={mockAIInsights}
              forecast={mockForecastMetric}
              routeOptimizations={mockRouteOptimizations}
              depotEnergy={mockDepotEnergy}
              anomalies={mockAnomalyAlerts}
              cityImpact={mockCityImpact}
              busEcoMetrics={mockBusEcoMetrics}
              weatherInsight={mockWeatherInsight}
              comfortIndex={mockComfortIndex}
              leaderboard={mockLeaderboard}
            />
          </div>
        )}
        {activeTab === 'map' && <div className="animate-fade-in-up"><RouteMap stops={routeData.stops} /></div>}
        {activeTab === 'analytics' && <div className="animate-fade-in-up"><Analytics stops={routeData.stops} /></div>}
        {activeTab === 'peak-hours' && <div className="animate-fade-in-up"><PeakHours /></div>}
        {activeTab === 'integration' && <div className="animate-fade-in-up"><IntegrationPanel /></div>}
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
