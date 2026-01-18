import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding, storeProposalEmbedding, storeSampleProposalEmbedding } from '@/lib/vector-search';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, proposal_id, sample_id } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      );
    }

    // Generate embedding
    const embedding = await generateEmbedding(text);

    // Store embedding if IDs provided
    if (proposal_id) {
      await storeProposalEmbedding(proposal_id, text);
    }

    if (sample_id) {
      await storeSampleProposalEmbedding(sample_id, text);
    }

    return NextResponse.json({
      embedding,
      dimension: embedding.length,
    });
  } catch (error: any) {
    console.error('Error generating embedding:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate embedding' },
      { status: 500 }
    );
  }
}
