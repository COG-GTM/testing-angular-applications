import { describe, it, expect } from 'vitest';
import { isEmailValid, isPhoneNumberValid } from '../utils/validation';

describe('isEmailValid', () => {
  it('should return true for empty string', () => {
    expect(isEmailValid('')).toBe(true);
  });

  it('should return true for valid email', () => {
    expect(isEmailValid('test@example.com')).toBe(true);
  });

  it('should return false for email without @', () => {
    expect(isEmailValid('testexample.com')).toBe(false);
  });

  it('should return false for email without dot', () => {
    expect(isEmailValid('test@examplecom')).toBe(false);
  });
});

describe('isPhoneNumberValid', () => {
  it('should return true for empty string', () => {
    expect(isPhoneNumberValid('')).toBe(true);
  });

  it('should return true for valid 10-digit number', () => {
    expect(isPhoneNumberValid('7035551234')).toBe(true);
  });

  it('should return false for number with wrong length', () => {
    expect(isPhoneNumberValid('703555')).toBe(false);
  });

  it('should return false for non-numeric input', () => {
    expect(isPhoneNumberValid('703555abcd')).toBe(false);
  });
});
