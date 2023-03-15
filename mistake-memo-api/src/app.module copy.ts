import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    {
      global: true,
      module: HttpModule,
    },
  ],
})
export class AppModule {}
