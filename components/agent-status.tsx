import { Bot, CheckCircle2, Clock3, DollarSign, FileSearch, FileText, Wand2 } from 'lucide-react';
import type React from 'react';

export interface AgentStage {
  title: string;
  description: string;
  stepIds: number[];
  icon: React.ComponentType<{ className?: string }>;
}

interface AgentStatusProps {
  currentStep: number;
  stages: AgentStage[];
}

function statusFor(step: number, stageSteps: number[]) {
  const minStep = Math.min(...stageSteps);
  const maxStep = Math.max(...stageSteps);
  if (step < minStep) return 'pending';
  if (step >= minStep && step <= maxStep && stageSteps.includes(step)) return 'active';
  return 'done';
}

export function AgentStatus({ currentStep, stages }: AgentStatusProps) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Agent flow</span>
        <span className="text-xs text-muted-foreground">Multi-agent handoff</span>
      </div>
      <div className="space-y-3">
        {stages.map((stage) => {
          const status = statusFor(currentStep, stage.stepIds);
          const Icon = stage.icon;

          const tone =
            status === 'done'
              ? 'text-green-600'
              : status === 'active'
              ? 'text-blue-600'
              : 'text-muted-foreground';

          return (
            <div key={stage.title} className="flex items-start gap-3">
              <div className={`mt-0.5 ${tone}`}>
                {status === 'done' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : status === 'active' ? (
                  <Clock3 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-medium text-foreground">{stage.title}</div>
                <div className="text-xs text-muted-foreground">{stage.description}</div>
                <div className="text-xs font-semibold text-muted-foreground/80">
                  {status === 'done' && 'Complete'}
                  {status === 'active' && 'In progress'}
                  {status === 'pending' && 'Queued'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
