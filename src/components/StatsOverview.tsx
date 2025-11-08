import React from 'react';
import { Bus, Users, AlertTriangle, Camera } from 'lucide-react';
import { RouteData } from '../types';

interface StatsOverviewProps {
  routeData: RouteData;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ routeData }) => {
  const totalPassengers = Math.round(routeData.stops.reduce((sum, stop) => 
    sum + stop.inside_buses.reduce((busSum, bus) => busSum + bus.current_onboard, 0), 0));
  
  const totalPeopleDetected = Math.round(routeData.stops.reduce((sum, stop) => sum + stop.people_detected_cctv, 0));
  const incidentCount = routeData.stops.filter(stop => stop.incident_flag).length;

  const stats = [
    {
      title: 'Total Buses',
      value: routeData.total_buses,
      icon: () => (
        <img 
          src="/src/assets/images.png" 
          alt="BMTC" 
          className="w-6 h-6 rounded-full bg-white p-0.5"
        />
      ),
      color: 'text-bmtc-yellow dark:text-bmtc-yellow',
      bgColor: 'bg-bmtc-yellow/10 dark:bg-bmtc-yellow/10',
      borderColor: 'border-bmtc-yellow/20 dark:border-bmtc-yellow/20'
    },
    {
      title: 'Total Passengers',
      value: totalPassengers.toLocaleString(),
      icon: Users,
      color: 'text-bmtc-green dark:text-bmtc-green',
      bgColor: 'bg-bmtc-green/10 dark:bg-bmtc-green/10',
      borderColor: 'border-bmtc-green/20 dark:border-bmtc-green/20'
    },
    {
      title: 'People Detected',
      value: totalPeopleDetected.toLocaleString(),
      icon: Camera,
      color: 'text-bmtc-yellow dark:text-bmtc-yellow',
      bgColor: 'bg-bmtc-yellow/10 dark:bg-bmtc-yellow/10',
      borderColor: 'border-bmtc-yellow/20 dark:border-bmtc-yellow/20'
    },
    {
      title: 'Active Incidents',
      value: incidentCount,
      icon: AlertTriangle,
      color: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-500/10',
      borderColor: 'border-red-200 dark:border-red-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 animate-slide-up">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`bg-white/95 backdrop-blur-xl border border-gold-200 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-gold-lg hover:-translate-y-2 group cursor-pointer`}
          style={{animationDelay: `${stats.indexOf(stat) * 0.1}s`}}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gold-700 mb-2 font-medium">{stat.title}</p>
              <p className={`text-4xl font-bold bg-gold-gradient bg-clip-text text-transparent group-hover:animate-pulse`}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
            </div>
            <div className={`p-4 rounded-2xl bg-gold-gradient shadow-gold transition-all duration-300 group-hover:scale-110`}>
              <stat.icon className={`h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300`} />
            </div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="mt-4 w-full bg-gold-100 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gold-gradient animate-shimmer transition-all duration-1000"
              style={{
                width: `${Math.min((typeof stat.value === 'number' ? stat.value : 50) / 100 * 100, 100)}%`,
                backgroundSize: '200% 100%'
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};