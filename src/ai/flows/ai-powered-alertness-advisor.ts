// This is a server-side file.
'use server';

/**
 * @fileOverview An AI tool that analyzes patient vitals and advises on optimal alert trigger times.
 *
 * - getAlertAdvice - A function that handles the process of analyzing vitals and advising on alert trigger times.
 * - AlertAdviceInput - The input type for the getAlertAdvice function.
 * - AlertAdviceOutput - The return type for the getAlertAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlertAdviceInputSchema = z.object({
  patientId: z.string().describe('The ID of the patient.'),
  vitalsData: z.string().describe('Patient vitals data as a stringified JSON array of objects, where each object contains a timestamp and vital measurements (HR, BP, SpO2, RR).'),
});
export type AlertAdviceInput = z.infer<typeof AlertAdviceInputSchema>;

const AlertAdviceOutputSchema = z.object({
  advice: z.string().describe('AI-generated advice on optimal alert trigger times, considering vitals trends.'),
  confidenceScore: z.number().describe('A score (0-1) indicating the confidence level of the AI in its advice.'),
});
export type AlertAdviceOutput = z.infer<typeof AlertAdviceOutputSchema>;

export async function getAlertAdvice(input: AlertAdviceInput): Promise<AlertAdviceOutput> {
  return alertAdviceFlow(input);
}

const alertAdvicePrompt = ai.definePrompt({
  name: 'alertAdvicePrompt',
  input: {schema: AlertAdviceInputSchema},
  output: {schema: AlertAdviceOutputSchema},
  prompt: `You are an AI assistant providing advice on alert trigger times based on patient vitals data.

  Analyze the following vitals data for patient ID {{{patientId}}}:
  {{{vitalsData}}}

  Based on the trends and patterns in the vitals, provide advice on when alerts should be triggered, and a confidence score for your recommendation.
  Consider factors such as rapid changes, sustained deviations from normal ranges, and potential risks.
  Provide your advice in a concise and actionable manner, and be specific. The confidence score should be between 0 and 1.
  `,
});

const alertAdviceFlow = ai.defineFlow(
  {
    name: 'alertAdviceFlow',
    inputSchema: AlertAdviceInputSchema,
    outputSchema: AlertAdviceOutputSchema,
  },
  async input => {
    try {
      // Parse the vitalsData string into a JSON array
      const vitals = JSON.parse(input.vitalsData);
      if (!Array.isArray(vitals)) {
        throw new Error('Vitals data must be a JSON array.');
      }
      // Here, you might perform more sophisticated analysis of the vitals data
      // such as calculating moving averages, identifying anomalies, or detecting trends.

      const {output} = await alertAdvicePrompt({
        ...input,
        vitalsData: JSON.stringify(vitals, null, 2), // Re-stringify with formatting for readability in the prompt
      });
      return output!;
    } catch (error: any) {
      console.error('Error processing vitals data:', error);
      return {
        advice: `Error analyzing vitals data: ${error.message}`,
        confidenceScore: 0.0,
      };
    }
  }
);
