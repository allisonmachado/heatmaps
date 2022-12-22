import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class Bcrypt {
  async hash(text: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(text, salt);
  }

  async compare(string: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(string, hash);
  }
}
