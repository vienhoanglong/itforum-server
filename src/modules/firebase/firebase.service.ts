import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseConfigService } from 'src/config/firebase.config';
@Injectable()
export class FirebaseService {
  private storage: admin.storage.Storage;

  constructor(private firebaseConfigService: FirebaseConfigService) {
    const firebaseConfig = this.firebaseConfigService.getFirebaseConfig();
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: firebaseConfig.storageBucket,
    });

    this.storage = admin.storage();
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
}
