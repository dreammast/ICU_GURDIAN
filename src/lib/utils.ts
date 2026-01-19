import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Patient } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskLevel(score: number): Patient['riskLevel'] {
  if (score >= 0.8) return 'High';
  if (score >= 0.5) return 'Moderate';
  return 'Low';
}

export function getRiskColorClass(level: Patient['riskLevel']): string {
  switch (level) {
    case 'High':
      return 'border-destructive/80 text-destructive';
    case 'Moderate':
      return 'border-primary/80 text-primary-foreground';
    case 'Low':
      return 'border-green-500/80 text-green-600';
    default:
      return 'border-border';
  }
}
