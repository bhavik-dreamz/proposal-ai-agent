import { NextRequest, NextResponse } from 'next/server';
import { generateProposal } from '@/lib/proposal-generator';
import { storeProposalEmbedding } from '@/lib/vector-search';
import { prisma } from '@/lib/prisma';
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
    const proposal = await prisma.proposal.create({
      data: {
        clientName: body.client_name,
        clientEmail: body.client_email || null,
        projectType: result.project_type,
        requirements: body.requirements,
        generatedProposal: result.proposal,
        costEstimate: result.cost_estimate,
        timelineWeeks: result.timeline_weeks,
        complexity: result.complexity,
        status: 'draft',
      },
    });

    // Store embedding asynchronously (don't wait for it)
    storeProposalEmbedding(proposal.id, body.requirements).catch(console.error);

    return NextResponse.json({
      ...result,
      proposal_id: proposal.id,
    });
  } catch (error: any) {
    console.error('Error generating proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}
