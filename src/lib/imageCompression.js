import imageCompression from 'browser-image-compression';

/**
 * Compress an image file to ≤1 MB, max 1024px on longest side.
 * Returns { compressed: File, wasCompressed: boolean }
 */
export async function compressImage(file) {
  const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error('Only JPG/JPEG/PNG images can be compressed.');
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: file.type,
    initialQuality: 0.75,
  };

  const originalSizeMB = file.size / 1024 / 1024;
  
  // If already under limit, skip compression
  if (originalSizeMB <= 1) {
    return { compressed: file, wasCompressed: false };
  }

  const compressed = await imageCompression(file, options);
  return { compressed, wasCompressed: true };
}

/**
 * Validate a PDF file (type + size ≤2 MB)
 */
export function validatePDF(file) {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are accepted for this field.');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('PDF file must be under 2 MB.');
  }
  return true;
}
