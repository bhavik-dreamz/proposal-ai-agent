'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface ProposalEditorProps {
  content: string;
  onSave: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProposalEditor({ content, onSave, isLoading }: ProposalEditorProps) {
  const [editedContent, setEditedContent] = useState(content);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (value: string) => {
    setEditedContent(value);
    setHasChanges(value !== content);
  };

  const handleSave = async () => {
    await onSave(editedContent);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit Proposal</CardTitle>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            size="sm"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={editedContent}
          onChange={(e) => handleChange(e.target.value)}
          rows={20}
          className="font-mono text-sm"
          placeholder="Edit proposal content in Markdown format..."
        />
        <p className="text-sm text-muted-foreground mt-2">
          Use Markdown formatting. Changes are saved automatically when you click Save.
        </p>
      </CardContent>
    </Card>
  );
}
