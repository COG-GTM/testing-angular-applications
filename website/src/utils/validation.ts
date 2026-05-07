export function isEmailValid(email: string): boolean {
  return email === '' || (email !== '' && email.includes('@') && email.includes('.'));
}

export function isPhoneNumberValid(phoneNumber: string): boolean {
  return phoneNumber === '' || (phoneNumber !== '' && phoneNumber.length === 10 && /^\d+$/.test(phoneNumber));
}
