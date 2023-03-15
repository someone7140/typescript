import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PostTagSchema,
  POST_TAG_SCHEMA_NAME,
} from 'src/Model/Mongo/post/postTag.schema';
import {
  UserAccountSchema,
  USER_ACCOUNT_SCHEMA_NAME,
} from 'src/Model/Mongo/userAccount/userAccount.schema';
import { PostModule } from 'src/Module/post.module';
import { UserAccountModule } from 'src/Module/userAccount.module';
import { PostSchema, POST_SCHEMA_NAME } from './Model/Mongo/post/post.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 他のクラスで、ConfigServiceを使えるようにする
      isGlobal: true,
      // ロードするenvファイルを指定する
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    {
      ...MongooseModule.forFeature([
        { name: USER_ACCOUNT_SCHEMA_NAME, schema: UserAccountSchema },
        { name: POST_SCHEMA_NAME, schema: PostSchema },
        { name: POST_TAG_SCHEMA_NAME, schema: PostTagSchema },
      ]),
      global: true,
    },
    {
      ...JwtModule.register({}),
      global: true,
    },
    {
      global: true,
      module: HttpModule,
    },
    UserAccountModule,
    PostModule,
  ],
})
export class AppModule {}
