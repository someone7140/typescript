import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/Auth/jwtAuth.strategy';
import { JwtManagementService } from 'src/Service/jwtManagement.service';
import { PostController } from 'src/Controller/post.controller';
import { PostRepository } from 'src/Repository/post.repository';
import { PostTagRepository } from 'src/Repository/postTag.repository';
import { UserAccountRepository } from 'src/Repository/userAccount.repository';
import { PostService } from 'src/Service/post.service';
import { UrlService } from 'src/Service/url.service';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [
    JwtStrategy,
    JwtManagementService,
    PostService,
    UrlService,
    PostRepository,
    PostTagRepository,
    UserAccountRepository,
  ],
})
export class PostModule {}
