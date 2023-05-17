import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  secret: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6) // Assuming OTP is always 6 digits
  otp: string;
}

export class ValidateOtpDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6) // Assuming OTP is always 6 digits
  otp: string;
}
