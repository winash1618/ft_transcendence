export interface IAuthService {
  getHello(): string;
  getJwtToken(user): Promise<string>;
  validRefreshToken(email: string, pass: string): Promise<any>;
}
