import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostDocument,
  PostModel,
  PostRefUrlModel,
  POST_SCHEMA_NAME,
} from 'src/Model/Mongo/post/post.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(POST_SCHEMA_NAME)
    private postModel: Model<PostDocument>,
  ) {}

  async createPost(
    objectId: string,
    userAccountId: string,
    title: string,
    isOpen: boolean,
    tagIds?: string[],
    detail?: string,
    causes?: string[],
    prevents?: string[],
    occurrenceDate?: Date,
    refUrls?: PostRefUrlModel[],
  ): Promise<void> {
    const now = new Date();
    await this.postModel.create(
      new PostModel(
        objectId,
        userAccountId,
        title,
        isOpen,
        now,
        tagIds,
        detail,
        causes,
        prevents,
        occurrenceDate,
        refUrls,
      ),
    );
  }
}
