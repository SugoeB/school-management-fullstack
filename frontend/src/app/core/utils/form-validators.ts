import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function onlyLettersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) {
      return null;
    }

    const hasNumber = /\d/.test(value);

    return hasNumber ? { onlyLetters: true } : null;
  };
}

export function birthDateValidator(
  minAge: number,
  maxAge: number,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) {
      return null;
    }

    const birthDate = new Date(value);
    const today = new Date();

    if (birthDate > today) {
      return { futureDate: true };
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && dayDifference < 0)
    ) {
      age--;
    }

    if (age < minAge) {
      return { minAge: true };
    }

    if (age > maxAge) {
      return { maxAge: true };
    }

    return null;
  };
}

export function onlyCpfNumbers(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

export function cpfMask(value: string): string {
  const numbers = onlyCpfNumbers(value);

  return numbers
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}