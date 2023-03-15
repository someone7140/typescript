import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { PostTagRepository } from 'src/Repository/postTag.repository';
import { PostRepository } from 'src/Repository/post.repository';
import { CreatePostRequestRefUrlDto } from 'src/Model/Request/post/createPost.request.dto';
import { PostTagResponseDto } from 'src/Model/Response/post/postTag.response.dto';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private postTagRepository: PostTagRepository,
  ) {}

  USER_ACCOUNT_ID_ALL = 'all';

  async createPost(
    userAccountId: string,
    title: string,
    isOpen: boolean,
    tagWords?: string[],
    detail?: string,
    causes?: string[],
    prevents?: string[],
    occurrenceDate?: Date,
    refUrls?: CreatePostRequestRefUrlDto[],
  ): Promise<void> {
    const tagIds: string[] = [];
    // タグの設定
    if (tagWords && tagWords.length > 0) {
      // タグのワードで検索
      const registeredTags = await this.postTagRepository.getTagsFromWords(
        tagWords,
      );
      for (const tagWord of tagWords) {
        // すでに登録があるタグかどうか
        const registeredTag = registeredTags.find(
          (rTag) => rTag.word === tagWord,
        );
        if (registeredTag) {
          if (isOpen) {
            // 公開可でユーザにallが含まれてない場合はallにする
            if (
              !registeredTag.userAccountIds.some(
                (id) => id === this.USER_ACCOUNT_ID_ALL,
              )
            ) {
              await this.postTagRepository.updateTagUserAccountIds(
                registeredTag.objectId,
                [this.USER_ACCOUNT_ID_ALL],
              );
            }
          } else {
            // 自分のユーザIDが含まれてなければ追加
            if (
              !registeredTag.userAccountIds.some((id) => id === userAccountId)
            ) {
              await this.postTagRepository.updateTagUserAccountIds(
                registeredTag.objectId,
                [...registeredTag.userAccountIds, userAccountId],
              );
            }
          }
          tagIds.push(registeredTag.objectId);
        } else {
          // タグを新規登録
          const objectId = uuidv4();
          await this.postTagRepository.createTag(
            objectId,
            tagWord,
            isOpen ? this.USER_ACCOUNT_ID_ALL : userAccountId,
          );
          tagIds.push(objectId);
        }
      }
    }

    // 投稿の登録
    const objectId = uuidv4();
    await this.postRepository.createPost(
      objectId,
      userAccountId,
      title,
      isOpen,
      tagIds,
      detail,
      causes,
      prevents,
      occurrenceDate,
      refUrls,
    );
  }

  async getTagsFromStartWordAndUserAccountIds(
    words: string,
    userAccountId?: string,
  ): Promise<PostTagResponseDto[]> {
    const userAccountIds = [this.USER_ACCOUNT_ID_ALL];
    if (userAccountId) {
      userAccountIds.push(userAccountId);
    }
    const postTagModels =
      await this.postTagRepository.getTagsFromStartWordAndUserAccountIds(
        words,
        userAccountIds,
      );
    return postTagModels.map(
      (model) => new PostTagResponseDto(model.objectId, model.word),
    );
  }
}
