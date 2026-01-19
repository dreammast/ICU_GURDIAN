'use client';

import { useState } from 'react';
import { FileUp, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { handlePrediction } from '@/app/actions';
import type { PredictRiskFromLabReportOutput } from '@/ai/flows/predict-risk-from-lab-reports';
import { getRiskColorClass, getRiskLevel } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PredictionWidget() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictRiskFromLabReportOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(PlaceHolderImages[0]?.imageUrl || null);
  const [dataUri, setDataUri] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        setDataUri(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    if (!dataUri) {
        toast({
            variant: "destructive",
            title: "No Lab Report",
            description: "Please upload a lab report image.",
        });
        setIsLoading(false);
        return;
    }
    formData.append('labReportDataUri', dataUri);

    const response = await handlePrediction(formData);
    
    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description: response.error,
      });
    } else if (response.success) {
      setResult(response.data);
      toast({
        title: 'Prediction Successful',
        description: 'Risk score has been calculated.',
      });
    }
    
    setIsLoading(false);
  };
  
  const riskLevel = result ? getRiskLevel(result.riskScore) : null;
  const riskColorClass = riskLevel ? getRiskColorClass(riskLevel) : '';

  return (
    <Card className="h-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <FileUp className="text-primary" /> Single Patient Predictor
          </CardTitle>
          <CardDescription>
            Upload a lab report image and patient vitals to predict risk score.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="lab-report">Lab Report Image</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {preview ? (
                     <Image src={preview} alt="Lab report preview" width={200} height={280} className="mx-auto rounded-md object-contain" data-ai-hint="document paper" />
                  ) : (
                    <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <Label htmlFor="lab-report-upload" className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                      <span>Upload a file</span>
                      <Input id="lab-report-upload" name="file" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" placeholder="e.g., 58" required />
              </div>
              <div>
                <Label htmlFor="sex">Sex</Label>
                <Select name="sex" required>
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            {result ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-muted/50 p-6 rounded-lg">
                <p className="text-sm text-muted-foreground">Predicted Risk Score</p>
                <p className={`text-7xl font-bold font-headline my-2 ${riskColorClass.split(' ')[1]}`}>
                    {(result.riskScore * 100).toFixed(0)}%
                </p>
                <p className={`font-semibold ${riskColorClass.split(' ')[1]}`}>{riskLevel}</p>
                <Card className="w-full mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-1"><Sparkles className="w-4 h-4 text-primary"/> Extracted Lab Values</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md max-h-48 overflow-auto whitespace-pre-wrap">{result.extractedLabValues}</pre>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground bg-muted/20 p-6 rounded-lg">
                <p>Prediction results will be shown here.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              'Predict Risk'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
