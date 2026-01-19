import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';
import { generateEmbedding } from '../lib/vector-search';

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

  // Create sample proposals with embeddings
  console.log('\n📚 Creating sample proposals...');

  const sampleProposals = [
    {
      title: 'E-commerce MERN Stack Application',
      projectType: 'MERN',
      requirementsExcerpt: 'Need a full-featured e-commerce platform with product catalog, shopping cart, payment integration, and admin dashboard',
      fullContent: `# E-commerce Platform Proposal

## Executive Summary
We propose to develop a comprehensive e-commerce platform using the MERN stack (MongoDB, Express, React, Node.js). This solution will provide a seamless shopping experience with modern features.

## Technical Approach
- Frontend: React with Redux for state management
- Backend: Node.js with Express
- Database: MongoDB for flexible product catalog
- Payment: Stripe integration
- Authentication: JWT-based secure login

## Features
1. Product catalog with search and filters
2. Shopping cart and wishlist
3. Secure checkout with multiple payment options
4. User account management
5. Admin dashboard for inventory management
6. Order tracking system
7. Email notifications
8. Mobile responsive design

## Timeline
- Week 1-2: Database design and API development
- Week 3-4: Frontend components and user interface
- Week 5-6: Payment integration and testing
- Week 7-8: Admin dashboard and deployment

## Investment
Total Project Cost: $12,000
Maintenance: $500/month (optional)`,
      cost: 12000,
      timelineWeeks: 8,
      isApproved: true,
    },
    {
      title: 'Business WordPress Website',
      projectType: 'WordPress',
      requirementsExcerpt: 'Professional business website with blog, contact forms, and SEO optimization',
      fullContent: `# Business Website Proposal

## Executive Summary
A modern, professional WordPress website designed to establish your online presence and attract customers.

## Technical Approach
- Platform: WordPress with custom theme
- Hosting: Managed WordPress hosting
- Security: SSL certificate, security plugins
- Performance: Caching and CDN integration

## Features
1. Custom homepage design
2. 5-7 page structure
3. Blog with categories
4. Contact form with email integration
5. SEO optimization
6. Google Analytics integration
7. Social media integration
8. Mobile responsive design
9. Newsletter signup
10. Live chat widget

## Timeline
- Week 1: Design mockups and approval
- Week 2: WordPress setup and theme customization
- Week 3: Content integration and testing
- Week 4: SEO optimization and launch

## Investment
Total Project Cost: $3,500
Hosting: $25/month
Maintenance: $150/month (optional)`,
      cost: 3500,
      timelineWeeks: 4,
      isApproved: true,
    },
    {
      title: 'Custom Shopify E-commerce Store',
      projectType: 'Shopify',
      requirementsExcerpt: 'Online store for selling handmade products with custom theme and payment processing',
      fullContent: `# Shopify Store Development Proposal

## Executive Summary
We will create a stunning Shopify store optimized for selling handmade products with a focus on user experience and conversions.

## Technical Approach
- Platform: Shopify Plus
- Custom theme development
- Payment gateway integration
- Shipping integration

## Features
1. Custom Shopify theme design
2. Product catalog with variants
3. Shopping cart and checkout
4. Multiple payment options
5. Shipping calculator
6. Discount codes and promotions
7. Customer account system
8. Email marketing integration
9. Inventory management
10. Sales analytics

## Timeline
- Week 1: Store setup and theme customization
- Week 2: Product upload and configuration
- Week 3: Payment and shipping setup
- Week 4: Testing and launch

## Investment
Total Project Cost: $4,500
Shopify Plan: $79/month
Apps: ~$50/month`,
      cost: 4500,
      timelineWeeks: 4,
      isApproved: true,
    },
  ];

  for (const sample of sampleProposals) {
    const textToEmbed = `${sample.title} ${sample.requirementsExcerpt} ${sample.fullContent}`.substring(0, 5000);
    const embedding = await generateEmbedding(textToEmbed);

    // Check if already exists
    const existing = await prisma.sampleProposal.findFirst({
      where: { title: sample.title },
    });

    if (!existing) {
      await prisma.sampleProposal.create({
        data: {
          ...sample,
          embedding: JSON.stringify(embedding),
        },
      });
      console.log(`  ✅ Created: ${sample.title}`);
    } else {
      console.log(`  ⏭️  Skipped (exists): ${sample.title}`);
    }
  }

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
