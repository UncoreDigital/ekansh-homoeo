/**
 * Ekansh Homoeopathic Clinic - Security & Validation Utilities
 */

// Simple in-memory rate limiter for serverless environment
// Tracks submissions per IP with sliding expiration window
interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;      // Max 5 submissions per minute per IP

/**
 * Checks whether an IP address has exceeded the rate limit.
 * Cleans up stale entries periodically.
 */
export function checkRateLimit(ip: string = 'unknown'): { allowed: boolean; remaining: number } {
  const now = Date.now();
  
  // Garbage collection: clean entries older than 2 minutes
  if (rateLimitMap.size > 500) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.firstRequest > RATE_LIMIT_WINDOW_MS * 2) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (now - record.firstRequest > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

/**
 * Validates honeypot field.
 * Legitimate users will leave this empty. Automated bots often fill every field.
 */
export function isHoneypotTriggered(honeypotValue?: unknown): boolean {
  if (typeof honeypotValue === 'string' && honeypotValue.trim().length > 0) {
    return true; // Bot detected
  }
  return false;
}

/**
 * Sanitizes user input string:
 * - Strips dangerous HTML / script tags
 * - Trims excessive whitespace
 * - Enforces max length limits
 */
export function sanitizeInput(input?: unknown, maxLength: number = 2000): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[<>'"&]/g, (char) => {
      // Basic character escaping
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        case '&': return '&amp;';
        default: return char;
      }
    })
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates 10-digit Indian mobile numbers (starts with 6, 7, 8, or 9).
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
  return /^[6-9]\d{9}$/.test(cleanPhone);
}

/**
 * Formats phone number into standard Indian format (+91 XXXXX XXXXX).
 */
export function formatIndianPhone(phone: string): string {
  const clean = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone;
}

/**
 * Basic email format validator.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
