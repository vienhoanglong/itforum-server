import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseConfigService } from 'src/config/firebase.config';
import { Bucket, File } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { removeVietnameseTones } from 'src/constants/helper';
@Injectable()
export class FirebaseService {
  private storage: admin.storage.Storage;
  private bucket: Bucket;
  constructor(private firebaseConfigService: FirebaseConfigService) {
    const firebaseConfig = this.firebaseConfigService.getFirebaseConfig();
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: firebaseConfig.storageBucket,
    });

    this.storage = admin.storage();
    this.bucket = this.storage.bucket();
  }
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ link: string; filename: string }> {
    const storageBucket = this.storage.bucket();
    const originalname = removeVietnameseTones(file.originalname);
    const filename = uuidv4() + '_' + file.originalname;
    const fileRef = storageBucket.file(filename);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // const downloadUrl = `https://storage.googleapis.com/${storageBucket.name}/${filename}`;
    // return downloadUrl;
    const downloadUrl = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Adjust the expiration date as needed
    });
    return { link: downloadUrl[0], filename: originalname };
  }

  async getListAvatar(): Promise<object> {
    const [files] = await this.bucket.getFiles({ prefix: 'avatars' });
    const fileList = files
      .filter((file: File) => {
        const metadata = file.metadata;
        return (
          metadata.contentType !== undefined &&
          metadata.contentType.startsWith('image/')
        );
      })
      .map(async (file: File) => {
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // Adjust the expiration date as needed
        });

        return {
          name: file.name,
          url: url,
        };
      });

    return Promise.all(fileList);
  }

  async uploadFileIntoDocuments(
    file: Express.Multer.File,
  ): Promise<{ link: string; filename: string; extension: string }> {
    const originalname = removeVietnameseTones(file.originalname);
    const extension = originalname.split('.').pop();
    const filename = uuidv4() + '_' + file.originalname;
    const fileRef = this.storage.bucket().file(`documents/${filename}`);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const downloadUrl = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    return { link: downloadUrl[0], filename: originalname, extension };
  }

  async uploadMultipleFileDocuments(
    files: Express.Multer.File[],
  ): Promise<{ link: string; filename: string }[]> {
    const uploadedFiles = [];

    for (const file of files) {
      const uploadedFile = await this.uploadFileIntoDocuments(file);
      uploadedFiles.push(uploadedFile);
    }

    return uploadedFiles;
  }

  async uploadFileIntoMessages(
    file: Express.Multer.File,
  ): Promise<{ link: string; filename: string; extension: string }> {
    const originalname = removeVietnameseTones(file.originalname);
    const extension = originalname.split('.').pop();
    const filename = uuidv4() + '_' + file.originalname;
    const fileRef = this.storage.bucket().file(`messages/${filename}`);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const downloadUrl = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    return { link: downloadUrl[0], filename: originalname, extension };
  }
}
