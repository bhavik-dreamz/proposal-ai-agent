import { prisma } from './prisma';
import type { SampleProposal, Proposal } from '@/types';

/**
 * Generate embedding for a text
 * Note: Groq doesn't support embeddings, so we'll use a simple text-based approach
 * For production, consider using a separate embedding service like Hugging Face or Voyage AI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Simple hash-based embedding (not production-grade)
  // In production, you'd use a dedicated embedding service
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Generate a simple embedding vector
  const embedding: number[] = [];
  for (let i = 0; i < 8; i++) {
    embedding.push(Math.sin(hash + i) * 100);
  }
  return embedding;
}

/**
 * Search for similar proposals using vector similarity
 */
export async function searchSimilarProposals(
  query: string,
  projectType?: string,
  limit: number = 3
): Promise<SampleProposal[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Fetch sample proposals from database
    const proposals = await prisma.sampleProposal.findMany({
      where: {
        isApproved: true,
        ...(projectType && { projectType }),
      },
      take: limit * 2, // Get more results to filter
    });

    if (!proposals || proposals.length === 0) {
      return await fallbackTextSearch(query, projectType, limit);
    }

    // If embeddings exist, calculate cosine similarity
    const proposalsWithSimilarity = proposals
      .filter((p) => p.embedding)
      .map((p) => {
        const embeddingArray = p.embedding ? JSON.parse(p.embedding) : null;
        if (!embeddingArray) return null;
        const similarity = cosineSimilarity(queryEmbedding, embeddingArray);
        return { 
          ...p, 
          cost: p.cost ? Number(p.cost) : undefined,
          similarity 
        };
      })
      .filter((p) => p !== null)
      .sort((a, b) => (b!.similarity || 0) - (a!.similarity || 0))
      .slice(0, limit)
      .map(({ similarity, ...proposal }) => proposal);

    if (proposalsWithSimilarity.length > 0) {
      return proposalsWithSimilarity as any as SampleProposal[];
    }

    // Fallback if no embeddings
    return await fallbackTextSearch(query, projectType, limit);
  } catch (error) {
    console.error('Error in vector search:', error);
    return await fallbackTextSearch(query, projectType, limit);
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Fallback text-based search if vector search is not available
 */
async function fallbackTextSearch(
  query: string,
  projectType?: string,
  limit: number = 3
): Promise<SampleProposal[]> {
  const proposals = await prisma.sampleProposal.findMany({
    where: {
      isApproved: true,
      ...(projectType && { projectType }),
    },
    take: limit,
  });

  return proposals.map(p => ({
    ...p,
    cost: p.cost ? Number(p.cost) : undefined,
  })) as any as SampleProposal[];
}

/**
 * Store embedding for a proposal
 */
export async function storeProposalEmbedding(
  proposalId: string,
  text: string
): Promise<void> {
  try {
    const embedding = await generateEmbedding(text);

    await prisma.proposal.update({
      where: { id: proposalId },
      data: { embedding: JSON.stringify(embedding) },
    });
  } catch (error) {
    console.error('Error generating/storing embedding:', error);
  }
}

/**
 * Store embedding for a sample proposal
 */
export async function storeSampleProposalEmbedding(
  sampleId: string,
  text: string
): Promise<void> {
  try {
    const embedding = await generateEmbedding(text);

    await prisma.sampleProposal.update({
      where: { id: sampleId },
      data: { embedding: JSON.stringify(embedding) },
    });
  } catch (error) {
    console.error('Error generating/storing sample embedding:', error);
  }
}
