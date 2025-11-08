import React from 'react';
import { Filter, SortAsc } from 'lucide-react';

interface FilterControlsProps {
  congestionFilter: string;
  actionFilter: string;
  incidentFilter: boolean;
  sortBy: string;
  onCongestionFilterChange: (filter: string) => void;
  onActionFilterChange: (filter: string) => void;
  onIncidentFilterChange: (filter: boolean) => void;
  onSortChange: (sort: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  congestionFilter,
  actionFilter,
  incidentFilter,
  sortBy,
  onCongestionFilterChange,
  onActionFilterChange,
  onIncidentFilterChange,
  onSortChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        <h3 className="text-gray-900 dark:text-white font-semibold">Filters & Sorting</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Congestion Level</label>
          <select
            value={congestionFilter}
            onChange={(e) => onCongestionFilterChange(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <option value="">All Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Recommended Action</label>
          <select
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <option value="">All Actions</option>
            <option value="Wait">Wait</option>
            <option value="Dispatch">Dispatch Spare</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <option value="stop_no">Stop Number</option>
            <option value="congestion">Congestion Level</option>
            <option value="passengers">Passenger Count</option>
            <option value="people_detected">People Detected</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={incidentFilter}
              onChange={(e) => onIncidentFilterChange(e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-300"
            />
            <span className="text-gray-700 dark:text-gray-300 text-sm">Incidents Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};