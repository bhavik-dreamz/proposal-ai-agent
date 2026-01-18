import { NextRequest, NextResponse } from 'next/server';
import { generateProposal } from '@/lib/proposal-generator';
import { storeProposalEmbedding } from '@/lib/vector-search';
import { supabaseAdmin } from '@/lib/supabase';
import type { ProposalGenerationRequest } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for AI generation

export async function POST(request: NextRequest) {
  try {
    const body: ProposalGenerationRequest = await request.json();

    // Validate input
    if (!body.client_name || !body.requirements) {
      return NextResponse.json(
        { error: 'client_name and requirements are required' },
        { status: 400 }
      );
    }

    // Generate proposal
    const result = await generateProposal(body);

    // Save to database
    const { data: proposal, error: dbError } = await supabaseAdmin
      .from('proposals')
      .insert({
        client_name: body.client_name,
        client_email: body.client_email || null,
        project_type: result.project_type,
        requirements: body.requirements,
        generated_proposal: result.proposal,
        cost_estimate: result.cost_estimate,
        timeline_weeks: result.timeline_weeks,
        complexity: result.complexity,
        status: 'draft',
      } as any)
      .select()
      .single();

    if (dbError) {
      console.error('Error saving proposal:', dbError);
      // Still return the generated proposal even if save fails
    }

    // Store embedding asynchronously (don't wait for it)
    if (proposal && 'id' in proposal) {
      storeProposalEmbedding(proposal.id as string, body.requirements).catch(console.error);
    }

    return NextResponse.json({
      ...result,
      proposal_id: proposal?.id,
    });
  } catch (error: any) {
    console.error('Error generating proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
