import { getRiskLevel } from '@/lib/utils';
import type { Patient, Vital, RiskHistory } from './types';

const names = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Williams', 'Michael Brown', 'Jessica Garcia', 'William Miller', 'Linda Davis'];
const emails = ['john.doe@example.com', 'jane.smith@example.com', 'robert.johnson@example.com', 'emily.williams@example.com', 'michael.brown@example.com', 'jessica.garcia@example.com', 'william.miller@example.com', 'linda.davis@example.com'];
const sexes: ('Male' | 'Female')[] = ['Male', 'Female'];

// Helper to generate a random integer within a range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to generate a random float within a range
const randomFloat = (min: number, max: number, decimals: number = 2) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

// Generates a single vital signs record
const generateVital = (timestamp: number): Vital => ({
  timestamp,
  hr: randomInt(55, 120),
  spo2: randomInt(92, 100),
  rr: randomInt(12, 25),
  bp: {
    systolic: randomInt(90, 160),
    diastolic: randomInt(60, 100),
  },
});

// Generates a single risk history record
const generateRiskHistory = (timestamp: number): RiskHistory => ({
  timestamp,
  score: randomFloat(0.1, 0.95),
});

// Creates a full patient profile
const createPatient = (id: number): Patient => {
  const name = names[id % names.length];
  const email = emails[id % emails.length];
  const now = Date.now();
  const vitals: Vital[] = [];
  const riskHistory: RiskHistory[] = [];

  for (let i = 20; i > 0; i--) {
    const timestamp = now - i * 5 * 60 * 1000; // every 5 minutes for the last ~1.5 hours
    vitals.push(generateVital(timestamp));
    riskHistory.push(generateRiskHistory(timestamp));
  }
  
  const currentRiskScore = riskHistory[riskHistory.length - 1].score;

  return {
    id: `P${1001 + id}`,
    name,
    age: randomInt(35, 85),
    sex: sexes[id % sexes.length],
    riskScore: currentRiskScore,
    riskLevel: getRiskLevel(currentRiskScore),
    lastUpdate: new Date().toLocaleTimeString(),
    vitals,
    riskHistory,
    avatarUrl: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
    email: email,
  };
};

export const getInitialPatientData = (count: number): Patient[] => {
  return Array.from({ length: count }, (_, i) => createPatient(i));
};

export const updatePatientData = (patient: Patient): Patient => {
    const now = Date.now();
    const lastVital = patient.vitals[patient.vitals.length - 1];
    
    // Generate new risk score based on trend
    const lastRisk = patient.riskHistory[patient.riskHistory.length - 1].score;
    const trend = (Math.random() - 0.45) * 0.1; // small random change
    let newRiskScore = Math.max(0, Math.min(1, lastRisk + trend));

    // Generate new vitals based on trend
    const newVital: Vital = {
        timestamp: now,
        hr: Math.min(140, Math.max(50, lastVital.hr + randomInt(-3, 3))),
        spo2: Math.min(100, Math.max(90, lastVital.spo2 + randomInt(-1, 1))),
        rr: Math.min(30, Math.max(10, lastVital.rr + randomInt(-2, 2))),
        bp: {
            systolic: Math.min(180, Math.max(80, lastVital.bp.systolic + randomInt(-5, 5))),
            diastolic: Math.min(110, Math.max(50, lastVital.bp.diastolic + randomInt(-4, 4))),
        },
    }

    const newRisk: RiskHistory = {
        timestamp: now,
        score: newRiskScore,
    }

    const updatedPatient = {
        ...patient,
        riskScore: newRiskScore,
        riskLevel: getRiskLevel(newRiskScore),
        lastUpdate: new Date().toLocaleTimeString(),
        vitals: [...patient.vitals.slice(1), newVital],
        riskHistory: [...patient.riskHistory.slice(1), newRisk],
    };

    return updatedPatient;
}
