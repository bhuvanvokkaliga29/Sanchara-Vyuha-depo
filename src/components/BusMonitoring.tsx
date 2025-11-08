import React from 'react';
import { Bus, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { Stop } from '../types';

interface BusMonitoringProps {
  stops: Stop[];
}

export const BusMonitoring: React.FC<BusMonitoringProps> = ({ stops }) => {
  const allBuses = stops.flatMap(stop => 
    stop.inside_buses.map(bus => ({
      ...bus,
      stop_name: stop.stop_name,
      stop_no: stop.stop_no
    }))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'spare_needed': return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      case 'maintenance': return 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20';
      case 'dispatched': return 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      default: return 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'spare_needed': return AlertTriangle;
      case 'maintenance': return AlertTriangle;
      case 'dispatched': return Bus;
      default: return CheckCircle;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <img 
          src="/src/assets/images.png" 
          alt="BMTC" 
          className="w-7 h-7 rounded-full bg-white p-0.5"
        />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bus Monitoring</h2>
        <span className="ml-auto text-gray-600 dark:text-gray-400 text-sm">{allBuses.length} Active Buses</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {allBuses.map((bus) => {
          const StatusIcon = getStatusIcon(bus.status);
          const occupancyPercentage = (Math.round(bus.current_onboard) / bus.max_capacity) * 100;
          
          return (
            <div key={`${bus.bus_id}-${bus.stop_no}`} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-semibold">{bus.bus_id}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{bus.vehicle_no}</p>
                </div>
                <div className={`p-1 rounded-full ${getStatusColor(bus.status)}`}>
                  <StatusIcon className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{bus.driver}</span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Occupancy</span>
                    <span className="text-gray-900 dark:text-white">{Math.round(bus.current_onboard)}/{bus.max_capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        occupancyPercentage > 80 ? 'bg-red-500' : 
                        occupancyPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-xs">Current Location</p>
                  <p className="text-gray-900 dark:text-white text-sm font-medium">
                    {bus.current_stop ? `Stop ${bus.current_stop}` : bus.stop_name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {bus.destination_stop ? `→ Destination: Stop ${bus.destination_stop}` : `Stop ${bus.stop_no}`}
                  </p>
                </div>

                <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(bus.status)}`}>
                  {bus.status.replace('_', ' ').toUpperCase()}
                  {bus.dispatch_time && (
                    <span className="block text-xs opacity-75">
                      Dispatched: {bus.dispatch_time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};