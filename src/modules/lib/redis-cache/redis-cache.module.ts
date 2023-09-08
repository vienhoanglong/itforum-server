import { Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { RedisCacheService } from './redis-cache.service';

@Module({
  providers: [redisProvider, RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
