import { PartialType } from '@nestjs/swagger';
import { CreateTopicDTO } from './topic-create.dto';

export class UpdateTopicDTO extends PartialType(CreateTopicDTO) {}
