import { Stop, Bus, RouteData } from '../types';

export interface BusMovementEvent {
  busId: string;
  fromStop: number;
  toStop: number;
  boarding: number;
  alighting: number;
}

export class BusSimulationService {
  private stops: Stop[];
  private movementInterval: NodeJS.Timeout | null = null;
  private updateCallback: ((stops: Stop[]) => void) | null = null;
  private dispatchedBuses: Set<string> = new Set();

  constructor(initialStops: Stop[]) {
    this.stops = initialStops;
  }

  setUpdateCallback(callback: (stops: Stop[]) => void) {
    this.updateCallback = callback;
  }

  private notifyUpdate() {
    if (this.updateCallback) {
      this.updateCallback([...this.stops]);
    }
  }

  markBusAsDispatched(busId: string, stopNo: number) {
    this.dispatchedBuses.add(busId);

    const stopIndex = this.stops.findIndex(s => s.stop_no === stopNo);
    if (stopIndex !== -1) {
      this.stops[stopIndex].lastDispatchTime = Date.now();
    }

    setTimeout(() => {
      this.dispatchedBuses.delete(busId);
    }, 300000);
  }

  isDispatchButtonAvailable(stopNo: number): boolean {
    const stop = this.stops.find(s => s.stop_no === stopNo);
    if (!stop) return false;

    const highCrowdThreshold = 70;
    const cooldownPeriod = 300000;

    if (stop.people_detected_cctv < highCrowdThreshold) {
      return false;
    }

    if (stop.lastDispatchTime && (Date.now() - stop.lastDispatchTime) < cooldownPeriod) {
      return false;
    }

    return true;
  }

  private calculateETMData(bus: Bus, currentStop: Stop, nextStopNo: number): { boarding: number; alighting: number } {
    const currentOccupancy = bus.current_onboard;
    const maxCapacity = bus.max_capacity;
    const availableSeats = maxCapacity - currentOccupancy;

    const waitingAtStop = currentStop.waiting_passengers || 0;

    const alighting = Math.floor(currentOccupancy * (0.1 + Math.random() * 0.3));

    const afterAlighting = currentOccupancy - alighting;
    const canBoard = maxCapacity - afterAlighting;
    const wantToBoard = Math.min(waitingAtStop, Math.floor(waitingAtStop * (0.3 + Math.random() * 0.5)));
    const boarding = Math.min(canBoard, wantToBoard);

    return { boarding, alighting };
  }

  private moveBusBetweenStops() {
    const updatedStops = [...this.stops];

    updatedStops.forEach((stop, stopIndex) => {
      const busesToMove: Bus[] = [];
      const busesToStay: Bus[] = [];

      stop.inside_buses.forEach(bus => {
        const shouldMove = Math.random() > 0.7;

        if (shouldMove && stop.stop_no < 40) {
          busesToMove.push(bus);
        } else {
          busesToStay.push(bus);
        }
      });

      busesToMove.forEach(bus => {
        const nextStopNo = stop.stop_no + 1;
        const nextStopIndex = updatedStops.findIndex(s => s.stop_no === nextStopNo);

        if (nextStopIndex !== -1) {
          const etmData = this.calculateETMData(bus, stop, nextStopNo);

          updatedStops[stopIndex].etm_data.alighting = etmData.alighting;
          updatedStops[nextStopIndex].etm_data.boarding = etmData.boarding;

          const newOnboard = Math.max(0, Math.min(
            bus.max_capacity,
            bus.current_onboard - etmData.alighting + etmData.boarding
          ));

          const movedBus: Bus = {
            ...bus,
            current_onboard: newOnboard,
            current_stop: nextStopNo,
            destination_stop: nextStopNo + Math.floor(Math.random() * 5) + 1
          };

          updatedStops[nextStopIndex].inside_buses.push(movedBus);

          updatedStops[nextStopIndex].waiting_passengers = Math.max(
            0,
            updatedStops[nextStopIndex].waiting_passengers - etmData.boarding
          );
        }
      });

      updatedStops[stopIndex].inside_buses = busesToStay;
    });

    this.stops = updatedStops;
    this.notifyUpdate();
  }

  private updatePassengerCounts() {
    this.stops = this.stops.map(stop => {
      stop.inside_buses = stop.inside_buses.map(bus => ({
        ...bus,
        current_onboard: Math.max(0, Math.min(
          bus.max_capacity,
          Math.round(bus.current_onboard + (Math.random() - 0.5) * 4)
        ))
      }));

      const variation = Math.floor((Math.random() - 0.5) * 10);
      stop.people_detected_cctv = Math.max(15, Math.min(200, stop.people_detected_cctv + variation));

      stop.waiting_passengers = Math.max(10, Math.min(250, stop.waiting_passengers + variation));

      return stop;
    });

    this.notifyUpdate();
  }

  startSimulation() {
    this.movementInterval = setInterval(() => {
      this.moveBusBetweenStops();
    }, 180000);

    setInterval(() => {
      this.updatePassengerCounts();
    }, 10000);
  }

  stopSimulation() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval);
      this.movementInterval = null;
    }
  }

  getStops(): Stop[] {
    return this.stops;
  }
}
