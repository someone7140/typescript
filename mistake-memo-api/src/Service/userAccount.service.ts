import * as pathLib from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';

import { UserAccountModel } from 'src/Model/Mongo/userAccount/userAccount.schema';
import { UserAccountResponseDto } from 'src/Model/Response/userAccount/userAccount.response.dto';
import { UserAccountRepository } from 'src/Repository/userAccount.repository';
import { FileUploadService } from 'src/Service/fileUpload.service';
import { JwtManagementService } from 'src/Service/jwtManagement.service';

@Injectable()
export class UserAccountService {
  constructor(
    private configService: ConfigService,
    private fileUploadService: FileUploadService,
    private jwtManagementService: JwtManagementService,
    private userAccountRepository: UserAccountRepository,
  ) {}

  ICON_IMAGE_FOLDER = 'icon_image';

  async findByObjectId(objectId: string): Promise<UserAccountModel> {
    return await this.userAccountRepository.findByObjectId(objectId);
  }

  async findByUserId(userId: string): Promise<UserAccountModel> {
    return await this.userAccountRepository.findByUserId(userId);
  }

  async findByGmail(gmail: string): Promise<UserAccountModel> {
    return await this.userAccountRepository.findByGmail(gmail);
  }

  async getUserModelByGoogleToken(
    idToken: string,
  ): Promise<[UserAccountModel, string]> {
    const client = new OAuth2Client(
      this.configService.get<string>('JWT_SECRET'),
    );
    const ticket = await client.verifyIdToken({
      idToken,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });

    const gmail = ticket.getPayload().email;
    const findUserAccount = await this.findByGmail(gmail);
    return [findUserAccount, gmail];
  }

  getUserAccountResponse(
    userAccount: UserAccountModel,
  ): UserAccountResponseDto {
    // トークンの有効期限は90日
    const token = this.jwtManagementService.getJwtToken(
      { id: userAccount.objectId },
      '90d',
    );
    return new UserAccountResponseDto(
      token,
      userAccount.userId,
      userAccount.userName,
      userAccount.iconImageUrl,
    );
  }

  async getUserAccountByObjectId(
    objectId: string,
  ): Promise<UserAccountResponseDto | undefined> {
    const userModel = await this.findByObjectId(objectId);
    return userModel ? this.getUserAccountResponse(userModel) : undefined;
  }

  async getUserAccountByGoogleToken(
    idToken: string,
  ): Promise<UserAccountResponseDto> {
    const [userModel] = await this.getUserModelByGoogleToken(idToken);
    return userModel ? this.getUserAccountResponse(userModel) : undefined;
  }

  async verifyGoogleToken(idToken: string): Promise<string> {
    const [findUserModel, gmail] = await this.getUserModelByGoogleToken(
      idToken,
    );
    if (findUserModel) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    // 2時間期限でjwtトークンを作成
    return this.jwtManagementService.getJwtToken({ gmail: gmail }, '2h');
  }

  async createUserAccount(
    userId: string,
    userName: string,
    description?: string,
    file?: Express.Multer.File,
    gmail?: string,
  ): Promise<UserAccountResponseDto> {
    const findUserAccount = await this.findByUserId(userId);
    if (findUserAccount) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
    const objectId = uuidv4();
    let iconImageUrl: string | undefined = undefined;

    if (file) {
      const filePath = `${this.ICON_IMAGE_FOLDER}/${objectId}${pathLib.extname(
        file.originalname,
      )}`;
      await this.fileUploadService.deleteFileGcs(filePath);
      iconImageUrl = await this.fileUploadService.addFileToGcs(file, filePath);
    }
    const userAccount = await this.userAccountRepository.createUserAccount(
      objectId,
      userId,
      userName,
      description,
      iconImageUrl,
      gmail,
    );
    return this.getUserAccountResponse(userAccount);
  }
}
