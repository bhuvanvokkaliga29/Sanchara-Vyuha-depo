import React, { useState } from 'react';
import { Settings, Camera, Database, Wifi, WifiOff } from 'lucide-react';

export const IntegrationPanel: React.FC = () => {
  const [yoloEnabled, setYoloEnabled] = useState(false);
  const [etmEnabled, setEtmEnabled] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <img 
          src="/src/assets/images.png" 
          alt="BMTC" 
          className="w-7 h-7 rounded-full bg-white p-0.5"
        />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Integrations</h2>
      </div>

      <div className="space-y-6">
        {/* YOLO Model Integration */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Camera className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold">YOLO Computer Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Real-time passenger counting & behavior analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {yoloEnabled ? (
                <Wifi className="h-5 w-5 text-green-500 dark:text-green-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500 dark:text-red-400" />
              )}
              <button
                onClick={() => setYoloEnabled(!yoloEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  yoloEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    yoloEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Endpoint:</span>
              <p className="text-gray-900 dark:text-white font-mono text-xs">http://localhost:8000/api/yolo</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
              <p className="text-gray-900 dark:text-white">70%</p>
            </div>
          </div>

          {yoloEnabled && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                ✓ YOLO model connected - Real-time passenger detection active
              </p>
            </div>
          )}
        </div>

        {/* ETM Integration */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-green-500 dark:text-green-400" />
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold">ETM System Integration</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Electronic Ticketing Machine data sync</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {etmEnabled ? (
                <Wifi className="h-5 w-5 text-green-500 dark:text-green-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500 dark:text-red-400" />
              )}
              <button
                onClick={() => setEtmEnabled(!etmEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  etmEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    etmEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Endpoint:</span>
              <p className="text-gray-900 dark:text-white font-mono text-xs">http://localhost:8000/api/etm</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Sync Interval:</span>
              <p className="text-gray-900 dark:text-white">30 seconds</p>
            </div>
          </div>

          {etmEnabled && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm">
                ✓ ETM system connected - Real-time boarding/alighting data syncing
              </p>
            </div>
          )}
        </div>

        {/* Backend Configuration */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Backend Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">API Base URL:</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">http://localhost:8000/api</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">WebSocket:</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">ws://localhost:8000/ws</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Update Frequency:</span>
              <span className="text-gray-900 dark:text-white">Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};