import multer from 'multer';
import { resolve } from 'path';
import crypto from 'crypto';

const tempPath = resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tempPath,

  storage: multer.diskStorage({
    destination: tempPath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
