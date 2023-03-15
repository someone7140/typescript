import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostTagDocument,
  PostTagModel,
  POST_TAG_SCHEMA_NAME,
} from 'src/Model/Mongo/post/postTag.schema';

@Injectable()
export class PostTagRepository {
  constructor(
    @InjectModel(POST_TAG_SCHEMA_NAME)
    private postTagModel: Model<PostTagDocument>,
  ) {}

  async createTag(
    objectId: string,
    word: string,
    userAccountId: string,
  ): Promise<void> {
    await this.postTagModel.create(
      new PostTagModel(objectId, word, [userAccountId]),
    );
  }

  async getTagsFromWords(words: string[]): Promise<PostTagModel[]> {
    return await this.postTagModel.find({
      word: { $in: words },
    });
  }

  async getTagsFromStartWordAndUserAccountIds(
    word: string,
    userAccountIds: string[],
  ): Promise<PostTagModel[]> {
    return await this.postTagModel.find({
      user_account_ids: { $in: userAccountIds },
      word: new RegExp('^' + word),
    });
  }

  async updateTagUserAccountIds(
    objectId: string,
    userAccountIds: string[],
  ): Promise<void> {
    await this.postTagModel.updateOne(
      {
        _id: objectId,
      },
      { $set: { user_account_ids: userAccountIds } },
      { runValidator: true },
    );
  }
}
