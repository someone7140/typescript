import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserAccountAuthModel,
  UserAccountDocument,
  UserAccountModel,
  USER_ACCOUNT_SCHEMA_NAME,
} from 'src/Model/Mongo/userAccount/userAccount.schema';

@Injectable()
export class UserAccountRepository {
  constructor(
    @InjectModel(USER_ACCOUNT_SCHEMA_NAME)
    private userAccountModel: Model<UserAccountDocument>,
  ) {}

  async createUserAccount(
    objectId: string,
    userId: string,
    userName: string,
    description?: string,
    iconImageUrl?: string,
    gmail?: string,
  ): Promise<UserAccountModel> {
    return await this.userAccountModel.create(
      new UserAccountModel(
        objectId,
        userId,
        userName,
        new UserAccountAuthModel(gmail),
        description,
        iconImageUrl,
      ),
    );
  }

  async findByObjectId(objectId: string): Promise<UserAccountModel> {
    return await this.userAccountModel.findOne({ _id: objectId });
  }

  async findByUserId(userId: string): Promise<UserAccountModel> {
    return await this.userAccountModel.findOne({ user_id: userId });
  }

  async findByGmail(gmail: string): Promise<UserAccountModel> {
    return await this.userAccountModel.findOne({ 'auth_info.gmail': gmail });
  }
}
