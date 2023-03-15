import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtManagementService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  getJwtToken(signObject: object, expiresStr: string): string {
    return this.jwtService.sign(signObject, {
      expiresIn: expiresStr,
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
