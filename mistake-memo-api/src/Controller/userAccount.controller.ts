import {
  Body,
  Controller,
  Request,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/Auth/jwtAuth.guard';
import { CreateUserAccountRequestDto } from 'src/Model/Request/userAccount/createUserAccount.request.dto';
import { GoogleTokenRequestDto } from 'src/Model/Request/userAccount/googleToken.request.dto';
import { UserAccountService } from 'src/Service/userAccount.service';

@Controller('userAccount')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Post('loginByGoogle')
  async loginByGoogle(@Body() dto: GoogleTokenRequestDto): Promise<object> {
    try {
      const res = await this.userAccountService.getUserAccountByGoogleToken(
        dto.idToken,
      );
      if (!res) {
        throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
      }
      return res;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verifyGoogleToken')
  async verifyGoogleToken(@Body() dto: GoogleTokenRequestDto): Promise<object> {
    try {
      const jwtSecret = await this.userAccountService.verifyGoogleToken(
        dto.idToken,
      );
      return { authGoogleToken: jwtSecret };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('iconImage'))
  async createUserAccount(
    @Request() req: any,
    @Body() dto: CreateUserAccountRequestDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<object> {
    try {
      const res = await this.userAccountService.createUserAccount(
        dto.userId,
        dto.userName,
        dto.description,
        file,
        req?.user?.gmail,
      );
      return res;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMyUser')
  async getMyUser(@Request() req: any): Promise<object> {
    try {
      if (!req?.user?.id) {
        throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
      }
      const res = await this.userAccountService.getUserAccountByObjectId(
        req?.user?.id,
      );
      if (!res) {
        throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
      }
      return res;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
