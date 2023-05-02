import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function IsOptionalOrMatchesRegex(
  regex: RegExp,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isOptionalOrMatchesRegex',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value === '' || value === null || value === undefined || regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `The property $property must be empty or match the regex: ${regex.toString()}`;
        },
      },
    });
  };
}
