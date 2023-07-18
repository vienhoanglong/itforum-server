import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseConfigService } from 'src/config/firebase.config';
import { Bucket, File } from '@google-cloud/storage';
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
  async uploadFile(file: Express.Multer.File): Promise<object> {
    const storageBucket = this.storage.bucket();
    const filename = file.originalname;
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
    return { link: downloadUrl.toString() };
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
}
