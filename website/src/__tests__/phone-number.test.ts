import { describe, it, expect } from 'vitest';
import { formatPhoneNumber } from '../utils/phone-number';

describe('formatPhoneNumber', () => {
  it('should format with default format', () => {
    expect(formatPhoneNumber('7035551234')).toBe('(703) 555-1234');
  });

  it('should format with dots', () => {
    expect(formatPhoneNumber('7035551234', 'dots')).toBe('703.555.1234');
  });

  it('should format with hyphens', () => {
    expect(formatPhoneNumber('7035551234', 'hyphens')).toBe('703-555-1234');
  });

  it('should prepend country code when provided', () => {
    expect(formatPhoneNumber('7035551234', 'dots', 'US')).toBe('+1 703.555.1234');
  });

  it('should return empty string for invalid phone number', () => {
    expect(formatPhoneNumber('123')).toBe('');
  });

  it('should return empty string when allowEmptyString is true and value is empty', () => {
    expect(formatPhoneNumber('', 'default', '', true)).toBe('');
  });

  it('should return empty string for non-numeric input', () => {
    expect(formatPhoneNumber('abcdefghij')).toBe('');
  });
});
