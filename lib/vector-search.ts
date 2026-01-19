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
 * Search for similar proposals from both sample proposals and previous proposals
 * Uses vector similarity to find the most relevant matches
 */
export async function searchSimilarProposals(
  query: string,
  projectType?: string,
  limit: number = 3
): Promise<(SampleProposal | Proposal)[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search both sample proposals and previous proposals in parallel
    const [sampleProposals, previousProposals] = await Promise.all([
      prisma.sampleProposal.findMany({
        where: {
          isApproved: true,
          ...(projectType && { projectType }),
        },
        take: limit * 2,
      }),
      prisma.proposal.findMany({
        where: {
          status: { in: ['completed', 'approved'] },
          ...(projectType && { projectType }),
        },
        take: limit * 2,
      }),
    ]);

    // Calculate similarity for sample proposals
    const sampleWithSimilarity = (sampleProposals || [])
      .filter((p) => p.embedding)
      .map((p) => {
        const embeddingArray = p.embedding ? JSON.parse(p.embedding) : null;
        if (!embeddingArray) return null;
        const similarity = cosineSimilarity(queryEmbedding, embeddingArray);
        return {
          ...p,
          cost: p.cost ? Number(p.cost) : undefined,
          similarity,
          source: 'sample' as const,
        };
      })
      .filter((p) => p !== null);

    // Calculate similarity for previous proposals
    const previousWithSimilarity = (previousProposals || [])
      .filter((p) => p.embedding)
      .map((p) => {
        const embeddingArray = p.embedding ? JSON.parse(p.embedding) : null;
        if (!embeddingArray) return null;
        const similarity = cosineSimilarity(queryEmbedding, embeddingArray);
        return {
          ...p,
          similarity,
          source: 'previous' as const,
        };
      })
      .filter((p) => p !== null);

    // Combine and sort by similarity, prioritizing samples then previous
    const combined = [
      ...sampleWithSimilarity.map(p => ({ ...p, isSample: true })),
      ...previousWithSimilarity.map(p => ({ ...p, isSample: false })),
    ]
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, limit)
      .map(({ similarity, source, isSample, ...proposal }) => proposal);

    if (combined.length > 0) {
      return combined as any as (SampleProposal | Proposal)[];
    }

    // Fallback if no embeddings
    return await fallbackCombinedSearch(query, projectType, limit);
  } catch (error) {
    console.error('Error in vector search:', error);
    return await fallbackCombinedSearch(query, projectType, limit);
  }
}

/**
 * Fallback combined search from both sample and previous proposals
 */
async function fallbackCombinedSearch(
  query: string,
  projectType?: string,
  limit: number = 3
): Promise<(SampleProposal | Proposal)[]> {
  const queryLower = query.toLowerCase();

  // Fetch from both tables
  const [samples, previous] = await Promise.all([
    prisma.sampleProposal.findMany({
      where: {
        isApproved: true,
        ...(projectType && { projectType }),
      },
      take: limit,
    }),
    prisma.proposal.findMany({
      where: {
        status: { in: ['completed', 'approved'] },
        ...(projectType && { projectType }),
      },
      take: limit,
    }),
  ]);

  // Simple text-based matching for fallback
  const scored = [
    ...(samples || []).map((p) => ({
      ...p,
      cost: p.cost ? Number(p.cost) : undefined,
      score: calculateTextSimilarity(queryLower, (p.fullContent || p.full_content || '').toLowerCase()),
    })),
    ...(previous || []).map((p) => ({
      ...p,
      score: calculateTextSimilarity(queryLower, (p.requirements || '').toLowerCase()),
    })),
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...p }) => p);

  return scored as any as (SampleProposal | Proposal)[];
}

/**
 * Calculate simple text similarity score
 */
function calculateTextSimilarity(query: string, text: string): number {
  const queryWords = query.split(/\s+/).filter(w => w.length > 3);
  if (queryWords.length === 0) return 0;

  const matches = queryWords.filter(word => text.includes(word)).length;
  return matches / queryWords.length;
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
