import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtService } from '@nestjs/jwt';
import { v1 as uuidv1 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const token = req.headers.authorization.split(' ')[1];
      const jwtService: JwtService = new JwtService({
        secret: process.env.JWT_SECRET,
      });
      const userID = jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const name = `${userID.login}` + "_" +  uuidv1();
      const fileExtName = extname(file.originalname);
      callback(null, `${name}${fileExtName}`);
    },
  }),
};
