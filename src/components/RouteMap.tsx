import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Stop } from '../types';

interface RouteMapProps {
  stops: Stop[];
}

export const RouteMap: React.FC<RouteMapProps> = ({ stops }) => {
  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getCongestionRingColor = (level: string) => {
    switch (level) {
      case 'high': return 'ring-red-500/30';
      case 'medium': return 'ring-yellow-500/30';
      default: return 'ring-green-500/30';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <img 
            src="/src/assets/images.png" 
            alt="BMTC" 
            className="w-7 h-7 rounded-full bg-white p-0.5"
          />
          <span>Route Map - 365J</span>
        </h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Low Congestion</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">High</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 h-96 overflow-y-auto">
        <div className="space-y-4">
          {stops.map((stop, index) => (
            <div key={stop.stop_no} className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${getCongestionColor(stop.congestion_level)} ring-4 ring-gray-100 dark:ring-gray-800 ${getCongestionRingColor(stop.congestion_level)} animate-pulse`}></div>
                {index < stops.length - 1 && (
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mt-2"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium truncate">{stop.stop_name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Stop {stop.stop_no} • {stop.gps_coordinates}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{stop.inside_buses.length} buses</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-white font-medium">{Math.round(stop.people_detected_cctv)} people</div>
                      <div className="text-xs">{stop.congestion_percentage}% congestion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};