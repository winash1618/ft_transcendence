import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ValidateFilenamePipe implements PipeTransform {
  transform(value: string) {
    const validExtensions = ['jpg', 'png', 'jpeg', 'gif']; // Extend this array based on the file types you want to allow.
    const extension = value.split('.').pop();

    if (!validExtensions.includes(extension)) {
      console.log('Invalid file type');
      throw new BadRequestException('Invalid file type');
    }

    return value;
  }
}
