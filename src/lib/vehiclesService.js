import { supabase } from './supabase';

// Mapping dari DB Supabase (snake_case) ke Frontend (camelCase)
export const mapDbVehicleToFrontend = (v) => ({
  id: v.id,
  name: v.name,
  plateNumber: v.plate_number,
  driverName: v.driver_name,
  status: v.status,
  currentReturnTime: v.current_return_time,
  currentBorrower: v.current_borrower,
  currentDepartment: v.current_department,
});

// Mapping dari Frontend (camelCase) ke DB Supabase (snake_case)
export const mapFrontendVehicleToDb = (v) => ({
  id: v.id,
  name: v.name,
  plate_number: v.plateNumber,
  driver_name: v.driverName,
  status: v.status,
  current_return_time: v.currentReturnTime || null,
  current_borrower: v.currentBorrower || null,
  current_department: v.currentDepartment || null,
});

// Fetch semua armada mobil dari Supabase
export const fetchVehiclesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching vehicles from Supabase:', error);
      return null;
    }
    return data ? data.map(mapDbVehicleToFrontend) : [];
  } catch (err) {
    console.error('Supabase vehicles fetch error:', err);
    return null;
  }
};

// Update status & detail mobil di Supabase
export const updateVehicleInSupabase = async (vehicleId, updates) => {
  try {
    const dbPayload = {};
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.plateNumber !== undefined) dbPayload.plate_number = updates.plateNumber;
    if (updates.driverName !== undefined) dbPayload.driver_name = updates.driverName;
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.currentBorrower !== undefined) dbPayload.current_borrower = updates.currentBorrower;
    if (updates.currentDepartment !== undefined) dbPayload.current_department = updates.currentDepartment;
    if (updates.currentReturnTime !== undefined) dbPayload.current_return_time = updates.currentReturnTime;

    const { data, error } = await supabase
      .from('vehicles')
      .update(dbPayload)
      .eq('id', vehicleId)
      .select();

    if (error) {
      console.error('Error updating vehicle in Supabase:', error);
    }
    return data;
  } catch (err) {
    console.error('Supabase vehicle update error:', err);
  }
};
