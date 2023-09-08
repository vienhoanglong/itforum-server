import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService): RedisClient => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: parseInt(configService.get<string>('REDIS_PORT')),
      password: configService.get<string>('REDIS_PASSWORD'),
    });
  },
  inject: [ConfigService],
};
