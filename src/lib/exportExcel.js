import * as XLSX from 'xlsx';

const DOC_HEADER_MAP = {
  id: 'Registration ID',
  full_name: 'Full Name',
  date_of_birth: 'Date of Birth',
  age: 'Age',
  gender: 'Gender',
  blood_group: 'Blood Group',
  mobile_number: 'Mobile Number',
  email: 'Email',
  father_name: "Father's Name",
  mother_name: "Mother's Name",
  guardian_name: 'Guardian Name',
  guardian_mobile: 'Guardian Mobile',
  current_address: 'Current Address',
  city: 'City',
  state: 'State',
  pin_code: 'PIN Code',
  country: 'Country',
  club_name: 'Club Name',
  state_representation: 'State Representation',
  district: 'District',
  age_group: 'Age Group',
  skill_level: 'Skill Level',
  events_applied: 'Events Applied',
  registration_status: 'Registration Status',
  created_at: 'Registered On',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function exportToExcel(athletes) {
  if (!athletes || athletes.length === 0) {
    throw new Error('No data to export.');
  }

  const rows = athletes.map((a) => ({
    [DOC_HEADER_MAP.id]: a.id,
    [DOC_HEADER_MAP.full_name]: a.full_name,
    [DOC_HEADER_MAP.date_of_birth]: a.date_of_birth,
    [DOC_HEADER_MAP.age]: a.age,
    [DOC_HEADER_MAP.gender]: a.gender,
    [DOC_HEADER_MAP.blood_group]: a.blood_group,
    [DOC_HEADER_MAP.mobile_number]: a.mobile_number,
    [DOC_HEADER_MAP.email]: a.email,
    [DOC_HEADER_MAP.father_name]: a.father_name || '',
    [DOC_HEADER_MAP.mother_name]: a.mother_name || '',
    [DOC_HEADER_MAP.guardian_name]: a.guardian_name || '',
    [DOC_HEADER_MAP.guardian_mobile]: a.guardian_mobile || '',
    [DOC_HEADER_MAP.current_address]: a.current_address,
    [DOC_HEADER_MAP.city]: a.city,
    [DOC_HEADER_MAP.state]: a.state,
    [DOC_HEADER_MAP.pin_code]: a.pin_code,
    [DOC_HEADER_MAP.country]: a.country,
    [DOC_HEADER_MAP.club_name]: a.club_name || '',
    [DOC_HEADER_MAP.state_representation]: a.state_representation || '',
    [DOC_HEADER_MAP.district]: a.district || '',
    [DOC_HEADER_MAP.age_group]: a.age_group || '',
    [DOC_HEADER_MAP.skill_level]: a.skill_level || '',
    [DOC_HEADER_MAP.events_applied]: (a.events_applied || []).join(', '),
    [DOC_HEADER_MAP.registration_status]: a.registration_status,
    [DOC_HEADER_MAP.created_at]: formatDate(a.created_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Athletes');

  // Auto-width columns
  const colWidths = Object.keys(rows[0]).map((key) => ({
    wch: Math.max(key.length, 15),
  }));
  worksheet['!cols'] = colWidths;

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Athletes_Export_${date}.xlsx`);
}
