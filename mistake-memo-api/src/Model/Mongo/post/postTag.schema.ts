import mongoose, { HydratedDocument } from 'mongoose';

export const POST_TAG_SCHEMA_NAME = 'post_tag';

export const PostTagSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      alias: 'objectId',
    },
    word: {
      type: String,
      required: true,
      unique: true,
    },
    user_account_ids: {
      type: [String],
      alias: 'userAccountIds',
      required: true,
    },
  },
  { collection: POST_TAG_SCHEMA_NAME },
);

export class PostTagModel {
  public objectId: string;

  public word: string;

  public userAccountIds: string[];

  constructor(objectId: string, word: string, userAccountIds?: string[]) {
    this.objectId = objectId;
    this.word = word;
    this.userAccountIds = userAccountIds;
  }
}

export type PostTagDocument = HydratedDocument<PostTagModel>;
