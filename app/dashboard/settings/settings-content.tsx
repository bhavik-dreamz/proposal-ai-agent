'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function SettingsContent() {
  const [templates, setTemplates] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [sampleProposals, setSampleProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editingPricingRule, setEditingPricingRule] = useState<any>(null);
  const [editingSample, setEditingSample] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [templatesRes, pricingRes, techRes, samplesRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/pricing-rules'),
        fetch('/api/tech-stacks'),
        fetch('/api/sample-proposals'),
      ]);

      setTemplates(await templatesRes.json());
      setPricingRules(await pricingRes.json());
      setTechStacks(await techRes.json());
      setSampleProposals(await samplesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const url = editingTemplate ? `/api/templates/${editingTemplate.id}` : '/api/templates';
      const method = editingTemplate ? 'PATCH' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          projectType: formData.get('projectType'),
          description: formData.get('description'),
          content: formData.get('content'),
          sections: [],
          isActive: true,
        }),
      });
      await fetchData();
      (e.target as HTMLFormElement).reset();
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
    setLoading(false);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleAddPricingRule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const projectType = formData.get('projectType');
      const url = editingPricingRule ? `/api/pricing-rules/${editingPricingRule.id}` : '/api/pricing-rules';
      const method = editingPricingRule ? 'PATCH' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureName: formData.get('featureName'),
          baseCost: formData.get('baseCost'),
          timeHours: formData.get('timeHours'),
          projectType: projectType === 'ALL' ? null : projectType,
          complexityMultiplier: {
            simple: 0.8,
            medium: 1.0,
            complex: 1.5,
          },
        }),
      });
      await fetchData();
      (e.target as HTMLFormElement).reset();
      setEditingPricingRule(null);
    } catch (error) {
      console.error('Error saving pricing rule:', error);
    }
    setLoading(false);
  };

  const handleDeletePricingRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return;
    try {
      await fetch(`/api/pricing-rules/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
    }
  };

  const handleAddSampleProposal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const url = editingSample ? `/api/sample-proposals/${editingSample.id}` : '/api/sample-proposals';
      const method = editingSample ? 'PATCH' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          projectType: formData.get('projectType'),
          fullContent: formData.get('fullContent'),
          requirementsExcerpt: formData.get('requirementsExcerpt'),
          cost: formData.get('cost'),
          timelineWeeks: formData.get('timelineWeeks'),
          isApproved: true,
        }),
      });
      await fetchData();
      (e.target as HTMLFormElement).reset();
      setEditingSample(null);
    } catch (error) {
      console.error('Error saving sample proposal:', error);
    }
    setLoading(false);
  };

  const handleDeleteSampleProposal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sample proposal?')) return;
    try {
      await fetch(`/api/sample-proposals/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Error deleting sample proposal:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage templates, pricing rules, and tech stacks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Templates ({templates.length})</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" onClick={() => setEditingTemplate(null)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white text-foreground dark:bg-neutral-900">
                  <DialogHeader>
                    <DialogTitle>{editingTemplate ? 'Edit' : 'Add New'} Template</DialogTitle>
                    <DialogDescription>
                      {editingTemplate ? 'Update the proposal template' : 'Create a new proposal template for a project type.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTemplate} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Template Name</Label>
                      <Input id="name" name="name" defaultValue={editingTemplate?.name} required />
                    </div>
                    <div>
                      <Label htmlFor="projectType">Project Type</Label>
                      <Select name="projectType" defaultValue={editingTemplate?.projectType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                          <SelectItem value="MERN">MERN</SelectItem>
                          <SelectItem value="MEAN">MEAN</SelectItem>
                          <SelectItem value="WordPress">WordPress</SelectItem>
                          <SelectItem value="PHP">PHP</SelectItem>
                          <SelectItem value="Shopify">Shopify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" name="description" defaultValue={editingTemplate?.description} />
                    </div>
                    <div>
                      <Label htmlFor="content">Template Content</Label>
                      <Textarea id="content" name="content" rows={8} defaultValue={editingTemplate?.content} required />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : editingTemplate ? 'Update Template' : 'Add Template'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No templates yet. Create one to get started.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {templates.map((template: any) => (
                  <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.projectType}</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setEditingTemplate(template)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white text-foreground dark:bg-neutral-900">
                          <DialogHeader>
                            <DialogTitle>Edit Template</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddTemplate} className="space-y-4">
                            <div>
                              <Label htmlFor="name">Template Name</Label>
                              <Input id="name" name="name" defaultValue={editingTemplate?.name} required />
                            </div>
                            <div>
                              <Label htmlFor="projectType">Project Type</Label>
                              <Select name="projectType" defaultValue={editingTemplate?.projectType} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                                  <SelectItem value="MERN">MERN</SelectItem>
                                  <SelectItem value="MEAN">MEAN</SelectItem>
                                  <SelectItem value="WordPress">WordPress</SelectItem>
                                  <SelectItem value="PHP">PHP</SelectItem>
                                  <SelectItem value="Shopify">Shopify</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Input id="description" name="description" defaultValue={editingTemplate?.description} />
                            </div>
                            <div>
                              <Label htmlFor="content">Template Content</Label>
                              <Textarea id="content" name="content" rows={8} defaultValue={editingTemplate?.content} required />
                            </div>
                            <Button type="submit" disabled={loading}>
                              {loading ? 'Saving...' : 'Update Template'}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pricing Rules ({pricingRules.length})</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" onClick={() => setEditingPricingRule(null)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white text-foreground dark:bg-neutral-900">
                  <DialogHeader>
                    <DialogTitle>{editingPricingRule ? 'Edit' : 'Add'} Pricing Rule</DialogTitle>
                    <DialogDescription>
                      {editingPricingRule ? 'Update the pricing rule' : 'Create a new pricing rule for a feature.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPricingRule} className="space-y-4">
                    <div>
                      <Label htmlFor="featureName">Feature Name</Label>
                      <Input id="featureName" name="featureName" placeholder="e.g., User Authentication" defaultValue={editingPricingRule?.featureName} required />
                    </div>
                    <div>
                      <Label htmlFor="baseCost">Base Cost ($)</Label>
                      <Input id="baseCost" name="baseCost" type="number" step="0.01" defaultValue={editingPricingRule?.baseCost} required />
                    </div>
                    <div>
                      <Label htmlFor="timeHours">Time (Hours)</Label>
                      <Input id="timeHours" name="timeHours" type="number" defaultValue={editingPricingRule?.timeHours} required />
                    </div>
                    <div>
                      <Label htmlFor="projectType">Project Type (Optional)</Label>
                      <Select name="projectType" defaultValue={editingPricingRule?.projectType || 'ALL'}>
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                          <SelectItem value="ALL">All Types</SelectItem>
                          <SelectItem value="MERN">MERN</SelectItem>
                          <SelectItem value="MEAN">MEAN</SelectItem>
                          <SelectItem value="WordPress">WordPress</SelectItem>
                          <SelectItem value="PHP">PHP</SelectItem>
                          <SelectItem value="Shopify">Shopify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : editingPricingRule ? 'Update Rule' : 'Add Rule'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricingRules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pricing rules yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pricingRules.map((rule: any) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{rule.featureName}</p>
                      <p className="text-xs text-muted-foreground">${rule.baseCost} • {rule.timeHours} hrs • {rule.projectType || 'All'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setEditingPricingRule(rule)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white text-foreground dark:bg-neutral-900">
                          <DialogHeader>
                            <DialogTitle>Edit Pricing Rule</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddPricingRule} className="space-y-4">
                            <div>
                              <Label htmlFor="featureName">Feature Name</Label>
                              <Input id="featureName" name="featureName" defaultValue={editingPricingRule?.featureName} required />
                            </div>
                            <div>
                              <Label htmlFor="baseCost">Base Cost ($)</Label>
                              <Input id="baseCost" name="baseCost" type="number" step="0.01" defaultValue={editingPricingRule?.baseCost} required />
                            </div>
                            <div>
                              <Label htmlFor="timeHours">Time (Hours)</Label>
                              <Input id="timeHours" name="timeHours" type="number" defaultValue={editingPricingRule?.timeHours} required />
                            </div>
                            <div>
                              <Label htmlFor="projectType">Project Type (Optional)</Label>
                              <Select name="projectType" defaultValue={editingPricingRule?.projectType || 'ALL'}>
                                <SelectTrigger>
                                  <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                                  <SelectItem value="ALL">All Types</SelectItem>
                                  <SelectItem value="MERN">MERN</SelectItem>
                                  <SelectItem value="MEAN">MEAN</SelectItem>
                                  <SelectItem value="WordPress">WordPress</SelectItem>
                                  <SelectItem value="PHP">PHP</SelectItem>
                                  <SelectItem value="Shopify">Shopify</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button type="submit" disabled={loading}>
                              {loading ? 'Saving...' : 'Update Rule'}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost" onClick={() => handleDeletePricingRule(rule.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tech Stacks ({techStacks.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {techStacks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Loading tech stacks...</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {techStacks.map((stack: any) => (
                  <div key={stack.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{stack.name}</p>
                      <p className="text-xs text-muted-foreground">{stack.description}</p>
                    </div>
                    <Badge variant="outline">${stack.baseCost}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sample Proposals ({sampleProposals.length})</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" onClick={() => setEditingSample(null)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white text-foreground dark:bg-neutral-900">
                  <DialogHeader>
                    <DialogTitle>{editingSample ? 'Edit' : 'Add'} Sample Proposal</DialogTitle>
                    <DialogDescription>
                      {editingSample ? 'Update the sample proposal' : 'Add a sample proposal to train the AI.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddSampleProposal} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" defaultValue={editingSample?.title} required />
                    </div>
                    <div>
                      <Label htmlFor="projectType">Project Type</Label>
                      <Select name="projectType" defaultValue={editingSample?.projectType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                          <SelectItem value="MERN">MERN</SelectItem>
                          <SelectItem value="MEAN">MEAN</SelectItem>
                          <SelectItem value="WordPress">WordPress</SelectItem>
                          <SelectItem value="PHP">PHP</SelectItem>
                          <SelectItem value="Shopify">Shopify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="requirementsExcerpt">Requirements Summary</Label>
                      <Textarea id="requirementsExcerpt" name="requirementsExcerpt" rows={3} defaultValue={editingSample?.requirementsExcerpt} />
                    </div>
                    <div>
                      <Label htmlFor="fullContent">Full Proposal Content</Label>
                      <Textarea id="fullContent" name="fullContent" rows={8} defaultValue={editingSample?.fullContent} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cost">Cost ($)</Label>
                        <Input id="cost" name="cost" type="number" step="0.01" defaultValue={editingSample?.cost} required />
                      </div>
                      <div>
                        <Label htmlFor="timelineWeeks">Timeline (Weeks)</Label>
                        <Input id="timelineWeeks" name="timelineWeeks" type="number" defaultValue={editingSample?.timelineWeeks} required />
                      </div>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : editingSample ? 'Update Sample' : 'Add Sample'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleProposals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sample proposals yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sampleProposals.map((sample: any) => (
                  <div key={sample.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{sample.title}</p>
                      <p className="text-xs text-muted-foreground">{sample.projectType} • ${sample.cost} • {sample.timelineWeeks} weeks</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setEditingSample(sample)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white text-foreground dark:bg-neutral-900">
                          <DialogHeader>
                            <DialogTitle>Edit Sample Proposal</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAddSampleProposal} className="space-y-4">
                            <div>
                              <Label htmlFor="title">Title</Label>
                              <Input id="title" name="title" defaultValue={editingSample?.title} required />
                            </div>
                            <div>
                              <Label htmlFor="projectType">Project Type</Label>
                              <Select name="projectType" defaultValue={editingSample?.projectType} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-foreground dark:bg-neutral-900">
                                  <SelectItem value="MERN">MERN</SelectItem>
                                  <SelectItem value="MEAN">MEAN</SelectItem>
                                  <SelectItem value="WordPress">WordPress</SelectItem>
                                  <SelectItem value="PHP">PHP</SelectItem>
                                  <SelectItem value="Shopify">Shopify</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="requirementsExcerpt">Requirements Summary</Label>
                              <Textarea id="requirementsExcerpt" name="requirementsExcerpt" rows={3} defaultValue={editingSample?.requirementsExcerpt} />
                            </div>
                            <div>
                              <Label htmlFor="fullContent">Full Proposal Content</Label>
                              <Textarea id="fullContent" name="fullContent" rows={8} defaultValue={editingSample?.fullContent} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="cost">Cost ($)</Label>
                                <Input id="cost" name="cost" type="number" step="0.01" defaultValue={editingSample?.cost} required />
                              </div>
                              <div>
                                <Label htmlFor="timelineWeeks">Timeline (Weeks)</Label>
                                <Input id="timelineWeeks" name="timelineWeeks" type="number" defaultValue={editingSample?.timelineWeeks} required />
                              </div>
                            </div>
                            <Button type="submit" disabled={loading}>
                              {loading ? 'Saving...' : 'Update Sample'}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteSampleProposal(sample.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
