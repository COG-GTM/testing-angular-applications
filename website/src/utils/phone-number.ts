export const countryDialingCodes: Record<string, number> = {
  AG: 1, AI: 1, AS: 1, BB: 1, BM: 1, BS: 1, CA: 1, DM: 1,
  DO: 1, GD: 1, GU: 1, JM: 1, KN: 1, KY: 1, LC: 1, MP: 1,
  MS: 1, PR: 1, SX: 1, TC: 1, TT: 1, US: 1, VC: 1, VI: 1, VG: 1,
};

function getAreaCode(phoneNumber: string): string {
  return phoneNumber.substring(0, 3);
}

function getPrefix(phoneNumber: string): string {
  return phoneNumber.substring(3, 6);
}

function getSuffix(phoneNumber: string): string {
  return phoneNumber.substring(6);
}

export function formatPhoneNumber(
  value: string,
  format: string = 'default',
  countryCode: string = '',
  allowEmptyString: boolean = false
): string {
  if (allowEmptyString && value === '') {
    return '';
  }

  if (!isPhoneNumberValid(value)) {
    return '';
  }

  const areaCode = getAreaCode(value);
  const prefix = getPrefix(value);
  const suffix = getSuffix(value);

  let formatted: string;
  switch (format.toLowerCase()) {
    case 'dots':
      formatted = `${areaCode}.${prefix}.${suffix}`;
      break;
    case 'hyphens':
      formatted = `${areaCode}-${prefix}-${suffix}`;
      break;
    default:
      formatted = `(${areaCode}) ${prefix}-${suffix}`;
  }

  if (countryCode) {
    const code = countryCode.toUpperCase();
    if (countryDialingCodes[code]) {
      formatted = `+${countryDialingCodes[code]} ${formatted}`;
    }
  }

  return formatted;
}

function isPhoneNumberValid(phoneNumber: string): boolean {
  const VALID_PHONE_LENGTH = 10;
  if (isNaN(Number(phoneNumber))) {
    return false;
  }
  if (phoneNumber.length !== VALID_PHONE_LENGTH) {
    return false;
  }
  return true;
}
