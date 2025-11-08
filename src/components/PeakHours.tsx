import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';
import { mockPeakHourData } from '../data/mockData';

export const PeakHours: React.FC = () => {
  const morningData = Object.entries(mockPeakHourData.morning_peak).map(([stop, passengers]) => ({
    stop: stop.length > 15 ? stop.substring(0, 15) + '...' : stop,
    passengers,
    fullName: stop
  }));

  const eveningData = Object.entries(mockPeakHourData.evening_peak).map(([stop, passengers]) => ({
    stop: stop.length > 15 ? stop.substring(0, 15) + '...' : stop,
    passengers,
    fullName: stop
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">{data.fullName}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Passengers: {payload[0].value}/hour
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 mb-6">
        <img 
          src="/src/assets/images.png" 
          alt="BMTC" 
          className="w-7 h-7 rounded-full bg-white p-0.5"
        />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Peak Hour Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Morning Peak Hours */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-orange-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Morning Peak (7:30 - 9:30 AM)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={morningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="stop" 
                stroke="#9CA3AF" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="passengers" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Evening Peak Hours */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Evening Peak (4:30 - 7:30 PM)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eveningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="stop" 
                stroke="#9CA3AF" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="passengers" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Combined Trend Analysis */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Peak Hour Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="stop" 
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31 41 55)', 
                  border: '1px solid rgb(75 85 99)',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="passengers" 
                stroke="#F97316" 
                strokeWidth={3}
                dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                data={morningData}
                name="Morning Peak"
              />
              <Line 
                type="monotone" 
                dataKey="passengers" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                data={eveningData}
                name="Evening Peak"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Hour Insights */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Peak Hour Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg p-4">
            <h4 className="font-medium text-orange-800 dark:text-orange-400 mb-2">Morning Rush</h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Highest traffic at Majestic (600/hr) and Koli Farm Gate (450/hr). 
              Recommend 2 extra buses during 8:00-9:00 AM.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-2">Evening Rush</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Peak at AMC College (380/hr) and Koli Farm Gate (420/hr). 
              Deploy spare buses at 5:00-6:30 PM.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Optimization</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Auto-dispatch algorithm reduces wait time by 35% during peak hours. 
              Current efficiency: 87%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};