import { NextRequest, NextResponse } from 'next/server';
import { searchSimilarProposals } from '@/lib/vector-search';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, project_type, limit } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'query is required' },
        { status: 400 }
      );
    }

    const similar = await searchSimilarProposals(
      query,
      project_type,
      limit || 3
    );

    return NextResponse.json({ similar_proposals: similar });
  } catch (error: any) {
    console.error('Error searching similar proposals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search similar proposals' },
      { status: 500 }
    );
  }
}
