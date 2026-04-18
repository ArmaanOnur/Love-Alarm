/**
 * Validate Turkish or international phone number.
 * Accepts: +905551234567, 05551234567, 5551234567
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-\(\)]/g, '');
  // Turkish mobile: +90 5XX XXX XX XX
  const turkishMobile = /^(\+90|0)?5\d{9}$/;
  // Generic international
  const international = /^\+\d{7,15}$/;
  return turkishMobile.test(digits) || international.test(digits);
}

/**
 * Normalize phone number to E.164 format for the backend.
 * "05551234567" → "+905551234567"
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[\s\-\(\)\+]/g, '');
  if (digits.startsWith('0')) {
    return '+90' + digits.slice(1);
  }
  if (digits.startsWith('90') && digits.length === 12) {
    return '+' + digits;
  }
  return '+' + digits;
}

/**
 * Validate OTP code (6 digits).
 */
export function isValidOtp(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Validate display name (2–50 chars, no special chars).
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50;
}

/**
 * Validate bio (max 200 chars).
 */
export function isValidBio(bio: string): boolean {
  return bio.length <= 200;
}
