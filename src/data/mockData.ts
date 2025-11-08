import { RouteData, Notification, PeakHourData, HistoricalData, SustainabilityMetrics, EmissionTrendData, FuelOptimizationData, AIInsight, ForecastMetric, RouteOptimization, DepotEnergyStatus, AnomalyAlert, CityImpactScenario, BusEcoMetrics, WeatherInsight, ComfortIndex, LeaderboardEntry } from '../types';

// Generate realistic historical data for 30 days
const generateHistoricalData = (): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date();
  
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    for (let hour = 5; hour < 24; hour++) {
      for (let stopNo = 1; stopNo <= 40; stopNo++) {
        let basePassengers = 50;
        let congestionBase = 40;
        
        // Peak hour adjustments
        if (hour >= 7 && hour <= 10) { // Morning peak
          basePassengers *= 2.5;
          congestionBase += 30;
        } else if (hour >= 17 && hour <= 20) { // Evening peak
          basePassengers *= 2.2;
          congestionBase += 25;
        } else if (hour >= 13 && hour <= 15) { // Afternoon moderate
          basePassengers *= 1.3;
          congestionBase += 10;
        }
        
        // Weekend reduction
        if (isWeekend) {
          basePassengers *= 0.6;
          congestionBase -= 15;
        }
        
        // Stop-specific multipliers
        const stopMultipliers: { [key: number]: number } = {
          1: 3.0,   // Majestic
          7: 2.2,   // Shanthinagar
          11: 1.8,  // Nimhans
          16: 2.0,  // JP Nagar 3rd Phase
          26: 1.9,  // Gottigere
          29: 2.1,  // Koli Farm Gate
          30: 2.3,  // AMC College
          33: 2.0,  // Bannerghatta Circle
          40: 1.7   // Jigani APC Circle
        };
        
        const multiplier = stopMultipliers[stopNo] || 1.0;
        const passengers = Math.round(basePassengers * multiplier * (0.8 + Math.random() * 0.4));
        const boarded = Math.round(passengers * (0.6 + Math.random() * 0.3));
        const alighted = Math.round(passengers * (0.3 + Math.random() * 0.3));
        const waiting = Math.round(passengers * (0.4 + Math.random() * 0.6));
        
        data.push({
          date: date.toISOString().split('T')[0],
          hour,
          stop_no: stopNo,
          boarded,
          deboarded: alighted,
          waiting,
          total_in_bus: Math.min(passengers, 60),
          congestion_percentage: Math.min(Math.round(congestionBase + Math.random() * 20), 95)
        });
      }
    }
  }
  
  return data;
};

export const historicalData = generateHistoricalData();

export const mockRouteData: RouteData = {
  route: "365J",
  depot: "Depot 3 - Majestic",
  total_buses: 45,
  active_buses: 42,
  spare_buses_needed: 8,
  stops: [
    {
      stop_no: 1,
      stop_name: "Kempegowda Bus Station (Majestic)",
      gps_coordinates: "12.976, 77.572",
      people_detected_cctv: Math.floor(Math.random() * 30) + 50,
      arrival_rate: 20,
      next_bus_eta: "10:05",
      bus_seats_available: 40,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "high",
      congestion_percentage: 85,
      coordinates: { lat: 12.976, lng: 77.572 },
      etm_data: { boarding: 25, alighting: 8 },
      incident_flag: false,
      waiting_passengers: Math.floor(Math.random() * 20) + 30,
      inside_buses: [
        {
          bus_id: "365J-01",
          driver: "Ramesh Kumar",
          vehicle_no: "KA-01-HF-1234",
          current_onboard: Math.floor(Math.random() * 10) + 15,
          max_capacity: 60,
          status: "active",
          current_stop: 1
        },
        {
          bus_id: "365J-02",
          driver: "Suresh Babu",
          vehicle_no: "KA-01-HF-1235",
          current_onboard: Math.floor(Math.random() * 10) + 12,
          max_capacity: 60,
          status: "active",
          current_stop: 1
        }
      ]
    },
    {
      stop_no: 2,
      stop_name: "Maharani College",
      gps_coordinates: "12.972, 77.595",
      people_detected_cctv: Math.floor(Math.random() * 15) + 30,
      arrival_rate: 5,
      next_bus_eta: "10:15",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 35,
      coordinates: { lat: 12.972, lng: 77.595 },
      etm_data: { boarding: 8, alighting: 5 },
      incident_flag: false,
      waiting_passengers: Math.floor(Math.random() * 15) + 20,
      inside_buses: [
        {
          bus_id: "365J-03",
          driver: "Anil Reddy",
          vehicle_no: "KA-01-HF-1236",
          current_onboard: Math.floor(Math.random() * 8) + 10,
          max_capacity: 60,
          status: "active",
          current_stop: 2
        }
      ]
    },
    {
      stop_no: 3,
      stop_name: "K.R.Circle",
      gps_coordinates: "12.970, 77.597",
      people_detected_cctv: 65,
      arrival_rate: 3,
      next_bus_eta: "10:20",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 40,
      coordinates: { lat: 12.970, lng: 77.597 },
      etm_data: { boarding: 6, alighting: 3 },
      incident_flag: false,
      waiting_passengers: 75,
      inside_buses: [
        {
          bus_id: "365J-04",
          driver: "Vikram Singh",
          vehicle_no: "KA-01-HF-1237",
          current_onboard: 30,
          max_capacity: 60,
          status: "active",
          current_stop: 3
        }
      ]
    },
    {
      stop_no: 4,
      stop_name: "P Kalinga Rao Road",
      gps_coordinates: "12.965, 77.598",
      people_detected_cctv: 45,
      arrival_rate: 2,
      next_bus_eta: "10:25",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 25,
      coordinates: { lat: 12.965, lng: 77.598 },
      etm_data: { boarding: 4, alighting: 2 },
      incident_flag: false,
      waiting_passengers: 55,
      inside_buses: [
        {
          bus_id: "365J-05",
          driver: "Deepak Raj",
          vehicle_no: "KA-01-HF-1238",
          current_onboard: 18,
          max_capacity: 60,
          status: "active",
          current_stop: 4
        }
      ]
    },
    {
      stop_no: 5,
      stop_name: "Subbaiah Circle",
      gps_coordinates: "12.959, 77.599",
      people_detected_cctv: 125,
      arrival_rate: 8,
      next_bus_eta: "10:30",
      bus_seats_available: 40,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "medium",
      congestion_percentage: 65,
      coordinates: { lat: 12.959, lng: 77.599 },
      etm_data: { boarding: 15, alighting: 8 },
      incident_flag: false,
      waiting_passengers: 145,
      inside_buses: [
        {
          bus_id: "365J-06",
          driver: "Rohit Sharma",
          vehicle_no: "KA-01-HF-1239",
          current_onboard: 42,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 5
        }
      ]
    },
    {
      stop_no: 6,
      stop_name: "K.H.Road",
      gps_coordinates: "12.954, 77.600",
      people_detected_cctv: 55,
      arrival_rate: 3,
      next_bus_eta: "10:35",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 30,
      coordinates: { lat: 12.954, lng: 77.600 },
      etm_data: { boarding: 5, alighting: 3 },
      incident_flag: false,
      waiting_passengers: 65,
      inside_buses: [
        {
          bus_id: "365J-07",
          driver: "Ajay Kumar",
          vehicle_no: "KA-01-HF-1240",
          current_onboard: 22,
          max_capacity: 60,
          status: "active",
          current_stop: 6
        }
      ]
    },
    {
      stop_no: 7,
      stop_name: "Shanthinagara Bus Station",
      gps_coordinates: "12.949, 77.600",
      people_detected_cctv: 280,
      arrival_rate: 15,
      next_bus_eta: "10:40",
      bus_seats_available: 30,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "high",
      congestion_percentage: 78,
      coordinates: { lat: 12.949, lng: 77.600 },
      etm_data: { boarding: 28, alighting: 15 },
      incident_flag: false,
      waiting_passengers: 320,
      inside_buses: [
        {
          bus_id: "365J-08",
          driver: "Manoj Patel",
          vehicle_no: "KA-01-HF-1241",
          current_onboard: 47,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 7
        }
      ]
    },
    {
      stop_no: 8,
      stop_name: "Wilson Garden Police Station",
      gps_coordinates: "12.943, 77.601",
      people_detected_cctv: 25,
      arrival_rate: 1,
      next_bus_eta: "10:45",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 15,
      coordinates: { lat: 12.943, lng: 77.601 },
      etm_data: { boarding: 2, alighting: 1 },
      incident_flag: false,
      waiting_passengers: 35,
      inside_buses: [
        {
          bus_id: "365J-09",
          driver: "Praveen Das",
          vehicle_no: "KA-01-HF-1242",
          current_onboard: 8,
          max_capacity: 60,
          status: "active",
          current_stop: 8
        }
      ]
    },
    {
      stop_no: 9,
      stop_name: "Wilson Garden 12th Cross",
      gps_coordinates: "12.938, 77.602",
      people_detected_cctv: 30,
      arrival_rate: 0,
      next_bus_eta: "10:50",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 20,
      coordinates: { lat: 12.938, lng: 77.602 },
      etm_data: { boarding: 1, alighting: 0 },
      incident_flag: false,
      waiting_passengers: 40,
      inside_buses: [
        {
          bus_id: "365J-10",
          driver: "Hari Prasad",
          vehicle_no: "KA-01-HF-1243",
          current_onboard: 12,
          max_capacity: 60,
          status: "active",
          current_stop: 9
        }
      ]
    },
    {
      stop_no: 10,
      stop_name: "Lakkasandra 3",
      gps_coordinates: "12.933, 77.602",
      people_detected_cctv: 15,
      arrival_rate: 0,
      next_bus_eta: "10:55",
      bus_seats_available: 50,
      recommended_action: "Wait / Hold Next Bus",
      congestion_level: "low",
      congestion_percentage: 10,
      coordinates: { lat: 12.933, lng: 77.602 },
      etm_data: { boarding: 0, alighting: 1 },
      incident_flag: false,
      waiting_passengers: 25,
      inside_buses: [
        {
          bus_id: "365J-11",
          driver: "Sathish Rao",
          vehicle_no: "KA-01-HF-1244",
          current_onboard: 15,
          max_capacity: 60,
          status: "active",
          current_stop: 10
        }
      ]
    },
    {
      stop_no: 11,
      stop_name: "Nimhans Hospital",
      gps_coordinates: "12.927, 77.603",
      people_detected_cctv: 180,
      arrival_rate: 7,
      next_bus_eta: "11:00",
      bus_seats_available: 35,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "medium",
      congestion_percentage: 68,
      coordinates: { lat: 12.927, lng: 77.603 },
      etm_data: { boarding: 12, alighting: 6 },
      incident_flag: false,
      waiting_passengers: 200,
      inside_buses: [
        {
          bus_id: "365J-12",
          driver: "Raghav Menon",
          vehicle_no: "KA-01-HF-1245",
          current_onboard: 41,
          max_capacity: 60,
          status: "active",
          current_stop: 11
        }
      ]
    },
    {
      stop_no: 12,
      stop_name: "Bengaluru Dairy Circle",
      gps_coordinates: "12.922, 77.604",
      people_detected_cctv: 65,
      arrival_rate: 2,
      next_bus_eta: "11:05",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 35,
      coordinates: { lat: 12.922, lng: 77.604 },
      etm_data: { boarding: 3, alighting: 2 },
      incident_flag: false,
      waiting_passengers: 75,
      inside_buses: [
        {
          bus_id: "365J-13",
          driver: "Anand Kumar",
          vehicle_no: "KA-01-HF-1246",
          current_onboard: 18,
          max_capacity: 60,
          status: "active",
          current_stop: 12
        }
      ]
    },
    {
      stop_no: 13,
      stop_name: "Ananda Ashrama",
      gps_coordinates: "12.916, 77.604",
      people_detected_cctv: 75,
      arrival_rate: 3,
      next_bus_eta: "11:10",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 40,
      coordinates: { lat: 12.916, lng: 77.604 },
      etm_data: { boarding: 4, alighting: 2 },
      incident_flag: false,
      waiting_passengers: 85,
      inside_buses: [
        {
          bus_id: "365J-14",
          driver: "Kiran Reddy",
          vehicle_no: "KA-01-HF-1247",
          current_onboard: 24,
          max_capacity: 60,
          status: "active",
          current_stop: 13
        }
      ]
    },
    {
      stop_no: 14,
      stop_name: "Gurappanapalya",
      gps_coordinates: "12.911, 77.605",
      people_detected_cctv: 220,
      arrival_rate: 10,
      next_bus_eta: "11:15",
      bus_seats_available: 25,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "high",
      congestion_percentage: 82,
      coordinates: { lat: 12.911, lng: 77.605 },
      etm_data: { boarding: 18, alighting: 8 },
      incident_flag: false,
      waiting_passengers: 250,
      inside_buses: [
        {
          bus_id: "365J-15",
          driver: "Sanjay Gupta",
          vehicle_no: "KA-01-HF-1248",
          current_onboard: 49,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 14
        }
      ]
    },
    {
      stop_no: 15,
      stop_name: "Mico Checkpost",
      gps_coordinates: "12.906, 77.606",
      people_detected_cctv: 95,
      arrival_rate: 5,
      next_bus_eta: "11:20",
      bus_seats_available: 40,
      recommended_action: "Wait",
      congestion_level: "medium",
      congestion_percentage: 55,
      coordinates: { lat: 12.906, lng: 77.606 },
      etm_data: { boarding: 8, alighting: 4 },
      incident_flag: false,
      waiting_passengers: 115,
      inside_buses: [
        {
          bus_id: "365J-16",
          driver: "Vineeth Kumar",
          vehicle_no: "KA-01-HF-1249",
          current_onboard: 33,
          max_capacity: 60,
          status: "active",
          current_stop: 15
        }
      ]
    },
    {
      stop_no: 16,
      stop_name: "JP Nagar 3rd Phase",
      gps_coordinates: "12.900, 77.606",
      people_detected_cctv: 340,
      arrival_rate: 12,
      next_bus_eta: "11:25",
      bus_seats_available: 20,
      recommended_action: "Dispatch 2 spares",
      congestion_level: "high",
      congestion_percentage: 88,
      coordinates: { lat: 12.900, lng: 77.606 },
      etm_data: { boarding: 25, alighting: 12 },
      incident_flag: false,
      waiting_passengers: 380,
      inside_buses: [
        {
          bus_id: "365J-17",
          driver: "Ajith Nair",
          vehicle_no: "KA-01-HF-1250",
          current_onboard: 53,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 16
        },
        {
          bus_id: "365J-18",
          driver: "Karthik Rao",
          vehicle_no: "KA-01-HF-1251",
          current_onboard: 56,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 16
        }
      ]
    },
    {
      stop_no: 17,
      stop_name: "Bilekalli",
      gps_coordinates: "12.895, 77.607",
      people_detected_cctv: 55,
      arrival_rate: 3,
      next_bus_eta: "11:30",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 30,
      coordinates: { lat: 12.895, lng: 77.607 },
      etm_data: { boarding: 5, alighting: 2 },
      incident_flag: false,
      waiting_passengers: 65,
      inside_buses: [
        {
          bus_id: "365J-19",
          driver: "Ravi Shankar",
          vehicle_no: "KA-01-HF-1252",
          current_onboard: 20,
          max_capacity: 60,
          status: "active",
          current_stop: 17
        }
      ]
    },
    {
      stop_no: 18,
      stop_name: "Apollo Hospital (Bannerughatta Rd)",
      gps_coordinates: "12.890, 77.608",
      people_detected_cctv: 165,
      arrival_rate: 6,
      next_bus_eta: "11:35",
      bus_seats_available: 35,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "medium",
      congestion_percentage: 72,
      coordinates: { lat: 12.890, lng: 77.608 },
      etm_data: { boarding: 10, alighting: 5 },
      incident_flag: false,
      waiting_passengers: 185,
      inside_buses: [
        {
          bus_id: "365J-20",
          driver: "Shiva Kumar",
          vehicle_no: "KA-01-HF-1253",
          current_onboard: 43,
          max_capacity: 60,
          status: "active",
          current_stop: 18
        }
      ]
    },
    {
      stop_no: 19,
      stop_name: "Arakere Gate",
      gps_coordinates: "12.884, 77.609",
      people_detected_cctv: 185,
      arrival_rate: 8,
      next_bus_eta: "11:40",
      bus_seats_available: 30,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "medium",
      congestion_percentage: 75,
      coordinates: { lat: 12.884, lng: 77.609 },
      etm_data: { boarding: 12, alighting: 6 },
      incident_flag: false,
      waiting_passengers: 205,
      inside_buses: [
        {
          bus_id: "365J-21",
          driver: "Rahul Verma",
          vehicle_no: "KA-01-HF-1254",
          current_onboard: 45,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 19
        }
      ]
    },
    {
      stop_no: 20,
      stop_name: "B.P.L.",
      gps_coordinates: "12.879, 77.609",
      people_detected_cctv: 35,
      arrival_rate: 1,
      next_bus_eta: "11:45",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 20,
      coordinates: { lat: 12.879, lng: 77.609 },
      etm_data: { boarding: 2, alighting: 1 },
      incident_flag: false,
      waiting_passengers: 45,
      inside_buses: [
        {
          bus_id: "365J-22",
          driver: "Manjunath Gowda",
          vehicle_no: "KA-01-HF-1255",
          current_onboard: 12,
          max_capacity: 60,
          status: "active",
          current_stop: 20
        }
      ]
    },
    {
      stop_no: 21,
      stop_name: "Hulimavu Gate",
      gps_coordinates: "12.874, 77.610",
      people_detected_cctv: 75,
      arrival_rate: 3,
      next_bus_eta: "11:50",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 35,
      coordinates: { lat: 12.874, lng: 77.610 },
      etm_data: { boarding: 4, alighting: 2 },
      incident_flag: false,
      waiting_passengers: 85,
      inside_buses: [
        {
          bus_id: "365J-23",
          driver: "Naveen Kumar",
          vehicle_no: "KA-01-HF-1256",
          current_onboard: 21,
          max_capacity: 60,
          status: "active",
          current_stop: 21
        }
      ]
    },
    {
      stop_no: 22,
      stop_name: "Hulimavu (Meenakshi Temple)",
      gps_coordinates: "12.868, 77.611",
      people_detected_cctv: 45,
      arrival_rate: 2,
      next_bus_eta: "11:55",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 25,
      coordinates: { lat: 12.868, lng: 77.611 },
      etm_data: { boarding: 3, alighting: 1 },
      incident_flag: false,
      waiting_passengers: 55,
      inside_buses: [
        {
          bus_id: "365J-24",
          driver: "Prakash Reddy",
          vehicle_no: "KA-01-HF-1257",
          current_onboard: 16,
          max_capacity: 60,
          status: "active",
          current_stop: 22
        }
      ]
    },
    {
      stop_no: 23,
      stop_name: "Loyola School",
      gps_coordinates: "12.863, 77.611",
      people_detected_cctv: 25,
      arrival_rate: 0,
      next_bus_eta: "12:00",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 15,
      coordinates: { lat: 12.863, lng: 77.611 },
      etm_data: { boarding: 1, alighting: 0 },
      incident_flag: false,
      waiting_passengers: 35,
      inside_buses: [
        {
          bus_id: "365J-25",
          driver: "Sathya Murthy",
          vehicle_no: "KA-01-HF-1258",
          current_onboard: 9,
          max_capacity: 60,
          status: "active",
          current_stop: 23
        }
      ]
    },
    {
      stop_no: 24,
      stop_name: "Kalena Agrahara",
      gps_coordinates: "12.858, 77.612",
      people_detected_cctv: 35,
      arrival_rate: 1,
      next_bus_eta: "12:05",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 20,
      coordinates: { lat: 12.858, lng: 77.612 },
      etm_data: { boarding: 2, alighting: 1 },
      incident_flag: false,
      waiting_passengers: 45,
      inside_buses: [
        {
          bus_id: "365J-26",
          driver: "Kumar Swamy",
          vehicle_no: "KA-01-HF-1259",
          current_onboard: 14,
          max_capacity: 60,
          status: "active",
          current_stop: 24
        }
      ]
    },
    {
      stop_no: 25,
      stop_name: "Himagiri",
      gps_coordinates: "12.852, 77.613",
      people_detected_cctv: 95,
      arrival_rate: 5,
      next_bus_eta: "12:10",
      bus_seats_available: 40,
      recommended_action: "Wait",
      congestion_level: "medium",
      congestion_percentage: 58,
      coordinates: { lat: 12.852, lng: 77.613 },
      etm_data: { boarding: 7, alighting: 3 },
      incident_flag: false,
      waiting_passengers: 115,
      inside_buses: [
        {
          bus_id: "365J-27",
          driver: "Ramesh Babu",
          vehicle_no: "KA-01-HF-1260",
          current_onboard: 35,
          max_capacity: 60,
          status: "active",
          current_stop: 25
        }
      ]
    },
    {
      stop_no: 26,
      stop_name: "Gottigere",
      gps_coordinates: "12.847, 77.613",
      people_detected_cctv: 285,
      arrival_rate: 12,
      next_bus_eta: "12:15",
      bus_seats_available: 20,
      recommended_action: "Dispatch 2 spares",
      congestion_level: "high",
      congestion_percentage: 85,
      coordinates: { lat: 12.847, lng: 77.613 },
      etm_data: { boarding: 22, alighting: 10 },
      incident_flag: false,
      waiting_passengers: 325,
      inside_buses: [
        {
          bus_id: "365J-28",
          driver: "Vikram Rao",
          vehicle_no: "KA-01-HF-1261",
          current_onboard: 51,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 26
        },
        {
          bus_id: "365J-29",
          driver: "Sneha Kumari",
          vehicle_no: "KA-01-HF-1262",
          current_onboard: 50,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 26
        }
      ]
    },
    {
      stop_no: 27,
      stop_name: "T John College",
      gps_coordinates: "12.842, 77.614",
      people_detected_cctv: 65,
      arrival_rate: 2,
      next_bus_eta: "12:20",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 35,
      coordinates: { lat: 12.842, lng: 77.614 },
      etm_data: { boarding: 5, alighting: 2 },
      incident_flag: false,
      waiting_passengers: 75,
      inside_buses: [
        {
          bus_id: "365J-30",
          driver: "Rohit Singh",
          vehicle_no: "KA-01-HF-1263",
          current_onboard: 21,
          max_capacity: 60,
          status: "active",
          current_stop: 27
        }
      ]
    },
    {
      stop_no: 28,
      stop_name: "Basavanapura Gate",
      gps_coordinates: "12.836, 77.615",
      people_detected_cctv: 85,
      arrival_rate: 3,
      next_bus_eta: "12:25",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 42,
      coordinates: { lat: 12.836, lng: 77.615 },
      etm_data: { boarding: 10, alighting: 3 },
      incident_flag: false,
      waiting_passengers: 95,
      inside_buses: [
        {
          bus_id: "365J-31",
          driver: "Anil Reddy",
          vehicle_no: "KA-01-HF-1264",
          current_onboard: 25,
          max_capacity: 60,
          status: "active",
          current_stop: 28
        }
      ]
    },
    {
      stop_no: 29,
      stop_name: "Koli Farm Gate",
      gps_coordinates: "12.831, 77.616",
      people_detected_cctv: 450,
      arrival_rate: 8,
      next_bus_eta: "12:30",
      bus_seats_available: 30,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "high",
      congestion_percentage: 90,
      coordinates: { lat: 12.831, lng: 77.616 },
      etm_data: { boarding: 12, alighting: 5 },
      incident_flag: false,
      waiting_passengers: 480,
      inside_buses: [
        {
          bus_id: "365J-32",
          driver: "Vikram Hegde",
          vehicle_no: "KA-01-HF-1265",
          current_onboard: 54,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 29
        }
      ]
    },
    {
      stop_no: 30,
      stop_name: "AMC College",
      gps_coordinates: "12.815, 77.618",
      people_detected_cctv: 380,
      arrival_rate: 5,
      next_bus_eta: "12:45",
      bus_seats_available: 40,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "high",
      congestion_percentage: 87,
      coordinates: { lat: 12.815, lng: 77.618 },
      etm_data: { boarding: 10, alighting: 4 },
      incident_flag: false,
      waiting_passengers: 420,
      inside_buses: [
        {
          bus_id: "365J-35",
          driver: "Rakesh Patel",
          vehicle_no: "KA-01-HF-1268",
          current_onboard: 52,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 30
        }
      ]
    },
    {
      stop_no: 31,
      stop_name: "Sampangiram Nagara",
      gps_coordinates: "12.809, 77.618",
      people_detected_cctv: 195,
      arrival_rate: 10,
      next_bus_eta: "12:50",
      bus_seats_available: 25,
      recommended_action: "Dispatch 1 spare",
      congestion_level: "high",
      congestion_percentage: 80,
      coordinates: { lat: 12.809, lng: 77.618 },
      etm_data: { boarding: 25, alighting: 5 },
      incident_flag: false,
      waiting_passengers: 235,
      inside_buses: [
        {
          bus_id: "365J-36",
          driver: "Sunil Rao",
          vehicle_no: "KA-01-HF-1269",
          current_onboard: 48,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 31
        }
      ]
    },
    {
      stop_no: 32,
      stop_name: "Vijaya Bank Bannerughatta",
      gps_coordinates: "12.804, 77.619",
      people_detected_cctv: 55,
      arrival_rate: 2,
      next_bus_eta: "12:55",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 30,
      coordinates: { lat: 12.804, lng: 77.619 },
      etm_data: { boarding: 5, alighting: 2 },
      incident_flag: false,
      waiting_passengers: 65,
      inside_buses: [
        {
          bus_id: "365J-37",
          driver: "Ajay Singh",
          vehicle_no: "KA-01-HF-1270",
          current_onboard: 18,
          max_capacity: 60,
          status: "active",
          current_stop: 32
        }
      ]
    },
    {
      stop_no: 33,
      stop_name: "Bannerughatta Circle",
      gps_coordinates: "12.799, 77.620",
      people_detected_cctv: 300,
      arrival_rate: 30,
      next_bus_eta: "13:00",
      bus_seats_available: 15,
      recommended_action: "Dispatch 3 spares",
      congestion_level: "high",
      congestion_percentage: 92,
      coordinates: { lat: 12.799, lng: 77.620 },
      etm_data: { boarding: 60, alighting: 10 },
      incident_flag: true,
      waiting_passengers: 360,
      inside_buses: [
        {
          bus_id: "365J-38",
          driver: "Manoj Kumar",
          vehicle_no: "KA-01-HF-1271",
          current_onboard: 55,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 33
        },
        {
          bus_id: "365J-39",
          driver: "Kavya Tiwari",
          vehicle_no: "KA-01-HF-1272",
          current_onboard: 55,
          max_capacity: 60,
          status: "spare_needed",
          current_stop: 33
        }
      ]
    },
    {
      stop_no: 34,
      stop_name: "Mantapa Cross",
      gps_coordinates: "12.793, 77.620",
      people_detected_cctv: 85,
      arrival_rate: 3,
      next_bus_eta: "13:05",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 40,
      coordinates: { lat: 12.793, lng: 77.620 },
      etm_data: { boarding: 10, alighting: 3 },
      incident_flag: false,
      waiting_passengers: 95,
      inside_buses: [
        {
          bus_id: "365J-40",
          driver: "Rahul Prasad",
          vehicle_no: "KA-01-HF-1273",
          current_onboard: 25,
          max_capacity: 60,
          status: "active",
          current_stop: 34
        }
      ]
    },
    {
      stop_no: 35,
      stop_name: "Ragihalli Gate",
      gps_coordinates: "12.788, 77.621",
      people_detected_cctv: 45,
      arrival_rate: 2,
      next_bus_eta: "13:10",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 25,
      coordinates: { lat: 12.788, lng: 77.621 },
      etm_data: { boarding: 5, alighting: 2 },
      incident_flag: false,
      waiting_passengers: 55,
      inside_buses: [
        {
          bus_id: "365J-41",
          driver: "Vineeth Raj",
          vehicle_no: "KA-01-HF-1274",
          current_onboard: 15,
          max_capacity: 60,
          status: "active",
          current_stop: 35
        }
      ]
    },
    {
      stop_no: 36,
      stop_name: "Koppa Gate",
      gps_coordinates: "12.783, 77.622",
      people_detected_cctv: 30,
      arrival_rate: 1,
      next_bus_eta: "13:15",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "low",
      congestion_percentage: 18,
      coordinates: { lat: 12.783, lng: 77.622 },
      etm_data: { boarding: 2, alighting: 1 },
      incident_flag: false,
      waiting_passengers: 40,
      inside_buses: [
        {
          bus_id: "365J-42",
          driver: "Harsha Mysore",
          vehicle_no: "KA-01-HF-1275",
          current_onboard: 11,
          max_capacity: 60,
          status: "active",
          current_stop: 36
        }
      ]
    },
    {
      stop_no: 37,
      stop_name: "Jigani Gate",
      gps_coordinates: "12.777, 77.623",
      people_detected_cctv: 125,
      arrival_rate: 5,
      next_bus_eta: "13:20",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "medium",
      congestion_percentage: 62,
      coordinates: { lat: 12.777, lng: 77.623 },
      etm_data: { boarding: 5, alighting: 3 },
      incident_flag: false,
      waiting_passengers: 145,
      inside_buses: [
        {
          bus_id: "365J-43",
          driver: "Ramesh Kumar",
          vehicle_no: "KA-01-HF-1276",
          current_onboard: 37,
          max_capacity: 60,
          status: "active",
          current_stop: 37
        }
      ]
    },
    {
      stop_no: 38,
      stop_name: "Jigani Industrial Area",
      gps_coordinates: "12.772, 77.623",
      people_detected_cctv: 145,
      arrival_rate: 6,
      next_bus_eta: "13:25",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "medium",
      congestion_percentage: 65,
      coordinates: { lat: 12.772, lng: 77.623 },
      etm_data: { boarding: 8, alighting: 4 },
      incident_flag: false,
      waiting_passengers: 165,
      inside_buses: [
        {
          bus_id: "365J-44",
          driver: "Ajith Pillai",
          vehicle_no: "KA-01-HF-1277",
          current_onboard: 39,
          max_capacity: 60,
          status: "active",
          current_stop: 38
        }
      ]
    },
    {
      stop_no: 39,
      stop_name: "Hindustan Petroleum Junction",
      gps_coordinates: "12.767, 77.624",
      people_detected_cctv: 165,
      arrival_rate: 8,
      next_bus_eta: "13:30",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "medium",
      congestion_percentage: 68,
      coordinates: { lat: 12.767, lng: 77.624 },
      etm_data: { boarding: 10, alighting: 5 },
      incident_flag: false,
      waiting_passengers: 185,
      inside_buses: [
        {
          bus_id: "365J-45",
          driver: "Manoj Tiwari",
          vehicle_no: "KA-01-HF-1278",
          current_onboard: 41,
          max_capacity: 60,
          status: "active",
          current_stop: 39
        }
      ]
    },
    {
      stop_no: 40,
      stop_name: "Jigani APC Circle",
      gps_coordinates: "12.762, 77.624",
      people_detected_cctv: 200,
      arrival_rate: 10,
      next_bus_eta: "13:35",
      bus_seats_available: 50,
      recommended_action: "Wait",
      congestion_level: "medium",
      congestion_percentage: 70,
      coordinates: { lat: 12.762, lng: 77.624 },
      etm_data: { boarding: 15, alighting: 20 },
      incident_flag: false,
      waiting_passengers: 220,
      inside_buses: [
        {
          bus_id: "365J-46",
          driver: "Raghav Shastry",
          vehicle_no: "KA-01-HF-1279",
          current_onboard: 42,
          max_capacity: 60,
          status: "active",
          current_stop: 40
        }
      ]
    }
  ]
};

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "delay",
    title: "Bus Delay Alert",
    message: "Bus 365J-12 delayed at Bannerghatta Circle (10 min late)",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    priority: "high"
  },
  {
    id: "2",
    type: "crowd",
    title: "High Crowd Detected",
    message: "High crowd detected at AMC College stop – 380 people at 5:30 PM",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    priority: "high"
  },
  {
    id: "3",
    type: "cctv",
    title: "CCTV System Alert",
    message: "CCTV offline at K.R. Circle stop - maintenance required",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    priority: "medium"
  },
  {
    id: "4",
    type: "dispatch",
    title: "Spare Bus Dispatched",
    message: "Spare bus 365J-S1 dispatched to Koli Farm Gate at 9:10 AM",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: true,
    priority: "low"
  },
  {
    id: "5",
    type: "maintenance",
    title: "Bus Maintenance",
    message: "Bus 365J-08 scheduled for maintenance at 2:00 PM",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: true,
    priority: "medium"
  }
];

export const mockPeakHourData: PeakHourData = {
  morning_peak: {
    "Majestic": 600,
    "Shanthinagar": 320,
    "Koli Farm Gate": 450,
    "AMC College": 280,
    "Gottigere": 380,
    "JP Nagar 3rd Phase": 420,
    "Bannerghatta Circle": 350,
    "Nimhans Hospital": 250
  },
  evening_peak: {
    "AMC College": 380,
    "Bannerghatta Circle": 300,
    "Jigani APC Circle": 200,
    "Koli Farm Gate": 420,
    "Gottigere": 350,
    "JP Nagar 3rd Phase": 380,
    "Shanthinagar": 280,
    "Majestic": 450
  }
};

export const yoloConfig = {
  endpoint: "http://localhost:8000/api/yolo",
  enabled: false,
  confidence_threshold: 0.7,
  last_detection: new Date().toISOString()
};

export const etmConfig = {
  endpoint: "http://localhost:8000/api/etm",
  enabled: false,
  sync_interval: 30000,
  last_sync: new Date().toISOString()
};

export const mockSustainabilityMetrics: SustainabilityMetrics = {
  carbonSaved: 1245,
  fuelEfficiency: {
    baseline: 32.5,
    optimized: 28.3,
    savedThisWeek: 215
  },
  ecoScore: 87,
  evReadiness: 42
};

export const mockEmissionTrendData: EmissionTrendData[] = [
  { day: 'Mon', co2Saved: 165 },
  { day: 'Tue', co2Saved: 178 },
  { day: 'Wed', co2Saved: 192 },
  { day: 'Thu', co2Saved: 185 },
  { day: 'Fri', co2Saved: 201 },
  { day: 'Sat', co2Saved: 143 },
  { day: 'Sun', co2Saved: 181 }
];

export const mockFuelOptimizationData: FuelOptimizationData[] = [
  { depot: 'Depot 1', litresSaved: 85 },
  { depot: 'Depot 2', litresSaved: 92 },
  { depot: 'Depot 3', litresSaved: 68 },
  { depot: 'Depot 4', litresSaved: 78 },
  { depot: 'Depot 5', litresSaved: 55 }
];

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'eco',
    message: 'Shift 2 diesel buses on Route 365J to EV',
    impact: '1.3 kg CO₂/day saved'
  },
  {
    id: '2',
    type: 'efficiency',
    message: 'Reduce 1 off-peak bus at Maharani College stop',
    impact: '45 L fuel saved/week'
  },
  {
    id: '3',
    type: 'achievement',
    message: 'Depot 3 reached Eco Score: 92',
    impact: 'Efficiency Level A'
  },
  {
    id: '4',
    type: 'eco',
    message: 'Optimize Route 365J timing during 2-4 PM',
    impact: '0.8 kg CO₂/day saved'
  }
];

export const mockForecastMetric: ForecastMetric = {
  predicted: 890,
  changePercentage: -5,
  trend: 'down'
};

export const mockRouteOptimizations: RouteOptimization[] = [
  { route: '365J', efficiency: 92, co2Saved: 1.3, suggestion: 'Shift 1 diesel to EV' },
  { route: '290B', efficiency: 81, co2Saved: 0.9, suggestion: 'Reduce 2 off-peak trips' },
  { route: '210E', efficiency: 75, co2Saved: 0.5, suggestion: 'Adjust departure times' },
  { route: '335E', efficiency: 88, co2Saved: 1.1, suggestion: 'Optimize idle time' },
  { route: '500K', efficiency: 79, co2Saved: 0.7, suggestion: 'Route path optimization' }
];

export const mockDepotEnergy: DepotEnergyStatus = {
  powerUsage: 230,
  evChargingLoad: 90,
  weeklyChange: -10
};

export const mockAnomalyAlerts: AnomalyAlert[] = [
  {
    id: 'a1',
    type: 'fuel',
    severity: 'high',
    message: 'High fuel usage on Route 210E — possible traffic congestion',
    route: '210E',
    timestamp: Date.now() - 300000
  },
  {
    id: 'a2',
    type: 'emission',
    severity: 'medium',
    message: 'CO₂ spike detected on Route 365J — optimization needed',
    route: '365J',
    timestamp: Date.now() - 600000
  }
];

export const mockCityImpact: CityImpactScenario = {
  depotsAdopting: 5,
  co2SavedPerMonth: 12000,
  fuelSavedPerMonth: 4800
};

export const mockBusEcoMetrics: BusEcoMetrics[] = [
  { busNo: 'KA-57-F-1123', fuelSaved: 12, co2Saved: 28, ecoRating: 'A', route: '365J' },
  { busNo: 'KA-57-G-9321', fuelSaved: 8, co2Saved: 18, ecoRating: 'B', route: '290B' },
  { busNo: 'KA-57-H-2231', fuelSaved: 15, co2Saved: 32, ecoRating: 'A+', route: '210E' },
  { busNo: 'KA-57-J-4432', fuelSaved: 10, co2Saved: 22, ecoRating: 'A', route: '335E' },
  { busNo: 'KA-57-K-5543', fuelSaved: 6, co2Saved: 14, ecoRating: 'B', route: '500K' },
  { busNo: 'KA-57-L-6654', fuelSaved: 11, co2Saved: 25, ecoRating: 'A', route: '365J' },
  { busNo: 'KA-57-M-7765', fuelSaved: 9, co2Saved: 20, ecoRating: 'B+', route: '290B' },
  { busNo: 'KA-57-N-8876', fuelSaved: 13, co2Saved: 29, ecoRating: 'A', route: '210E' }
];

export const mockWeatherInsight: WeatherInsight = {
  condition: 'rainy',
  impact: 'Rain expected tomorrow — predicted 3% lower fuel efficiency',
  fuelEfficiencyChange: -3
};

export const mockComfortIndex: ComfortIndex = {
  score: 8.6,
  crowdReduction: 21
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { depot: 'Depot 3', ecoScore: 92, rank: 1 },
  { depot: 'Depot 6', ecoScore: 87, rank: 2 },
  { depot: 'Depot 1', ecoScore: 81, rank: 3 },
  { depot: 'Depot 5', ecoScore: 78, rank: 4 },
  { depot: 'Depot 2', ecoScore: 75, rank: 5 }
];