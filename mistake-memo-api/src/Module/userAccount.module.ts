import { Module } from '@nestjs/common';
import { UserAccountRepository } from 'src/Repository/userAccount.repository';
import { JwtStrategy } from 'src/Auth/jwtAuth.strategy';
import { UserAccountController } from 'src/Controller/userAccount.controller';
import { FileUploadService } from 'src/Service/fileUpload.service';
import { JwtManagementService } from 'src/Service/jwtManagement.service';
import { UserAccountService } from 'src/Service/userAccount.service';

@Module({
  imports: [],
  controllers: [UserAccountController],
  providers: [
    JwtStrategy,
    FileUploadService,
    JwtManagementService,
    UserAccountService,
    UserAccountRepository,
  ],
})
export class UserAccountModule {}
