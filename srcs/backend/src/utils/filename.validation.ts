import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ValidateFilenamePipe implements PipeTransform {
  transform(value: string) {
    if (value === 'null' || value === 'undefined')
      return null;
    if (value && value !== '' && value !== 'null') {
      const validExtensions = ['jpg', 'png', 'jpeg', 'gif']; // Extend this array based on the file types you want to allow.
      const extension = value.split('.').pop();

      if (!validExtensions.includes(extension)) {
        throw new BadRequestException('Invalid file type');
      }
    }

    return value;
  }
}
