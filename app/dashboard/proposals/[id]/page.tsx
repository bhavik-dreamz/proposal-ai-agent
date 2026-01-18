'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProposalPreview } from '@/components/proposal-preview';
import { ProposalEditor } from '@/components/proposal-editor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ArrowLeft, Download, Send } from 'lucide-react';
import type { Proposal } from '@/types';

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProposal(params.id as string);
    }
  }, [params.id]);

  async function fetchProposal(id: string) {
    try {
      const response = await fetch(`/api/proposals/${id}`);
      if (!response.ok) {
        throw new Error('Proposal not found');
      }
      const data = await response.json();
      setProposal(data.proposal);
    } catch (error) {
      console.error('Error fetching proposal:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEdit(content: string) {
    if (!proposal) return;
    setIsSaving(true);

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
    } catch (error) {
      console.error('Error saving proposal:', error);
      alert('Failed to save proposal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateStatus(status: string) {
    if (!proposal) return;

    try {
      const response = await fetch(`/api/proposals/${proposal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const result = await response.json();
      setProposal(result.proposal);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  }

  function handleExportPDF() {
    // TODO: Implement PDF export
    alert('PDF export feature coming soon!');
  }

  if (loading) {
    return <LoadingSpinner message="Loading proposal..." />;
  }

  if (!proposal) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Proposal not found.</p>
          <Link href="/dashboard/proposals">
            <Button className="mt-4">Back to Proposals</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/proposals">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{proposal.client_name}</h1>
            <p className="text-muted-foreground">Proposal Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleUpdateStatus('sent')}>
            <Send className="mr-2 h-4 w-4" />
            Mark as Sent
          </Button>
        </div>
      </div>

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
            isLoading={isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
