import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
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

    const serialized = proposals.map((p) => ({
      id: p.id,
      client_name: p.clientName,
      client_email: p.clientEmail ?? undefined,
      project_type: p.projectType as Proposal['project_type'],
      requirements: p.requirements,
      generated_proposal: p.generatedProposal ?? undefined,
      cost_estimate: p.costEstimate ? Number(p.costEstimate) : undefined,
      timeline_weeks: p.timelineWeeks ?? undefined,
      complexity: (p.complexity as Proposal['complexity']) ?? undefined,
      status: p.status as Proposal['status'],
      created_by_id: p.createdById ?? undefined,
      created_at: p.createdAt.toISOString(),
      updated_at: p.updatedAt.toISOString(),
      embedding: undefined,
    } satisfies Proposal));

    return NextResponse.json({ proposals: serialized });
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
    const session = await auth();

    const created = await prisma.proposal.create({
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
        createdById: session?.user?.id ?? null,
      },
    });

    const serialized: Proposal = {
      id: created.id,
      client_name: created.clientName,
      client_email: created.clientEmail ?? undefined,
      project_type: created.projectType as Proposal['project_type'],
      requirements: created.requirements,
      generated_proposal: created.generatedProposal ?? undefined,
      cost_estimate: created.costEstimate ? Number(created.costEstimate) : undefined,
      timeline_weeks: created.timelineWeeks ?? undefined,
      complexity: (created.complexity as Proposal['complexity']) ?? undefined,
      status: created.status as Proposal['status'],
      created_by_id: created.createdById ?? undefined,
      created_at: created.createdAt.toISOString(),
      updated_at: created.updatedAt.toISOString(),
      embedding: undefined,
    };

    return NextResponse.json({ proposal: serialized });
  } catch (error: any) {
    console.error('Error in POST proposals:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
