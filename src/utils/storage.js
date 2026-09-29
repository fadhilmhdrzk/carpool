import { INITIAL_VEHICLES, INITIAL_TRIPS } from '../data/mockData';

const VEHICLES_KEY = 'bank_carpool_vehicles_v4';
const TRIPS_KEY = 'bank_carpool_trips_v4';

export const getStoredVehicles = () => {
  try {
    const data = localStorage.getItem(VEHICLES_KEY);
    if (!data) {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    const vehicles = JSON.parse(data);
    if (Array.isArray(vehicles) && vehicles.length < INITIAL_VEHICLES.length) {
      const existingIds = new Set(vehicles.map(v => v.id));
      const missingVehicles = INITIAL_VEHICLES.filter(v => !existingIds.has(v.id));
      const updatedVehicles = [...vehicles, ...missingVehicles];
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(updatedVehicles));
      return updatedVehicles;
    }
    return vehicles;
  } catch (error) {
    console.error("Error reading vehicles from localStorage:", error);
    return INITIAL_VEHICLES;
  }
};

export const saveStoredVehicles = (vehicles) => {
  try {
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
  } catch (error) {
    console.error("Error saving vehicles to localStorage:", error);
  }
};

export const getStoredTrips = () => {
  try {
    const data = localStorage.getItem(TRIPS_KEY);
    if (!data) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading trips from localStorage:", error);
    return INITIAL_TRIPS;
  }
};

export const saveStoredTrips = (trips) => {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error("Error saving trips to localStorage:", error);
  }
};

export const resetAllDataToDefault = () => {
  try {
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem(TRIPS_KEY, JSON.stringify(INITIAL_TRIPS));
    return { vehicles: INITIAL_VEHICLES, trips: INITIAL_TRIPS };
  } catch (error) {
    console.error("Error resetting data:", error);
    return { vehicles: INITIAL_VEHICLES, trips: INITIAL_TRIPS };
  }
};
