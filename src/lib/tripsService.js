import { supabase } from './supabase';

// Mapping dari database Supabase (snake_case) ke format Frontend (camelCase)
export const mapDbTripToFrontend = (dbTrip) => ({
  id: dbTrip.id,
  ticketCode: dbTrip.ticket_code,
  borrowerName: dbTrip.borrower_name,
  department: dbTrip.department,
  companions: dbTrip.companions || [],
  vehicleId: dbTrip.vehicle_id,
  vehicleName: dbTrip.vehicle_name,
  plateNumber: dbTrip.plate_number,
  date: dbTrip.date,
  departureTime: dbTrip.departure_time,
  returnTime: dbTrip.return_time,
  actualReturnTime: dbTrip.actual_return_time,
  destination: dbTrip.destination,
  status: dbTrip.status,
  driverName: dbTrip.driver_name || '',
  rating: dbTrip.rating,
  ratingDescription: dbTrip.rating_description,
  submittedBy: dbTrip.submitted_by,
  createdAt: dbTrip.created_at,
});

// Mapping dari format Frontend (camelCase) ke database Supabase (snake_case)
export const mapFrontendTripToDb = (trip) => ({
  ticket_code: trip.ticketCode || `CP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  borrower_name: trip.borrowerName,
  department: trip.department,
  companions: trip.companions || [],
  vehicle_id: trip.vehicleId,
  vehicle_name: trip.vehicleName,
  plate_number: trip.plateNumber,
  driver_name: trip.driverName || null,
  date: trip.date,
  departure_time: trip.departureTime,
  return_time: trip.returnTime,
  actual_return_time: trip.actualReturnTime || null,
  destination: trip.destination,
  status: trip.status || 'Aktif',
  rating: trip.rating || null,
  rating_description: trip.ratingDescription || null,
  submitted_by: trip.submittedBy || 'Self-Service Karyawan',
});

// Fetch semua data trips dari tabel Supabase
export const fetchTripsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trips from Supabase:', error);
      return null;
    }
    return data ? data.map(mapDbTripToFrontend) : [];
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return null;
  }
};

// Tambah trip baru ke tabel Supabase
export const insertTripToSupabase = async (trip) => {
  try {
    const dbPayload = mapFrontendTripToDb(trip);
    const { data, error } = await supabase
      .from('trips')
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error('Error inserting trip to Supabase:', error);
      return null;
    }
    return data ? mapDbTripToFrontend(data) : null;
  } catch (err) {
    console.error('Supabase insert error:', err);
    return null;
  }
};

// Selesaikan/Update trip di Supabase
export const updateTripInSupabase = async (tripId, vehicleId, updates) => {
  try {
    if (!tripId && !vehicleId) {
      console.warn('updateTripInSupabase dipanggil tanpa tripId atau vehicleId');
      return null;
    }

    const dbUpdates = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.ratingDescription !== undefined) dbUpdates.rating_description = updates.ratingDescription;
    if (updates.actualReturnTime !== undefined) dbUpdates.actual_return_time = updates.actualReturnTime;
    if (updates.driverName !== undefined) dbUpdates.driver_name = updates.driverName;
    if (updates.plateNumber !== undefined) dbUpdates.plate_number = updates.plateNumber;

    let query = supabase.from('trips').update(dbUpdates);
    if (tripId) {
      query = query.eq('id', tripId);
    } else if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId).eq('status', 'Aktif');
    }

    const { data, error } = await query.select();
    if (error) {
      console.error('Error updating trip in Supabase:', error);
    }
    return data;
  } catch (err) {
    console.error('Supabase update error:', err);
  }
};
