// Initial Mock Data for Bank Carpool System - Official BJB Sukajadi Branch Data

export const AVAILABLE_DRIVERS = [
  "Sofwan",
  "Helmi",
  "Dudi Samsudin",
  "Memo Sutarya",
  "M. Rafiq Anas",
  "Soni Kosa",
  "Agung Darmawan",
  "Chandra Wijaya",
];

export const AVAILABLE_PLATES = [
  "D 1185 ALT",
  "D 1186 ALT",
  "D 1187 ALT",
  "D 1189 ALT",
  "D 1201 ALT",
  "D 1204 ALT",
  "D 1209 ALT",
  "D 1210 ALT",
];

export const VEHICLE_PLATE_MAP = {
  'v-01': 'D 1185 ALT',
  'v-02': 'D 1186 ALT',
  'v-03': 'D 1187 ALT',
  'v-04': 'D 1189 ALT',
  'v-05': 'D 1201 ALT',
  'v-06': 'D 1204 ALT',
  'v-07': 'D 1209 ALT',
  'v-08': 'D 1210 ALT',
};

export const getPlateNumber = (vehicleId, vehicleName) => {
  if (vehicleId && VEHICLE_PLATE_MAP[vehicleId]) return VEHICLE_PLATE_MAP[vehicleId];
  if (vehicleName) {
    const digits = vehicleName.replace(/[^0-9]/g, '');
    if (digits) {
      const num = parseInt(digits, 10);
      const key = num < 10 ? `v-0${num}` : `v-${num}`;
      if (VEHICLE_PLATE_MAP[key]) return VEHICLE_PLATE_MAP[key];
    }
  }
  return '-';
};

export const INITIAL_VEHICLES = [
  {
    id: "v-01",
    name: "Mobil Dinas 01",
    plateNumber: "D 1185 ALT",
    driverName: "Sofwan",
    status: "Tersedia",
    currentReturnTime: null,
    currentBorrower: null,
    currentDepartment: null,
  },
  {
    id: "v-02",
    name: "Mobil Dinas 02",
    plateNumber: "D 1186 ALT",
    driverName: "Helmi",
    status: "Tersedia",
    currentReturnTime: null,
    currentBorrower: null,
    currentDepartment: null,
  },
  {
    id: "v-03",
    name: "Mobil Dinas 03",
    plateNumber: "D 1187 ALT",
    driverName: "Dudi Samsudin",
    status: "Tersedia",
    currentReturnTime: null,
    currentBorrower: null,
    currentDepartment: null,
  },
  {
    id: "v-04",
    name: "Mobil Dinas 04",
    plateNumber: "D 1189 ALT",
    driverName: "Memo Sutarya",
    status: "Tersedia",
    currentReturnTime: null,
    currentBorrower: null,
    currentDepartment: null,
  },
  {
    id: "v-05",
    name: "Mobil Dinas 05",
    plateNumber: "D 1201 ALT",
    driverName: "M. Rafiq Anas",
    status: "Tersedia",
    currentReturnTime: null,
    currentBorrower: null,
    currentDepartment: null,
  },
  {
    id: "v-06",
    name: "Mobil Dinas 06",
    plateNumber: "D 1204 ALT",
    driverName: "Soni Kosa",
    status: "Tersedia",
    currentReturnTime: null,
    currentBorrower: null,
    currentDepartment: null,
  },
  {
    id: "v-07",
    name: "Mobil Dinas 07",
    plateNumber: "D 1209 ALT",
    driverName: "Agung Darmawan",
    status: "Tersedia",
    currentReturnTime: null,
    currentBorrower: null,
    currentDepartment: null,
  },
  {
    id: "v-08",
    name: "Mobil Dinas 08",
    plateNumber: "D 1210 ALT",
    driverName: "Chandra Wijaya",
    status: "Tersedia",
    currentReturnTime: null,
    currentBorrower: null,
    currentDepartment: null,
  },
];

export const BANK_DEPARTMENTS = [
  {
    id: "dept-op-kredit",
    name: "Team Operasional Kredit",
    code: "Op Kredit",
    employees: [
      { id: "e-opk-1", name: "AULIA HASAN SUMANTRI", position: "Manager Operasional", placement: "SUKAJADI" },
      { id: "e-opk-2", name: "MEGA ANNISA THELLASYA", position: "Officer Operasional Kredit", placement: "SUKAJADI" },
      { id: "e-opk-3", name: "ELIN MARLINA", position: "Staf Administrasi Kredit", placement: "SUKAJADI" },
      { id: "e-opk-4", name: "HERLINA WULANSARI", position: "Staf Administrasi Kredit", placement: "SUKAJADI" },
      { id: "e-opk-5", name: "MULIDA HERMIATI", position: "Staf Administrasi Kredit", placement: "SUKAJADI" },
      { id: "e-opk-6", name: "SANI SEPTIANI SUARTININGSIH", position: "Staf Bisnis Legal", placement: "SUKAJADI" },
      { id: "e-opk-7", name: "MUHAMAD NIZWAR", position: "Staf Bisnis Legal", placement: "SUKAJADI" },
      { id: "e-opk-8", name: "LIDIA TIATIRA L", position: "Staf Bisnis Legal", placement: "SUKAJADI" },
      { id: "e-opk-9", name: "NIKO RADIAN DANI", position: "Staf Bisnis Legal", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-op-danajasa",
    name: "Team Operasional Dana & Jasa",
    code: "Op Dana Jasa",
    employees: [
      { id: "e-opd-1", name: "YAYU PUJIAWATI", position: "Officer Operasional Dana & Jasa", placement: "SUKAJADI" },
      { id: "e-opd-2", name: "DWISANI RAHMAYANI", position: "Staf Administrasi Dana & Jasa", placement: "SUKAJADI" },
      { id: "e-opd-3", name: "EVI PRAMESTY APRIANTI", position: "Staf Administrasi Dana & Jasa", placement: "SUKAJADI" },
      { id: "e-opd-4", name: "SASMITA SARIWANA", position: "Staf Administrasi Dana & Jasa", placement: "SUKAJADI" },
      { id: "e-opd-5", name: "KATRIN FELUSI", position: "Teller", placement: "SUKAJADI" },
      { id: "e-opd-6", name: "ADINDA NAJWA SALSABILA ANGGRAENI", position: "Teller", placement: "SUKAJADI" },
      { id: "e-opd-7", name: "ANDIRA MAULANDINI ARINTAGIRI", position: "Teller", placement: "SUKAJADI" },
      { id: "e-opd-8", name: "ANISA SALSABILA TSANIA", position: "Customer Service", placement: "SUKAJADI" },
      { id: "e-opd-9", name: "FAKHRI YUSUF ABDUL GANI MAJID", position: "Customer Service", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-umum",
    name: "Team Umum",
    code: "Umum",
    employees: [
      { id: "e-umm-1", name: "R BUDIMAN ADI DARMA", position: "Officer Operasional SDM & Umum", placement: "SUKAJADI" },
      { id: "e-umm-2", name: "REZA RIZKI MAULANA", position: "Sekretariat & Umum", placement: "SUKAJADI" },
      { id: "e-umm-3", name: "JANUARY MAULANA", position: "Sekretariat & Umum", placement: "SUKAJADI" },
      { id: "e-umm-4", name: "RIDWAN ADITYA", position: "Staf Akuntansi dan Teknologi Informasi", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-rok",
    name: "Team ROK",
    code: "ROK",
    employees: [
      { id: "e-rok-1", name: "WIDYA NOVIANSIH", position: "Junior Relationship Officer Konsumer", placement: "SUKAJADI" },
      { id: "e-rok-2", name: "GITA TRESNA SAKTI", position: "Junior Relationship Officer Konsumer", placement: "SUKAJADI" },
      { id: "e-rok-3", name: "SRI ASTUTI DAMAYANTI", position: "Junior Relationship Officer Konsumer", placement: "SUKAJADI" },
      { id: "e-rok-4", name: "RINJANI FAJAR PUTRI", position: "Junior Relationship Officer Konsumer", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-rod",
    name: "Team ROD",
    code: "ROD",
    employees: [
      { id: "e-rod-1", name: "ADHY MAULANA SOFYAN", position: "Junior Relationship Officer Konsumer - Digital Banking", placement: "SUKAJADI" },
      { id: "e-rod-2", name: "RIFA ABDUL ROHMAN", position: "Junior Relationship Officer Konsumer - Digital Banking", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-komersial",
    name: "Team Komersial",
    code: "Komersial",
    employees: [
      { id: "e-kom-1", name: "YULIANDINY EKAWATY", position: "Manager Bisnis - Komersial", placement: "SUKAJADI" },
      { id: "e-kom-2", name: "M. REZA PAHLEVI", position: "Junior Account Officer Komersial", placement: "SUKAJADI" },
      { id: "e-kom-3", name: "RENDRA BAYAN AMINULLOH", position: "Account Officer Komersial", placement: "SUKAJADI" },
      { id: "e-kom-4", name: "ERNI ROHAENI", position: "Junior Relationship Officer Institusi", placement: "SUKAJADI" },
      { id: "e-kom-5", name: "NITA OKTAVIANI", position: "Junior Relationship Officer Institusi", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-ao-konsumer",
    name: "Team AO Konsumer",
    code: "AO Konsumer",
    employees: [
      { id: "e-aok-1", name: "NURI NURANI", position: "Junior Account Officer Konsumer & Ritel", placement: "SUKAJADI" },
      { id: "e-aok-2", name: "FIKA WULANDARI ISHAK", position: "Junior Account Officer Konsumer & Ritel", placement: "SUKAJADI" },
      { id: "e-aok-3", name: "SISKA PRATIWI HANDAYANI KARIM", position: "Junior Account Officer Konsumer & Ritel", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-ao-ritel",
    name: "Team AO Ritel",
    code: "AO Ritel",
    employees: [
      { id: "e-aor-1", name: "JASMIN NAHARAN", position: "Junior Account Officer Konsumer & Ritel", placement: "SUKAJADI" },
      { id: "e-aor-2", name: "WIRAWAN SIDIK MARTANA", position: "Junior Account Officer Konsumer & Ritel", placement: "SUKAJADI" },
      { id: "e-aor-3", name: "ANNISA TIFANY", position: "Senior Account Officer Konsumer & Ritel", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-ao-kpr",
    name: "Team AO KPR",
    code: "AO KPR",
    employees: [
      { id: "e-kpr-1", name: "YUDI SUPRIYATNA", position: "Junior Account Officer KPR & KKB - Collection", placement: "SUKAJADI" },
      { id: "e-kpr-2", name: "RIZKI SURYA FAISAL", position: "Junior Account Officer KPR & KKB", placement: "SUKAJADI" },
      { id: "e-kpr-3", name: "SOFIAN PRADIANSYAH", position: "Junior Account Officer KPR & KKB", placement: "SUKAJADI" },
    ],
  },
  {
    id: "dept-ao-umkm",
    name: "Team AO UMKM",
    code: "AO UMKM",
    employees: [
      { id: "e-umk-1", name: "FAHMI LUTHFI NUGRAHA", position: "Manager Bisnis - UMKM", placement: "SUKAJADI" },
      { id: "e-umk-2", name: "AYU SITI SARAH", position: "Junior Account Officer UMKM", placement: "SUKAJADI" },
      { id: "e-umk-3", name: "DONI PERMATA PUTRA", position: "Junior Account Officer UMKM", placement: "SUKAJADI" },
      { id: "e-umk-4", name: "INE YULYA", position: "Junior Account Officer UMKM", placement: "SUKAJADI" },
      { id: "e-umk-5", name: "PRAYOGI", position: "Junior Account Officer UMKM", placement: "SUKAJADI" },
      { id: "e-umk-6", name: "TEGUH SAEFUL ROCHMAN", position: "Junior Account Officer UMKM", placement: "SUKAJADI" },
      { id: "e-umk-7", name: "TRI HARIYADI CHAERON DITA", position: "Junior Account Officer UMKM", placement: "SUKAJADI" },
    ],
  },
];

export const INITIAL_TRIPS = [];
