import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseService } from '../lib/firebase/firebase.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MailService } from '../lib/mail/mail.service';
import { SendMailDTO } from './dto/send-mail.dto';
import { templateVerificationEmail } from 'src/constants/helper';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { FindUsersByListIdDto } from './dto/find-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(RoleGuard)
  @Roles(0)
  @ApiBearerAuth()
  @Get('all-users')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/list-user')
  @ApiOperation({ summary: 'Get list user by list userId' })
  getListTopicByListId(@Query() findUsersByListIdDto: FindUsersByListIdDto) {
    return this.userService.getListUserByListId(findUsersByListIdDto.listId);
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('list-avatar')
  listAvatar() {
    return this.firebaseService.getListAvatar();
  }

  @Get('email')
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmailNotPass(email);
  }
  @UseGuards(RoleGuard)
  @Roles(0)
  @ApiBearerAuth()
  @Get('reset-password/:id')
  resetPassword(@Query('id') id: string) {
    return this.userService.resetPassword(id);
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File/Image',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const publicUrl = this.firebaseService.uploadFile(file);
    return publicUrl;
  }

  @Post('send-otp')
  sendOTP(@Body() sendMailDto: SendMailDTO) {
    const html = templateVerificationEmail(
      sendMailDto.content,
      sendMailDto.otp,
    );
    return this.mailService.sendMail(
      sendMailDto.email,
      sendMailDto.subject,
      html,
    );
  }
}
