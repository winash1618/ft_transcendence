import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function Trim(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Trim',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'string') {
            (args.object as any)[args.property] = value.trim();
          }
          return true; // We will not block non-string values
        },
      },
    });
  };
}
