import { genkit } from 'genkit';
import { groq } from 'genkitx-groq';

export const ai = genkit({
  plugins: [groq({ apiKey: process.env.GROQ_API_KEY })],
  model: 'groq/meta-llama/llama-4-scout-17b-16e-instruct',
});
