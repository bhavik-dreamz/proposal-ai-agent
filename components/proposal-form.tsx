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
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface ProposalFormProps {
  onSubmit: (data: {
    client_name: string;
    requirements: string;
    project_type?: ProjectType;
    complexity?: Complexity;
  }) => Promise<void>;
  isLoading?: boolean;
}

const generationSteps = [
  { id: 1, label: 'Reviewing client requirements' },
  { id: 2, label: 'Detecting project type & complexity' },
  { id: 3, label: 'Searching similar proposals' },
  { id: 4, label: 'Analyzing tech stack & pricing' },
  { id: 5, label: 'Generating proposal content' },
  { id: 6, label: 'Finalizing document' },
];

export function ProposalForm({ onSubmit, isLoading }: ProposalFormProps) {
  const [clientName, setClientName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [projectType, setProjectType] = useState<ProjectType | undefined>();
  const [complexity, setComplexity] = useState<Complexity | undefined>();
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(1);
    
    // Simulate step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < generationSteps.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);
    
    try {
      await onSubmit({
        client_name: clientName,
        requirements,
        project_type: projectType,
        complexity,
      });
    } finally {
      clearInterval(stepInterval);
      setCurrentStep(0);
    }
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
            <SelectContent className="bg-white dark:bg-neutral-900">
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
            <SelectContent className="bg-white dark:bg-neutral-900">
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

      {isLoading && currentStep > 0 && (
        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
          <div className="text-sm font-medium">Generation Progress</div>
          {generationSteps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              {currentStep > step.id ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : currentStep === step.id ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300" />
              )}
              <span
                className={`text-sm ${
                  currentStep >= step.id
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}

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
