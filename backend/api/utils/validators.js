// Input validation utilities
const validators = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isValidPassword: (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  },

  // Validate file size
  isValidFileSize: (sizeInBytes, maxSizeInMB = 100) => {
    const maxBytes = maxSizeInMB * 1024 * 1024;
    return sizeInBytes <= maxBytes;
  },

  // Validate file type
  isValidFileType: (mimeType, allowedTypes = []) => {
    return allowedTypes.includes(mimeType);
  },

  // Validate analysis ID format
  isValidAnalysisId: (id) => {
    return /^[a-z]{3}_\d+(\.\d+)?$/.test(id);
  },

  // Sanitize text input
  sanitizeText: (text) => {
    return text
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .substring(0, 10000);
  },

  // Validate content hash
  isValidHash: (hash) => {
    return /^[a-f0-9]{64}$/.test(hash.toLowerCase()) || hash.length === 32;
  },

  // Validate Ethereum address
  isValidAddress: (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  // Validate confidence score
  isValidScore: (score) => {
    return typeof score === 'number' && score >= 0 && score <= 1;
  }
};

module.exports = validators;
