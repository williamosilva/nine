import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidEmailFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidEmailFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;

          const email = value.trim();

          const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!basicEmailRegex.test(email)) return false;

          const [local, domain] = email.split('@');

          if (!local || local.length < 1 || local.length > 64) return false;

          const localRegex = /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+$/;
          if (!localRegex.test(local)) return false;

          if (
            local.startsWith('.') ||
            local.endsWith('.') ||
            local.includes('..')
          )
            return false;

          if (!domain) return false;

          if (!domain.includes('.')) return false;

          const domainParts = domain.split('.');

          for (const part of domainParts) {
            if (!part) return false;

            const domainPartRegex = /^[a-zA-Z0-9-]+$/;
            if (!domainPartRegex.test(part)) return false;

            if (part.startsWith('-') || part.endsWith('-')) return false;
          }

          const tld = domainParts[domainParts.length - 1];

          if (tld.length < 2) return false;

          if (/^\d+$/.test(tld)) return false;

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const email = typeof args.value === 'string' ? args.value : '';

          if (typeof email !== 'string') {
            return 'Email must be a string';
          }

          if (!email.includes('@')) {
            return 'Email must contain the @ symbol';
          }

          const [local, domain] = email.split('@');

          if (!local || local.length === 0) {
            return 'Email must have a username before the @';
          }

          if (local.length > 64) {
            return 'Email username is too long';
          }

          if (
            local.startsWith('.') ||
            local.endsWith('.') ||
            local.includes('..')
          ) {
            return 'Email username contains dots in invalid positions';
          }

          if (!domain || !domain.includes('.')) {
            return 'Email domain must contain at least one dot';
          }

          const domainParts = domain.split('.');
          const tld = domainParts[domainParts.length - 1];

          if (tld.length < 2) {
            return 'Email TLD (part after the last dot) is too short';
          }

          if (/^\d+$/.test(tld)) {
            return 'Email TLD cannot contain only numbers';
          }

          return 'Invalid email format';
        },
      },
    });
  };
}
