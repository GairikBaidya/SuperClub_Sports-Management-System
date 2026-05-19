// Hardcoded events list for Phase 1
// Set isInsuranceRequired: true for at least one event to test conditional logic.
export const EVENTS_LIST = [
  { id: 'athletics_100m', name: '100m Sprint', sport: 'Athletics', isInsuranceRequired: false },
  { id: 'athletics_national', name: 'National Athletics Championship', sport: 'Athletics', isInsuranceRequired: true },
  { id: 'football_5aside', name: 'Football (5-a-side)', sport: 'Football', isInsuranceRequired: false },
  { id: 'football_11aside', name: 'Football (11-a-side)', sport: 'Football', isInsuranceRequired: true },
  { id: 'swimming_freestyle', name: 'Swimming - Freestyle 50m', sport: 'Swimming', isInsuranceRequired: false },
  { id: 'basketball_3x3', name: 'Basketball 3x3', sport: 'Basketball', isInsuranceRequired: false },
  { id: 'badminton_singles', name: 'Badminton - Singles', sport: 'Badminton', isInsuranceRequired: false },
  { id: 'kabaddi', name: 'Kabaddi', sport: 'Kabaddi', isInsuranceRequired: false },
  { id: 'chess_classical', name: 'Chess - Classical', sport: 'Chess', isInsuranceRequired: false },
  { id: 'wrestling_freestyle', name: 'Wrestling - Freestyle', sport: 'Wrestling', isInsuranceRequired: true },
];

export const AGE_GROUPS = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18', 'U-21', 'Senior', 'Open'];
export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry',
];

/**
 * Auto-suggest age group based on age number
 */
export function suggestAgeGroup(age) {
  if (age < 8)  return 'U-8';
  if (age <= 9)  return 'U-10';
  if (age <= 11) return 'U-12';
  if (age <= 13) return 'U-14';
  if (age <= 15) return 'U-16';
  if (age <= 17) return 'U-18';
  if (age <= 20) return 'U-21';
  if (age <= 35) return 'Senior';
  return 'Open';
}

/**
 * Calculate age from DOB string (YYYY-MM-DD)
 */
export function calcAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const REGISTRATION_FEE = 500;
export const LOCAL_STORAGE_KEY = 'scm_registration_draft';
