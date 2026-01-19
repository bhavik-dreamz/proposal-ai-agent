import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface GenerationProgressProps {
  steps: { id: number; label: string }[];
  currentStep: number;
}

export function GenerationProgress({ steps, currentStep }: GenerationProgressProps) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
      <div className="text-sm font-medium">AI agent progress</div>
      <div className="space-y-2">
        {steps.map((step) => {
          const isComplete = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center gap-3">
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300" />
              )}
              <span
                className={`text-sm ${
                  isComplete || isActive
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
