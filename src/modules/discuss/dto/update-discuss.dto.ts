import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDiscussDTO } from './index';
export class UpdateDiscussDTO extends PartialType(
  OmitType(CreateDiscussDTO, ['createBy']),
) {
  slug?: string;
}
