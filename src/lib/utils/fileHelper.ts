/**
 * File validation utility functions
 */

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  'application/pdf', 
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Maximum file size (5MB in bytes)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validates a file for upload
 */
export const validateFile = (file: File) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload a PDF, DOC, DOCX, or image file.'
    };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false,
      error: 'File is too large. Maximum size is 5MB.'
    };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please select a valid file.'
    };
  }
  
  // File is valid
  return { valid: true, error: null };
};

/**
 * Formats file size in a human-readable format
 */
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

/**
 * Gets file extension from file name
 */
export const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};
