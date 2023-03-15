import mongoose, { HydratedDocument } from 'mongoose';

export const POST_SCHEMA_NAME = 'post';

export const PostRefUrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  site_name: {
    type: String,
    alias: 'siteName',
    required: true,
  },
});

export class PostRefUrlModel {
  public url: string;

  public siteName: string;

  constructor(url: string, siteName: string) {
    this.url = url;
    this.siteName = siteName;
  }
}

export const PostSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      alias: 'objectId',
    },
    user_account_id: {
      type: String,
      alias: 'userAccountId',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    is_open: {
      alias: 'isOpen',
      type: Boolean,
      required: true,
    },
    tag_ids: {
      alias: 'tagIds',
      type: [String],
    },
    detail: {
      type: String,
    },
    causes: {
      type: [String],
    },
    prevents: {
      type: [String],
    },
    occurrence_date: {
      alias: 'occurrenceDate',
      type: Date,
    },
    ref_urls: {
      type: [PostRefUrlSchema],
      alias: 'refUrls',
    },
    create_date: {
      alias: 'createDate',
      type: Date,
      required: true,
    },
  },
  { collection: POST_SCHEMA_NAME },
);

export class PostModel {
  public objectId: string;

  public userAccountId: string;

  public title: string;

  public isOpen: boolean;

  public tagIds?: string[];

  public detail?: string;

  public causes?: string[];

  public prevents?: string[];

  public occurrenceDate?: Date;

  public refUrls?: PostRefUrlModel[];

  public createDate: Date;

  constructor(
    objectId: string,
    userAccountId: string,
    title: string,
    isOpen: boolean,
    createDate: Date,
    tagIds?: string[],
    detail?: string,
    causes?: string[],
    prevents?: string[],
    occurrenceDate?: Date,
    refUrls?: PostRefUrlModel[],
  ) {
    this.objectId = objectId;
    this.userAccountId = userAccountId;
    this.title = title;
    this.isOpen = isOpen;
    this.tagIds = tagIds;
    this.detail = detail;
    this.causes = causes;
    this.prevents = prevents;
    this.occurrenceDate = occurrenceDate;
    this.refUrls = refUrls;
    this.createDate = createDate;
  }
}

export type PostDocument = HydratedDocument<PostModel>;
