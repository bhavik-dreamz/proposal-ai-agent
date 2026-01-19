import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const techStacks = await prisma.techStack.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(techStacks);
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech stacks' },
      { status: 500 }
    );
  }
}
