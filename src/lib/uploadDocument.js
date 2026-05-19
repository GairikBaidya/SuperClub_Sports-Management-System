import { supabase } from './supabaseClient';
import { compressImage, validatePDF } from './imageCompression';

// Bucket mapping per doc type
const BUCKET_MAP = {
  passport_photo: 'athlete-photos',
  aadhaar_card: 'athlete-documents',
  birth_certificate: 'athlete-documents',
  school_bonafide: 'athlete-documents',
  noc_club: 'athlete-noc',
  noc_state: 'athlete-noc',
  insurance_document: 'athlete-insurance',
  achievement_certificate: 'athlete-optional',
  medical_fitness: 'athlete-optional',
};

/**
 * Upload a file to Supabase Storage.
 * Compresses images, validates PDFs.
 * Returns { signedUrl, fileName, fileSizeBytes, mimeType, wasCompressed }
 */
export async function uploadDocument(file, athleteId, docType) {
  const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  const isPDF = file.type === 'application/pdf';
  const isImage = IMAGE_TYPES.includes(file.type);

  let uploadFile = file;
  let wasCompressed = false;

  if (isImage) {
    const result = await compressImage(file);
    uploadFile = result.compressed;
    wasCompressed = result.wasCompressed;
  } else if (isPDF) {
    validatePDF(file);
  } else {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  const bucket = BUCKET_MAP[docType] || 'athlete-documents';
  const ext = uploadFile.name.split('.').pop();
  const filePath = `${athleteId}/${docType}_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, uploadFile, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  return {
    signedUrl: `${bucket}/${filePath}`,
    fileName: uploadFile.name,
    fileSizeBytes: uploadFile.size,
    mimeType: uploadFile.type,
    wasCompressed,
  };
}
