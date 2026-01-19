import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pricingRules = await prisma.pricingRule.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(pricingRules);
  } catch (error) {
    console.error('Error fetching pricing rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing rules' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { featureName, baseCost, timeHours, complexityMultiplier, projectType } = body;

    const pricingRule = await prisma.pricingRule.create({
      data: {
        featureName,
        baseCost: parseFloat(baseCost),
        timeHours: parseInt(timeHours),
        complexityMultiplier: complexityMultiplier || { simple: 0.8, medium: 1.0, complex: 1.5 },
        projectType: projectType || null,
      },
    });

    return NextResponse.json(pricingRule);
  } catch (error) {
    console.error('Error creating pricing rule:', error);
    return NextResponse.json(
      { error: 'Failed to create pricing rule' },
      { status: 500 }
    );
  }
}
