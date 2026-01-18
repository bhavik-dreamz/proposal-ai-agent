'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProjectType, Complexity } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProposalFormProps {
  onSubmit: (data: {
    client_name: string;
    client_email?: string;
    requirements: string;
    project_type?: ProjectType;
    complexity?: Complexity;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function ProposalForm({ onSubmit, isLoading }: ProposalFormProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [projectType, setProjectType] = useState<ProjectType | undefined>();
  const [complexity, setComplexity] = useState<Complexity | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      client_name: clientName,
      client_email: clientEmail || undefined,
      requirements,
      project_type: projectType,
      complexity,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="client_name">Client Name *</Label>
        <Input
          id="client_name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          placeholder="Enter client name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client_email">Client Email (Optional)</Label>
        <Input
          id="client_email"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          placeholder="client@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Project Requirements *</Label>
        <Textarea
          id="requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          required
          placeholder="Describe the project requirements in detail..."
          rows={12}
          className="resize-none"
        />
        <p className="text-sm text-muted-foreground">
          Be as detailed as possible. Include features, budget, timeline, and any specific requirements.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project_type">Project Type (Optional)</Label>
          <Select
            value={projectType || ''}
            onValueChange={(value) => setProjectType(value as ProjectType)}
          >
            <SelectTrigger id="project_type">
              <SelectValue placeholder="Auto-detect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MERN">MERN</SelectItem>
              <SelectItem value="MEAN">MEAN</SelectItem>
              <SelectItem value="WordPress">WordPress</SelectItem>
              <SelectItem value="PHP">PHP</SelectItem>
              <SelectItem value="Shopify">Shopify</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Leave empty to auto-detect
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="complexity">Complexity (Optional)</Label>
          <Select
            value={complexity || ''}
            onValueChange={(value) => setComplexity(value as Complexity)}
          >
            <SelectTrigger id="complexity">
              <SelectValue placeholder="Auto-detect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="complex">Complex</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Leave empty to auto-detect
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Proposal...
          </>
        ) : (
          'Generate Proposal'
        )}
      </Button>
    </form>
  );
}
