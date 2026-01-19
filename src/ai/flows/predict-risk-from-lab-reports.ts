'use server';
/**
 * @fileOverview Predicts patient risk scores from uploaded lab report images using OCR and a pre-trained GRU+XGBoost model.
 *
 * - predictRiskFromLabReport - A function that handles the risk prediction process.
 * - PredictRiskFromLabReportInput - The input type for the predictRiskFromLabReport function.
 * - PredictRiskFromLabReportOutput - The return type for the predictRiskFromLabReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictRiskFromLabReportInputSchema = z.object({
  labReportDataUri: z
    .string()
    .describe(
      "A lab report image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  age: z.number().describe('The patient age.'),
  sex: z.string().describe('The patient sex (Male/Female).'),
});
export type PredictRiskFromLabReportInput = z.infer<typeof PredictRiskFromLabReportInputSchema>;

const PredictRiskFromLabReportOutputSchema = z.object({
  riskScore: z.number().describe('The predicted risk score for the patient.'),
  riskLevel: z.string().describe('The risk level (Low, Moderate, High) based on the risk score.'),
  extractedLabValues: z.string().describe('The extracted lab values from the image.'),
});
export type PredictRiskFromLabReportOutput = z.infer<typeof PredictRiskFromLabReportOutputSchema>;

export async function predictRiskFromLabReport(input: PredictRiskFromLabReportInput): Promise<PredictRiskFromLabReportOutput> {
  return predictRiskFromLabReportFlow(input);
}

const predictRiskFromLabReportFlow = ai.defineFlow(
  {
    name: 'predictRiskFromLabReportFlow',
    inputSchema: PredictRiskFromLabReportInputSchema,
    outputSchema: PredictRiskFromLabReportOutputSchema,
  },
  async input => {
    // Dynamically import Groq
    const { default: Groq } = await import('groq-sdk');

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables.");
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
      const completion = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an AI medical assistant. Analyze the lab report image and patient context.
Patient Age: ${input.age}, Sex: ${input.sex}

Extract visible lab values.
Based on the values, predict a risk score (0.0-1.0) and level (Low <0.5, Moderate 0.5-0.8, High >=0.8).

Return JSON ONLY:
{ "riskScore": number, "riskLevel": "Low"|"Moderate"|"High", "extractedLabValues": "summary string" }`
              },
              {
                type: 'image_url',
                image_url: { url: input.labReportDataUri }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from AI');

      const parsed = JSON.parse(content);
      return {
        riskScore: Number(parsed.riskScore) || 0,
        riskLevel: parsed.riskLevel || 'Low',
        extractedLabValues: typeof parsed.extractedLabValues === 'string' ? parsed.extractedLabValues : JSON.stringify(parsed.extractedLabValues)
      };
    } catch (e: any) {
      console.error('Groq Vision Error:', e);
      throw new Error(`Risk prediction failed: ${e.message}`);
    }
  }
);
