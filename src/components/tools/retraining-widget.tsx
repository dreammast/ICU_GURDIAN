'use client';

import { useState } from 'react';
import { Bot, Loader2, GitBranch } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleRetraining } from '@/app/actions';
import type { RetrainModelOutput } from '@/ai/flows/online-retraining-model';
import { Separator } from '../ui/separator';

export default function RetrainingWidget() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RetrainModelOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const response = await handleRetraining(formData);
    
    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Retraining Failed',
        description: response.error,
      });
    } else if (response.success) {
      setResult(response.data);
      toast({
        title: 'Retraining Successful',
        description: `Model has been updated to version ${response.data.modelVersion}.`,
      });
    }
    
    setIsLoading(false);
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Bot className="text-primary" /> Model Retraining
          </CardTitle>
          <CardDescription>
            Trigger the online retraining process with a new mapping CSV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mappingCsvPath">Mapping CSV Path</Label>
            <Input id="mappingCsvPath" name="mappingCsvPath" type="text" placeholder="/path/to/mapping.csv" required />
          </div>
          {result && (
            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2"><GitBranch className="w-4 h-4" /> Model Version</span>
                <span className="font-medium">{result.modelVersion}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pre-Retraining MAE</span>
                <span className="font-medium">{result.preMae}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Post-Retraining MAE</span>
                <span className="font-medium text-green-600">{result.postMae}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground"># of Samples</span>
                <span className="font-medium">{result.numberOfSamples}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retraining...
              </>
            ) : (
              'Trigger Retraining'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
