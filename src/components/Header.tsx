import React, { useState, useRef, useEffect } from 'react';
import { Bus, Settings, Bell, Search, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { mockNotifications } from '../data/mockData';
import { Notification } from '../types';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSettingsClick: () => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, onSettingsClick, notifications, setNotifications }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return '⏰';
      case 'crowd': return '👥';
      case 'cctv': return '📹';
      case 'dispatch': return '🚌';
      case 'maintenance': return '🔧';
      default: return '📢';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gold-200 dark:border-gray-700 px-6 py-6 shadow-gold dark:shadow-gray-900 animate-slide-down">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 animate-slide-right">
            <img 
              src="/src/assets/images.png" 
              alt="BMTC Logo" 
              className="w-16 h-16 rounded-full bg-white p-2 shadow-gold hover:scale-110 cursor-pointer transition-all duration-300"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gold-gradient bg-clip-text text-transparent animate-shimmer">
                BMTC Route 365J
              </h1>
              <p className="text-sm text-gold-700 font-medium">Depot 3 - Majestic to Jigani APC Circle</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 animate-slide-left">
          <div className="relative animate-scale-in" style={{animationDelay: '0.2s'}}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stops or buses..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-cream-50 border border-gold-200 rounded-xl pl-10 pr-4 py-3 text-gold-900 placeholder-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 w-72 transition-all duration-300 hover:shadow-gold"
            />
          </div>

          <button
            onClick={toggleTheme}
            className="p-3 text-gold-600 hover:text-gold-800 transition-all duration-300 rounded-xl hover:bg-gold-100 hover:shadow-gold"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="relative animate-scale-in" style={{animationDelay: '0.4s'}} ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-gold-600 hover:text-gold-800 transition-all duration-300 rounded-xl hover:bg-gold-100 hover:shadow-gold"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-gradient text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-gold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white/98 backdrop-blur-xl border border-gold-200 rounded-xl shadow-2xl z-[99999] max-h-96 overflow-y-auto">
                <div className="p-6 border-b border-gold-200">
                  <h3 className="text-lg font-semibold text-gold-900">Notifications</h3>
                  <p className="text-sm text-gold-700">{unreadCount} unread</p>
                </div>
                
                <div className="divide-y divide-gold-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gold-600">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gold-50 transition-all duration-200 border-l-4 ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'bg-gold-100/50' : ''
                        } cursor-pointer`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <span className="text-lg">{getTypeIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gold-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gold-700 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gold-600 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification.id);
                            }}
                            className="ml-2 p-1 text-gold-400 hover:text-gold-600 transition-all duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={onSettingsClick}
            className="p-3 text-gold-600 hover:text-gold-800 transition-all duration-300 rounded-xl hover:bg-gold-100 hover:shadow-gold"
            style={{animationDelay: '0.6s'}}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};