import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FirebaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  getFirebaseConfig() {
    return {
      projectId: this.configService.get<string>('YOUR_PROJECT_ID'),
      privateKey: this.configService.get<string>('YOUR_PRIVATE_KEY'),
      clientEmail: this.configService.get<string>('YOUR_CLIENT_EMAIL'),
      storageBucket: this.configService.get<string>(
        'YOUR_FIREBASE_STORAGE_BUCKET',
      ),
    };
  }
}
