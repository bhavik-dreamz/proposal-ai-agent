import { openai } from './openai';
import { supabaseAdmin } from './supabase';
import type { SampleProposal, Proposal } from '@/types';

/**
 * Generate embedding for a text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
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

    // Build the query with RPC call for vector similarity
    // Note: This requires a function in Supabase for vector similarity search
    // For now, we'll use a fallback approach
    let queryBuilder = supabaseAdmin
      .from('sample_proposals')
      .select('*')
      .eq('is_approved', true)
      .limit(limit * 2); // Get more results to filter

    if (projectType) {
      queryBuilder = queryBuilder.eq('project_type', projectType);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error searching similar proposals:', error);
      return await fallbackTextSearch(query, projectType, limit);
    }

    if (!data || data.length === 0) {
      return await fallbackTextSearch(query, projectType, limit);
    }

    // If embeddings exist, calculate cosine similarity
    const proposalsWithSimilarity = data
      .filter((p) => p.embedding && Array.isArray(p.embedding))
      .map((p) => {
        const similarity = cosineSimilarity(queryEmbedding, p.embedding as number[]);
        return { ...p, similarity };
      })
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, limit)
      .map(({ similarity, ...proposal }) => proposal);

    if (proposalsWithSimilarity.length > 0) {
      return proposalsWithSimilarity as SampleProposal[];
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
  let queryBuilder = supabaseAdmin
    .from('sample_proposals')
    .select('*')
    .eq('is_approved', true)
    .limit(limit);

  if (projectType) {
    queryBuilder = queryBuilder.eq('project_type', projectType);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error('Error in fallback search:', error);
    return [];
  }

  return (data || []) as SampleProposal[];
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

    const { error } = await supabaseAdmin
      .from('proposals')
      .update({ embedding })
      .eq('id', proposalId);

    if (error) {
      console.error('Error storing embedding:', error);
    }
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

    const { error } = await supabaseAdmin
      .from('sample_proposals')
      .update({ embedding })
      .eq('id', sampleId);

    if (error) {
      console.error('Error storing sample embedding:', error);
    }
  } catch (error) {
    console.error('Error generating/storing sample embedding:', error);
  }
}
