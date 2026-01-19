'use client';

import { useState } from 'react';
import { Lightbulb, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleAlertnessAdvice } from '@/app/actions';
import type { AlertAdviceOutput } from '@/ai/flows/ai-powered-alertness-advisor';
import { Progress } from '../ui/progress';

const sampleVitals = JSON.stringify([
    { "timestamp": "2023-10-27T10:00:00Z", "HR": 75, "BP": "120/80", "SpO2": 98, "RR": 16 },
    { "timestamp": "2023-10-27T10:05:00Z", "HR": 95, "BP": "130/85", "SpO2": 97, "RR": 18 },
    { "timestamp": "2023-10-27T10:10:00Z", "HR": 110, "BP": "140/90", "SpO2": 95, "RR": 22 }
], null, 2);


export default function AlertnessAdvisorWidget() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AlertAdviceOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const response = await handleAlertnessAdvice(formData);
    
    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Get Advice',
        description: response.error,
      });
    } else if (response.success) {
      setResult(response.data);
      toast({
        title: 'AI Advice Received',
      });
    }
    
    setIsLoading(false);
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Wand2 className="text-primary" /> Alertness Advisor
          </CardTitle>
          <CardDescription>
            Get AI advice on optimal alert trigger times based on vitals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="patientId">Patient ID</Label>
            <Input id="patientId" name="patientId" type="text" placeholder="e.g., P1001" required />
          </div>
           <div>
            <Label htmlFor="vitalsData">Vitals Data (JSON)</Label>
            <Textarea id="vitalsData" name="vitalsData" placeholder="Enter vitals data as a JSON array" required rows={5} defaultValue={sampleVitals}/>
          </div>
          {result && (
            <div className="space-y-3 pt-2">
               <div className="flex items-start gap-3 p-3 bg-accent/20 rounded-lg">
                <Lightbulb className="w-5 h-5 text-accent-foreground mt-1" />
                <p className="text-sm text-accent-foreground font-medium">{result.advice}</p>
               </div>
               <div>
                <Label className="text-xs">Confidence Score</Label>
                <div className="flex items-center gap-2">
                    <Progress value={result.confidenceScore * 100} className="w-[80%]" />
                    <span className="text-sm font-bold">{(result.confidenceScore * 100).toFixed(0)}%</span>
                </div>
               </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Advice...
              </>
            ) : (
                <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get AI Advice
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
