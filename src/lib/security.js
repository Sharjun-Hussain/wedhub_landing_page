import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes a string to prevent XSS.
 * @param {string} input - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return DOMPurify.sanitize(input.trim());
};

/**
 * Trims all string values in an object recursively.
 * @param {object} obj - The object to trim.
 * @returns {object} - The trimmed object.
 */
export const trimObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(trimObject);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = trimObject(obj[key]);
      return acc;
    }, {});
  } else if (typeof obj === "string") {
    return obj.trim();
  }
  return obj;
};

/**
 * Normalizes a phone number by removing non-numeric characters
 * except for the leading plus sign.
 * @param {string} phone - The phone number to normalize.
 * @returns {string} - The normalized phone number.
 */
export const normalizePhone = (phone) => {
  if (!phone) return "";
  // Keep the + if it exists at the start, and remove all other non-digits
  const startsWithPlus = phone.trim().startsWith("+");
  const digits = phone.replace(/\D/g, "");
  return startsWithPlus ? `+${digits}` : digits;
};
/**
 * Sanitizes an entire object's string values, excluding specified fields.
 * Useful for cleaning form data before submission.
 * @param {object} obj - The object to sanitize.
 * @param {string[]} excludeFields - List of keys to NOT sanitize (e.g. ['password']).
 * @returns {object} - The sanitized object.
 */
export const sanitizeObject = (
  obj,
  excludeFields = ["password", "password_confirmation"],
) => {
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      if (excludeFields.includes(key)) {
        acc[key] = typeof obj[key] === "string" ? obj[key].trim() : obj[key];
      } else {
        acc[key] =
          typeof obj[key] === "object"
            ? sanitizeObject(obj[key], excludeFields)
            : sanitizeInput(obj[key]);
      }
      return acc;
    }, {});
  }
  return obj;
};
