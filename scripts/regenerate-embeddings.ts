import { PrismaClient } from '@prisma/client';
import { generateEmbedding } from '../lib/vector-search';

const prisma = new PrismaClient();

async function regenerateEmbeddings() {
  console.log('🔄 Regenerating embeddings for sample proposals...\n');

  try {
    // Get all sample proposals
    const proposals = await prisma.sampleProposal.findMany();

    if (proposals.length === 0) {
      console.log('⚠️  No sample proposals found in database');
      return;
    }

    console.log(`📊 Found ${proposals.length} sample proposals\n`);

    let updated = 0;
    let failed = 0;

    for (const proposal of proposals) {
      try {
        // Create text to embed
        const textToEmbed = `${proposal.title} ${proposal.requirementsExcerpt || ''} ${proposal.fullContent}`.substring(0, 5000);
        
        // Generate embedding
        const embedding = await generateEmbedding(textToEmbed);
        
        // Update in database
        await prisma.sampleProposal.update({
          where: { id: proposal.id },
          data: { embedding: JSON.stringify(embedding) },
        });

        console.log(`✅ Updated: ${proposal.title}`);
        updated++;
      } catch (error) {
        console.error(`❌ Failed: ${proposal.title}`, error);
        failed++;
      }
    }

    console.log('\n📈 Summary:');
    console.log(`   ✅ Successfully updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total: ${proposals.length}`);
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

regenerateEmbeddings()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
