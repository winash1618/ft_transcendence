export interface IAuthService {
  getHello(): string;
  getJwt(user): Promise<string>;
  validRefreshToken(email: string, pass: string): Promise<any>;
}
