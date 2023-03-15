import {
  Body,
  Controller,
  Request,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/Auth/jwtAuth.guard';
import { CreatePostRequestDto } from 'src/Model/Request/post/createPost.request.dto';
import { GetSiteNameFromUrlRequestDto } from 'src/Model/Request/post/getSiteNameFromUrl.request.dto';
import { GetTagsFromStartWordRequestDto } from 'src/Model/Request/post/getTagsFromStartWord.request.dto';
import { PostTagResponseDto } from 'src/Model/Response/post/postTag.response.dto';
import { PostService } from 'src/Service/post.service';
import { UrlService } from 'src/Service/url.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly urlService: UrlService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPost(
    @Request() req: any,
    @Body() dto: CreatePostRequestDto,
  ): Promise<string> {
    try {
      if (!req?.user?.id) {
        throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
      }

      await this.postService.createPost(
        req?.user?.id,
        dto.title,
        dto.isOpen,
        dto.tagWords,
        dto.detail,
        dto.causes,
        dto.prevents,
        dto.occurrenceDate,
        dto.refUrls,
      );
      return 'success';
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

  @Post('getTagsFromStartWord')
  async getTagsFromStartWord(
    @Request() req: any,
    @Body() dto: GetTagsFromStartWordRequestDto,
  ): Promise<PostTagResponseDto[]> {
    try {
      return await this.postService.getTagsFromStartWordAndUserAccountIds(
        dto.word,
        undefined,
      );
    } catch (e) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('getTagsFromStartWordWithAuth')
  async getTagsFromStartWordWithAuth(
    @Request() req: any,
    @Body() dto: GetTagsFromStartWordRequestDto,
  ): Promise<PostTagResponseDto[]> {
    try {
      return await this.postService.getTagsFromStartWordAndUserAccountIds(
        dto.word,
        req?.user?.id,
      );
    } catch (e) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('getSiteNameFromUrl')
  async getSiteNameFromUrl(
    @Request() req: any,
    @Body() dto: GetSiteNameFromUrlRequestDto,
  ): Promise<string> {
    try {
      return await this.urlService.getSiteNameFromUrl(dto.url);
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
