import { prisma } from './prisma';
import { openai } from './openai';
import type { SearchResult } from '@/types';

/**
 * Generate embedding using OpenAI text-embedding-3-small model
 * Provides high-quality semantic embeddings for proposal search
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8191), // API limit
      encoding_format: 'float' as const,
    });

    const embedding = response.data[0].embedding;
    return Array.isArray(embedding) ? embedding : [];
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Fallback to simple embedding if API fails
    return generateSimpleEmbedding(text);
  }
}

/**
 * Simple fallback embedding (used if OpenAI API fails)
 */
function generateSimpleEmbedding(text: string): number[] {
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const embedding: number[] = [];
  for (let i = 0; i < 1536; i++) {
    embedding.push(Math.sin(hash + i) * 100);
  }
  return embedding;
}

/**
 * Search for similar proposals from both sample proposals and previous proposals
 * Uses OpenAI embeddings for semantic similarity
 * Returns detailed search results with relevance scores
 */
export async function searchSimilarProposals(
  query: string,
  projectType?: string,
  limit: number = 3
): Promise<SearchResult[]> {
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
        take: limit * 3,
      }),
      prisma.proposal.findMany({
        where: {
          status: { in: ['completed', 'approved'] },
          ...(projectType && { projectType }),
        },
        take: limit * 3,
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
          proposal: { ...p, cost: p.cost ? Number(p.cost) : undefined },
          similarity,
          source: 'sample' as const,
          title: p.title,
          relevance: getRelevanceLevel(similarity),
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
          proposal: p,
          similarity,
          source: 'previous' as const,
          title: p.clientName,
          relevance: getRelevanceLevel(similarity),
        };
      })
      .filter((p) => p !== null);

    // Combine, sort by similarity, and limit results
    const combined = [
      ...sampleWithSimilarity,
      ...previousWithSimilarity,
    ]
      .sort((a, b) => (b?.similarity || 0) - (a?.similarity || 0))
      .slice(0, limit);

    if (combined.length > 0) {
      return combined as SearchResult[];
    }

    // Fallback if no embeddings
    return await fallbackCombinedSearch(query, projectType, limit);
  } catch (error) {
    console.error('Error in vector search:', error);
    return await fallbackCombinedSearch(query, projectType, limit);
  }
}

/** * Calculate text similarity using simple string matching
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;

  // Simple word overlap calculation
  const words1 = new Set(text1.split(/\s+/).filter((w) => w.length > 3));
  const words2 = new Set(text2.split(/\s+/).filter((w) => w.length > 3));

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return union.size > 0 ? intersection.size / union.size : 0;
}

/** * Determine relevance level based on similarity score
 */
function getRelevanceLevel(similarity: number): 'high' | 'medium' | 'low' {
  if (similarity >= 0.7) return 'high';
  if (similarity >= 0.5) return 'medium';
  return 'low';
}

/**
 * Fallback combined search from both sample and previous proposals
 * Uses text-based matching when embeddings are unavailable
 */
async function fallbackCombinedSearch(
  query: string,
  projectType?: string,
  limit: number = 3
): Promise<SearchResult[]> {
  const queryLower = query.toLowerCase();

  // Fetch from both tables
  const [samples, previous] = await Promise.all([
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

  // Simple text-based matching for fallback
  const scored: SearchResult[] = [
    ...(samples || []).map((p) => {
      const similarity = calculateTextSimilarity(queryLower, (p.fullContent || '').toLowerCase());
      return {
        proposal: { ...p, cost: p.cost ? Number(p.cost) : undefined } as Record<string, unknown>,
        similarity,
        source: 'sample' as const,
        title: p.title,
        relevance: getRelevanceLevel(similarity),
      };
    }),
    ...(previous || []).map((p) => {
      const similarity = calculateTextSimilarity(queryLower, (p.requirements || '').toLowerCase());
      return {
        proposal: p as Record<string, unknown>,
        similarity,
        source: 'previous' as const,
        title: p.clientName || '',
        relevance: getRelevanceLevel(similarity),
      };
    }),
  ]
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return scored as SearchResult[];
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
