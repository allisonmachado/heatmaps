import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class Bcrypt {
  compare: typeof bcrypt.compare;

  constructor() {
    this.compare = bcrypt.compare;
  }

  async hash(text: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(text, salt);
  }
}
