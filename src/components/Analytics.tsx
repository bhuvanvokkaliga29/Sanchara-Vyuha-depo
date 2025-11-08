import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Camera } from 'lucide-react';
import { Stop } from '../types';

interface AnalyticsProps {
  stops: Stop[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ stops }) => {
  // Prepare data for charts
  const passengerData = stops.slice(0, 15).map(stop => ({
    name: `${stop.stop_no}`,
    passengers: Math.round(stop.inside_buses.reduce((sum, bus) => sum + bus.current_onboard, 0)),
    capacity: stop.inside_buses.reduce((sum, bus) => sum + bus.max_capacity, 0)
  }));

  const peopleDetectedData = stops.slice(0, 15).map(stop => ({
    name: stop.stop_name.substring(0, 10) + '...',
    detected: stop.people_detected_cctv
  }));

  const etmData = stops.slice(0, 15).map(stop => ({
    name: `${stop.stop_no}`,
    boarding: stop.etm_data.boarding,
    alighting: stop.etm_data.alighting
  }));

  const congestionData = [
    { name: 'Low', value: stops.filter(s => s.congestion_level === 'low').length },
    { name: 'Medium', value: stops.filter(s => s.congestion_level === 'medium').length },
    { name: 'High', value: stops.filter(s => s.congestion_level === 'high').length }
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{`Stop ${label}`}</p>
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

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="h-6 w-6 text-blue-500 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Passenger Load Chart */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Passenger Load by Stop</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={passengerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="passengers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* People Detected via CCTV Chart */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Camera className="h-5 w-5 text-green-500 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">People Detected via CCTV</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={peopleDetectedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31 41 55)', 
                  border: '1px solid rgb(75 85 99)',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line type="monotone" dataKey="detected" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ETM Data Chart */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Boarding vs Alighting</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={etmData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="boarding" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="alighting" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Congestion Level Distribution */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChartIcon className="h-5 w-5 text-orange-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Congestion Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={congestionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {congestionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31 41 55)', 
                  border: '1px solid rgb(75 85 99)',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* YOLO AI Integration Demo */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <img 
            src="/src/assets/images.png" 
            alt="BMTC" 
            className="w-6 h-6 rounded-full bg-white p-0.5"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">YOLO AI Crowd Detection Feed (Demo)</h3>
        </div>
        <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-6 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-bmtc-yellow/20 rounded-full mb-4">
              <img 
                src="/src/assets/images.png" 
                alt="BMTC AI" 
                className="w-10 h-10 rounded-full bg-white p-1"
              />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Crowd Detection</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Real-time CCTV analysis using YOLO computer vision model for accurate passenger counting and crowd density estimation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">94.7%</div>
              <div className="text-gray-600 dark:text-gray-400">Detection Accuracy</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.3s</div>
              <div className="text-gray-600 dark:text-gray-400">Processing Time</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">42</div>
              <div className="text-gray-600 dark:text-gray-400">Active Cameras</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            * CCTV feeds will be connected to YOLO crowd counting system for live passenger detection
          </p>
        </div>
      </div>
    </div>
  );
};