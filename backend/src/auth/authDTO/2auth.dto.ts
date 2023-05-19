import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  // @Matches(/^[A-Z2-7]+$/, { message: 'Invalid base32 string' })
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
