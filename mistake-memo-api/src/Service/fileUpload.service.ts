import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Storage as Gcs,
  Bucket,
  DeleteFileOptions,
} from '@google-cloud/storage';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {}

  getGcsBucket(): Bucket {
    const storage = new Gcs({
      keyFilename: this.configService.get<string>('GOOGLE_SECRETS_FILE'),
    });
    return storage.bucket(
      this.configService.get<string>('GOOGLE_STORAGE_BUCKET'),
    );
  }

  addFileToGcs(file: Express.Multer.File, filePath: string): Promise<string> {
    return new Promise((resolve) => {
      const bucketFile = this.getGcsBucket().file(filePath);
      const stream = bucketFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on('error', (err) => {
        throw err;
      });

      stream.on('finish', async () => {
        bucketFile.makePublic().then(() => {
          resolve(bucketFile.publicUrl());
        });
      });

      stream.end(file.buffer);
    });
  }

  async deleteFileGcs(filePath: string): Promise<void> {
    const deleteOptions: DeleteFileOptions = {
      // オブジェクトが存在しない場合エラーにするかどうか
      ignoreNotFound: true,
    };
    this.getGcsBucket().file(filePath).delete(deleteOptions);
  }
}
