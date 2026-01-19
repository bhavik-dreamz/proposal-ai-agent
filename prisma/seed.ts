import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'bhavik@dynamicdreamz.com' },
    update: {},
    create: {
      email: 'bhavik@dynamicdreamz.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create regular user
  const userPassword = await hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: Role.USER,
      isActive: true,
    },
  });
  console.log('✅ Regular user created:', user.email);

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: bhavik@dynamicdreamz.com / admin123');
  console.log('   User:  user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
