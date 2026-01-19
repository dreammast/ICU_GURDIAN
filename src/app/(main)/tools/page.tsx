import PredictionWidget from '@/components/tools/prediction-widget';
import RetrainingWidget from '@/components/tools/retraining-widget';
import AlertnessAdvisorWidget from '@/components/tools/alertness-advisor-widget';

export default function ToolsPage() {
  return (
    <div className="container mx-auto space-y-8">
       <div>
        <h2 className="text-3xl font-headline font-bold">AI Tools</h2>
        <p className="text-muted-foreground">
          Use these tools to predict risk, retrain the model, and get AI-powered advice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <PredictionWidget />
        </div>
        <div className="lg:col-span-1 space-y-8">
            <RetrainingWidget />
            <AlertnessAdvisorWidget />
        </div>
      </div>
    </div>
  );
}
