import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class UtilService {
  convertToObjectId(id: string): Types.ObjectId {
    try {
      return new Types.ObjectId(id);
    } catch (error) {
      throw new Error('Invalid ObjectId');
    }
  }
}
