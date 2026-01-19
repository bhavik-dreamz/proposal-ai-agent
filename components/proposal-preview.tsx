'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getStatusColor, getComplexityColor } from '@/lib/utils';
import type { Proposal } from '@/types';
import { Calendar, DollarSign, Code, TrendingUp } from 'lucide-react';

interface ProposalPreviewProps {
  proposal: Proposal;
  showMetadata?: boolean;
}

export function ProposalPreview({ proposal, showMetadata = true }: ProposalPreviewProps) {
  return (
    <div className="space-y-4">
      {showMetadata && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Cost Estimate</p>
                  <p className="text-lg font-semibold">
                    {proposal.cost_estimate ? formatCurrency(proposal.cost_estimate) : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="text-lg font-semibold">
                    {proposal.timeline_weeks ? `${proposal.timeline_weeks} weeks` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Project Type</p>
                  <p className="text-lg font-semibold">{proposal.project_type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Complexity</p>
                  {proposal.complexity && (
                    <Badge className={getComplexityColor(proposal.complexity)}>
                      {proposal.complexity}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Proposal Preview</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(proposal.status)}>
                {proposal.status}
              </Badge>
              {proposal.complexity && (
                <Badge variant="outline" className={getComplexityColor(proposal.complexity)}>
                  {proposal.complexity}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Created: {formatDate(proposal.created_at)}
          </p>
        </CardHeader>
        <CardContent className="p-8">
          {proposal.generated_proposal ? (
            <div className="prose prose-base max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {proposal.generated_proposal}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground">No proposal generated yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
