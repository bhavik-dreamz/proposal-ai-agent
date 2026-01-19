import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sampleProposals = await prisma.sampleProposal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(sampleProposals);
  } catch (error) {
    console.error('Error fetching sample proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sample proposals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, projectType, fullContent, requirementsExcerpt, cost, timelineWeeks, isApproved } = body;

    const sampleProposal = await prisma.sampleProposal.create({
      data: {
        title,
        projectType,
        fullContent,
        requirementsExcerpt: requirementsExcerpt || '',
        cost: parseFloat(cost),
        timelineWeeks: parseInt(timelineWeeks),
        isApproved: isApproved ?? false,
        embedding: null,
      },
    });

    return NextResponse.json(sampleProposal);
  } catch (error) {
    console.error('Error creating sample proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create sample proposal' },
      { status: 500 }
    );
  }
}
