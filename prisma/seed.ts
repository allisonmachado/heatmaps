import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = faker.internet.userName().toLocaleLowerCase();
  const email = faker.internet.email().toLocaleLowerCase();
  const password = await bcrypt.hash('123456', await bcrypt.genSalt(10));

  await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
}

(async () => {
  main();
})();
