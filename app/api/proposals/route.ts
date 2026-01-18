import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Proposal } from '@/types';

export const runtime = 'nodejs';

// GET all proposals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const projectType = searchParams.get('project_type');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabaseAdmin
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    if (projectType) {
      query = query.eq('project_type', projectType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching proposals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch proposals' },
        { status: 500 }
      );
    }

    return NextResponse.json({ proposals: data || [] });
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

    const { data, error } = await supabaseAdmin
      .from('proposals')
      .insert({
        client_name: body.client_name,
        client_email: body.client_email,
        project_type: body.project_type,
        requirements: body.requirements,
        generated_proposal: body.generated_proposal,
        cost_estimate: body.cost_estimate,
        timeline_weeks: body.timeline_weeks,
        complexity: body.complexity,
        status: body.status || 'draft',
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating proposal:', error);
      return NextResponse.json(
        { error: 'Failed to create proposal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ proposal: data });
  } catch (error: any) {
    console.error('Error in POST proposals:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
