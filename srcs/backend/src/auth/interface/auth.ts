export interface IAuthService {
  getHello(): string;
  getJwtToken(user): Promise<string>;
  validRefreshToken(login: string, pass: string): Promise<any>;
}
