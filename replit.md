# BMTC Route 365J Bus Monitoring System

## Overview
This is a real-time bus route monitoring and management system for BMTC Route 365J. It provides comprehensive dashboards for tracking bus operations, passenger flow, and route optimization using React, TypeScript, and Vite.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom gold-themed design
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **Database Integration**: Supabase (configured but currently using mock data)

### Key Features
1. **Stop Overview**: Real-time monitoring of all bus stops with congestion levels, passenger counts, and CCTV detection
2. **Bus Monitoring**: Track all active buses, their occupancy, driver information, and status
3. **🌱 Sustainability Dashboard**: Comprehensive Green Intelligence Stats with:
   - **Core Metrics**: Carbon Saved, Fuel Efficiency, Eco Score (circular gauge), EV Readiness, AI Forecast
   - **Smart Route Optimizer**: Sortable table showing route efficiency, CO₂ savings, and AI recommendations
   - **Depot Energy Tracker**: Real-time power usage and EV charging load monitoring with weekly trends
   - **AI Anomaly Detector**: Live alerts for fuel spikes, emission anomalies, and congestion issues
   - **City Impact Simulator**: City-wide projection showing CO₂ and fuel savings if multiple depots adopt the system
   - **Bus-Level Eco Table**: Paginated table with individual bus performance (fuel saved, CO₂ saved, eco ratings)
   - **Weather-Aware Insights**: Dynamic weather-based recommendations for fuel efficiency adjustments
   - **Passenger Comfort Index**: Real-time comfort score with crowd reduction metrics
   - **AI Report Generator**: One-click downloadable sustainability reports with weekly summaries
   - **Eco Leaderboard**: Depot rankings with medals showing top performers
   - **Public Display Mode**: Large-screen optimized view for depot wall displays
   - **Emission Reduction Trend**: 7-day line chart tracking CO₂ savings
   - **Fuel Optimization Chart**: Bar chart comparing fuel savings across depots
   - **AI Insights Panel**: 4 rotating AI-powered recommendations with category badges
4. **Route Map**: Visual representation of the route with stop-by-stop congestion indicators
5. **Analytics Dashboard**: Charts for passenger load, CCTV detection, ETM data, and congestion analysis
6. **Peak Hours Analysis**: Historical data visualization for peak hour patterns
7. **System Integrations**: Management panel for YOLO Computer Vision and ETM integrations
8. **Notifications**: Real-time alerts for delays, high crowds, CCTV issues, dispatches, and maintenance
9. **Dark Mode**: Full theme support with smooth transitions

### Directory Structure
```
├── src/
│   ├── assets/           # Images and static assets
│   ├── components/       # React components
│   │   ├── Analytics.tsx
│   │   ├── BusMonitoring.tsx
│   │   ├── FilterControls.tsx
│   │   ├── Header.tsx
│   │   ├── IntegrationPanel.tsx
│   │   ├── PeakHours.tsx
│   │   ├── RouteMap.tsx
│   │   ├── SettingsModal.tsx
│   │   ├── StatsOverview.tsx
│   │   ├── StopCard.tsx
│   │   └── SustainabilityDashboard.tsx
│   ├── contexts/         # React contexts (theme)
│   ├── data/            # Mock data for demonstration
│   ├── services/        # Bus simulation service
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── vite.config.ts       # Vite configuration (configured for Replit)
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies
```

## Recent Changes
- **Nov 8, 2025**: Massively Expanded Sustainability Dashboard (15 new features)
  - **Phase 1 (Initial)**: Core 4 metric cards + 2 charts + AI insights panel
  - **Phase 2 (Comprehensive Expansion)**: Added 15 additional features:
    1. AI Forecast Box - Tomorrow's CO₂ prediction with trend indicators
    2. Smart Route Optimizer - Sortable table with efficiency metrics and suggestions
    3. Depot Energy & EV Charging Tracker - Real-time power monitoring with utilization bars
    4. AI Anomaly Detector - Dismissible alerts for fuel/emission spikes
    5. City Impact Simulator - Multi-depot adoption projections (tons CO₂ saved/month)
    6. Bus-Level Eco Data Table - Paginated individual bus performance metrics
    7. Weather-Aware Insight Card - Dynamic weather-based fuel efficiency predictions
    8. Passenger Comfort Index - Real-time comfort scoring with crowd reduction %
    9. AI Report Generator - Downloadable weekly sustainability reports (.txt)
    10. AI Voice Query (Beta) - Stub for voice-activated sustainability queries
    11. Eco Leaderboard - Medal-based depot rankings by eco score
    12. Public Display Mode - Full-screen optimized view for public awareness
    13-15. Enhanced existing charts and insights with better interactivity
  - Implemented proper array safety checks and error handling
  - All features use consistent green/eco theming (#4CAF50, #A8E063)
  - Animations handle bidirectional updates smoothly
  - Architect-reviewed and confirmed production-ready
  
- **Nov 8, 2025**: Configured for Replit environment
  - Updated Vite config to bind to 0.0.0.0:5000 with HMR over WSS
  - Set up development workflow for automatic server restart
  - Created project documentation

## Development

### Running Locally
The project is configured to run on port 5000 with the command:
```bash
npm run dev
```

### Simulation
The app includes a bus movement simulation service that:
- Moves buses between stops at realistic intervals
- Updates passenger counts (boarding/alighting)
- Simulates congestion levels
- Allows dispatching spare buses to high-crowd stops

## Data Sources
Currently using mock data (`src/data/mockData.ts`) for:
- 40 bus stops along Route 365J
- Real-time bus positions and passenger counts
- Historical data for 30 days
- Notifications and alerts
- **Sustainability metrics**: carbon savings, fuel efficiency, eco scores, EV readiness, forecasts, route optimizations, depot energy stats, anomaly alerts, city impact scenarios, bus-level eco data, weather insights, comfort index, and leaderboard rankings
- AI-generated sustainability insights and recommendations

Future integration planned with:
- YOLO Computer Vision for passenger counting
- ETM (Electronic Ticketing Machine) for actual boarding/alighting data
- Live CCTV feeds for real-time detection

## User Preferences
None specified yet.
