'use server';

import { predictRiskFromLabReport } from '@/ai/flows/predict-risk-from-lab-reports';
import { retrainModel } from '@/ai/flows/online-retraining-model';
import { getAlertAdvice } from '@/ai/flows/ai-powered-alertness-advisor';
import { z } from 'zod';
import type { Patient } from '@/lib/types';

const predictionSchema = z.object({
  age: z.number(),
  sex: z.string(),
  labReportDataUri: z.string(),
});

export async function handlePrediction(formData: FormData) {
  try {
    const parsed = predictionSchema.safeParse({
      age: Number(formData.get('age')),
      sex: formData.get('sex'),
      labReportDataUri: formData.get('labReportDataUri'),
    });

    if (!parsed.success) {
      return { error: 'Invalid input data.', details: parsed.error.format() };
    }

    const result = await predictRiskFromLabReport(parsed.data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Prediction failed:', error);
    // Return specific error for debugging
    return { error: error.message || 'An unexpected error occurred during prediction.' };
  }
}


const retrainingSchema = z.object({
  mappingCsvPath: z.string().min(1, "CSV path is required."),
});

export async function handleRetraining(formData: FormData) {
  try {
    const parsed = retrainingSchema.safeParse({
      mappingCsvPath: formData.get('mappingCsvPath'),
    });

    if (!parsed.success) {
      return { error: 'Invalid input data.', details: parsed.error.format() };
    }

    const result = await retrainModel(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Retraining failed:', error);
    return { error: 'An unexpected error occurred during retraining.' };
  }
}

const alertnessAdvisorSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required."),
  vitalsData: z.string().min(1, "Vitals data is required."),
});

export async function handleAlertnessAdvice(formData: FormData) {
  try {
    const parsed = alertnessAdvisorSchema.safeParse({
      patientId: formData.get('patientId'),
      vitalsData: formData.get('vitalsData'),
    });

    if (!parsed.success) {
      return { error: 'Invalid input data.', details: parsed.error.format() };
    }

    const result = await getAlertAdvice(parsed.data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Alertness advice failed:', error);
    return { error: 'An unexpected error occurred while getting advice.' };
  }
}

const emailSchema = z.object({
  email: z.string().email(),
  patient: z.custom<Patient>()
});

export async function handleSendEmail(email: string, patient: Patient) {
  try {
    const parsed = emailSchema.safeParse({
      email,
      patient,
    });
    if (!parsed.success) {
      return { error: 'Invalid input for sending email.' };
    }
    console.log(`Sending email to ${email} for patient ${patient.name}`);
    // This is a placeholder for a real email sending service
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Email sent successfully (simulated).');
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { error: 'An unexpected error occurred while sending the email.' };
  }
}
