export type Vital = {
  timestamp: number;
  hr: number;
  spo2: number;
  rr: number;
  bp: {
    systolic: number;
    diastolic: number;
  };
};

export type RiskHistory = {
  timestamp: number;
  score: number;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female';
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  lastUpdate: string;
  vitals: Vital[];
  riskHistory: RiskHistory[];
  avatarUrl: string;
  email?: string;
};

export type Alert = {
  id: string;
  patientId: string;
  patientName: string;
  riskScore: number;
  timestamp: string;
  emailNotification?: {
    email: string;
    sent: boolean;
    sentAt?: string;
    error?: string;
  };
};
