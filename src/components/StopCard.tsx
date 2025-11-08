import React, { useState } from 'react';
import { MapPin, Camera, Clock, Users, AlertCircle, Bus, Send } from 'lucide-react';
import { Stop } from '../types';

interface StopCardProps {
  stop: Stop;
  onDispatchBus: (stopNo: number, stopName: string) => void;
}

export const StopCard: React.FC<StopCardProps> = ({ stop, onDispatchBus }) => {
  const [isDispatching, setIsDispatching] = useState(false);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      case 'medium': return 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20';
      default: return 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('Dispatch')) return 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20';
    return 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
  };

  const highCrowdThreshold = 70;
  const cooldownPeriod = 300000;

  const shouldShowDispatchButton =
    stop.people_detected_cctv > highCrowdThreshold &&
    (!stop.lastDispatchTime || (Date.now() - stop.lastDispatchTime) > cooldownPeriod);

  const handleDispatch = async () => {
    if (isDispatching || !shouldShowDispatchButton) return;

    setIsDispatching(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onDispatchBus(stop.stop_no, stop.stop_name);

    setTimeout(() => {
      setIsDispatching(false);
    }, 1000);
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gold-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-gold-lg hover:-translate-y-1 group cursor-pointer max-w-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gold-gradient rounded-xl shadow-gold transition-all duration-300">
            <span className="text-white font-bold text-sm">{stop.stop_no}</span>
          </div>
          <div>
            <h3 className="text-gold-900 dark:text-gray-100 font-bold text-lg group-hover:text-gold-700 dark:group-hover:text-gray-200 transition-colors duration-300">{stop.stop_name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="h-3 w-3 text-gold-600 dark:text-gold-400" />
              <span className="text-gold-700 dark:text-gray-400 text-sm font-medium">
                {stop.gps_coordinates}
              </span>
            </div>
          </div>
        </div>
        {stop.incident_flag && (
          <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="flex items-center space-x-2">
          <Camera className="h-4 w-4 text-gold-600" />
          <span className="text-gold-800 dark:text-gray-300 font-medium">{stop.people_detected_cctv} detected</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gold-600" />
          <span className="text-gold-800 dark:text-gray-300 font-medium">{stop.arrival_rate}/hr</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gold-600" />
          <span className="text-gold-800 dark:text-gray-300 font-medium">{stop.bus_seats_available} seats</span>
        </div>
        <div className="flex items-center space-x-2">
          <Bus className="h-4 w-4 text-gold-600" />
          <span className="text-gold-800 dark:text-gray-300 font-medium">{stop.inside_buses.length} buses</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCongestionColor(stop.congestion_level)}`}>
          {stop.congestion_level.toUpperCase()} CONGESTION ({stop.congestion_percentage}%)
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getActionColor(stop.recommended_action)}`}>
          {stop.recommended_action.toUpperCase()}
        </span>
      </div>

      {shouldShowDispatchButton && (
        <div className="mb-4">
          <button
            onClick={handleDispatch}
            disabled={isDispatching}
            className="w-full bg-gold-gradient hover:shadow-gold-lg disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
          >
            <Send className={`h-4 w-4 ${isDispatching ? 'animate-spin' : ''}`} />
            <span>{isDispatching ? 'Dispatching...' : 'Dispatch Spare Bus'}</span>
          </button>
        </div>
      )}

      <div className="bg-cream-50 dark:bg-gray-900/50 rounded-xl p-3 mb-4 border border-gold-100 dark:border-gray-700">
        <h4 className="text-gold-900 dark:text-gray-200 font-bold mb-2 text-sm">ETM Data</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-green-600 text-lg font-bold">↗ {stop.etm_data.boarding}</span>
            <p className="text-gold-700 dark:text-gray-400 text-xs font-medium">Boarding</p>
          </div>
          <div>
            <span className="text-red-600 text-lg font-bold">↘ {stop.etm_data.alighting}</span>
            <p className="text-gold-700 dark:text-gray-400 text-xs font-medium">Alighting</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-gold-900 dark:text-gray-200 font-bold mb-2 text-sm">Active Buses</h4>
        <div className="space-y-2">
          {stop.inside_buses.map((bus) => (
            <div key={bus.bus_id} className="bg-cream-50 dark:bg-gray-900/50 rounded-lg p-2 border border-gold-100 dark:border-gray-700 hover:shadow-gold transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    bus.status === 'spare_needed' ? 'bg-red-500' : 
                    bus.status === 'maintenance' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="text-gold-900 dark:text-gray-200 font-bold text-xs">{bus.bus_id}</p>
                    <p className="text-gold-700 dark:text-gray-400 text-xs font-medium">{bus.driver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gold-900 dark:text-gray-200 font-bold text-xs">{bus.vehicle_no}</p>
                  <p className="text-gold-700 dark:text-gray-400 text-xs font-medium">
                    {Math.round(bus.current_onboard)}/{bus.max_capacity} passengers
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gold-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gold-700 dark:text-gray-400 text-xs font-medium">Next Bus ETA</span>
          <span className="text-gold-600 dark:text-gray-300 font-bold text-sm">{stop.next_bus_eta}</span>
        </div>
      </div>
    </div>
  );
};