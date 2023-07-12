import { SetMetadata } from '@nestjs/common';

export const Roles = (...role: number[]) => SetMetadata('roles', role);
