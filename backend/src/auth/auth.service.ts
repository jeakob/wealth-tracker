import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    // TODO: Validate user from DB
    // Example only:
    const user = { id: 1, email };
    const payload = { sub: user.id, email: user.email };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
