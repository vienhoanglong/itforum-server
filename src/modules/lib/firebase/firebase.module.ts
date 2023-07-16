import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseConfigService } from 'src/config/firebase.config';

@Module({
  providers: [FirebaseService, FirebaseConfigService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
