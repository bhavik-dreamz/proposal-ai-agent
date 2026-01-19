import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Proposal } from '@/types';

export const runtime = 'nodejs';

// GET all proposals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const projectType = searchParams.get('project_type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const proposals = await prisma.proposal.findMany({
      where: {
        ...(status && { status }),
        ...(projectType && { projectType }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ proposals });
  } catch (error: any) {
    console.error('Error in GET proposals:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const proposal = await prisma.proposal.create({
      data: {
        clientName: body.client_name,
        clientEmail: body.client_email,
        projectType: body.project_type,
        requirements: body.requirements,
        generatedProposal: body.generated_proposal,
        costEstimate: body.cost_estimate,
        timelineWeeks: body.timeline_weeks,
        complexity: body.complexity,
        status: body.status || 'draft',
      },
    });

    return NextResponse.json({ proposal });
  } catch (error: any) {
    console.error('Error in POST proposals:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
