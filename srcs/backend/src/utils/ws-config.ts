import { ConfigService } from '@nestjs/config';

export class WebSocketConfig {
  static getOptions(configService: ConfigService) {
    return {
      cors: {
        origin: configService.get('FRONTEND_BASE_URL'),
        credentials: true,
      },
    };
  }
}
