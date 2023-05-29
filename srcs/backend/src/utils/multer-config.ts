import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export function getMulterConfig(configService: ConfigService) {
  return {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const token = req.headers.authorization.split(' ')[1];
        const jwtService: JwtService = new JwtService({
          secret: configService.get('JWT_SECRET'),
        });
        const userID = jwtService.verify(token, {
          secret: configService.get('JWT_SECRET'),
        });
        const name = `${userID.login}`;
        const fileExtName = extname(file.originalname);
        callback(null, `${name}${fileExtName}`);
      },
    }),
  };
}
