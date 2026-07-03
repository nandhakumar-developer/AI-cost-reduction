import { PrismaClient } from '@prisma/client';
import { addHours } from '../src/utils/helpers.js';
import { PLAN_LIMITS } from '../src/config/constants.js';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@markitdown.local' },
    update: {},
    create: {
      googleId: 'admin_seed',
      email: 'admin@markitdown.local',
      name: 'Admin User',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=3525cd&color=fff',
      role: 'ADMIN',
      plan: 'PRO',
    },
  });

  await prisma.usage.upsert({
    where: { userId: admin.id },
    create: {
      userId: admin.id,
      usedBytes: 0,
      cycleCount: 0,
      resetAt: addHours(new Date(), PLAN_LIMITS.PRO.resetHours),
    },
    update: {},
  });

  console.log('Seeded admin user:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
