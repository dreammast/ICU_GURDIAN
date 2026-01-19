import { config } from 'dotenv';
config();

import '@/ai/flows/online-retraining-model.ts';
import '@/ai/flows/ai-powered-alertness-advisor.ts';
import '@/ai/flows/predict-risk-from-lab-reports.ts';