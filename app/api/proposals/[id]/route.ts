import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

export const runtime = 'nodejs';

// GET single proposal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      proposal: {
        id: proposal.id,
        client_name: proposal.clientName,
        client_email: proposal.clientEmail ?? undefined,
        project_type: proposal.projectType,
        requirements: proposal.requirements,
        generated_proposal: proposal.generatedProposal ?? undefined,
        cost_estimate: proposal.costEstimate ? Number(proposal.costEstimate) : undefined,
        timeline_weeks: proposal.timelineWeeks ?? undefined,
        complexity: proposal.complexity ?? undefined,
        status: proposal.status,
        created_by_id: proposal.createdById ?? undefined,
        created_at: proposal.createdAt.toISOString(),
        updated_at: proposal.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update proposal
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.proposal.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const isAdmin = session.user.role === Role.ADMIN;
    const isOwner = existing.createdById === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();

    // Map body field names if needed (e.g., generated_proposal -> generatedProposal)
    const updateData: any = {};
    for (const [key, value] of Object.entries(body)) {
      if (key === 'generated_proposal') updateData.generatedProposal = value;
      else if (key === 'client_name') updateData.clientName = value;
      else if (key === 'client_email') updateData.clientEmail = value;
      else if (key === 'project_type') updateData.projectType = value;
      else if (key === 'cost_estimate') updateData.costEstimate = value;
      else if (key === 'timeline_weeks') updateData.timelineWeeks = value;
      else updateData[key] = value;
    }

    const proposal = await prisma.proposal.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      proposal: {
        id: proposal.id,
        client_name: proposal.clientName,
        client_email: proposal.clientEmail ?? undefined,
        project_type: proposal.projectType,
        requirements: proposal.requirements,
        generated_proposal: proposal.generatedProposal ?? undefined,
        cost_estimate: proposal.costEstimate ? Number(proposal.costEstimate) : undefined,
        timeline_weeks: proposal.timelineWeeks ?? undefined,
        complexity: proposal.complexity ?? undefined,
        status: proposal.status,
        created_by_id: proposal.createdById ?? undefined,
        created_at: proposal.createdAt.toISOString(),
        updated_at: proposal.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE proposal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.proposal.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const isAdmin = session.user.role === Role.ADMIN;
    const isOwner = existing.createdById === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.proposal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
