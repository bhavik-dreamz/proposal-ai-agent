'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProposalForm } from '@/components/proposal-form';
import { ProposalPreview } from '@/components/proposal-preview';
import { ProposalEditor } from '@/components/proposal-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/loading-spinner';
import type { Proposal } from '@/types';

export default function NewProposalPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: {
    client_name: string;
    client_email?: string;
    requirements: string;
    project_type?: string;
    complexity?: string;
  }) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate proposal');
      }

      const result = await response.json();

      // Fetch the saved proposal
      if (result.proposal_id) {
        const proposalResponse = await fetch(`/api/proposals/${result.proposal_id}`);
        const proposalData = await proposalResponse.json();
        setProposal(proposalData.proposal);
      } else {
        // Create proposal object from result
        setProposal({
          id: '',
          client_name: data.client_name,
          client_email: data.client_email,
          project_type: result.project_type,
          requirements: data.requirements,
          generated_proposal: result.proposal,
          cost_estimate: result.cost_estimate,
          timeline_weeks: result.timeline_weeks,
          complexity: result.complexity,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate proposal');
      console.error('Error generating proposal:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEdit = async (content: string) => {
    if (!proposal) return;

    try {
      const response = await fetch(`/api/proposals/${proposal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generated_proposal: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save proposal');
      }

      const result = await response.json();
      setProposal(result.proposal);
    } catch (err: any) {
      console.error('Error saving proposal:', err);
      alert('Failed to save proposal. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Proposal</h1>
        <p className="text-muted-foreground">
          Enter client requirements and let AI generate a professional proposal
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!proposal ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ProposalForm onSubmit={handleGenerate} isLoading={isGenerating} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <LoadingSpinner message="AI is generating your proposal..." />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Fill out the form to generate a proposal</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <ProposalPreview proposal={proposal} />
          </TabsContent>
          <TabsContent value="edit">
            <ProposalEditor
              content={proposal.generated_proposal || ''}
              onSave={handleSaveEdit}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
