import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Patient } from '@/lib/types';
import { Badge } from '../ui/badge';
import { getRiskColorClass } from '@/lib/utils';

interface PatientHeaderProps {
  patient: Patient;
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
    const riskColorClass = getRiskColorClass(patient.riskLevel);
    const riskPercentage = (patient.riskScore * 100).toFixed(0);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <Avatar className="h-24 w-24 border">
        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="text-4xl font-headline font-bold">{patient.name}</h2>
        <p className="text-muted-foreground">Patient ID: {patient.id}</p>
        <div className="mt-2 flex items-center gap-4 text-sm">
            <Badge variant="outline">Age: {patient.age}</Badge>
            <Badge variant="outline">Sex: {patient.sex}</Badge>
        </div>
      </div>
      <div className={`p-4 rounded-lg border-2 bg-card text-center ${riskColorClass}`}>
        <p className="text-sm font-medium">Current Risk</p>
        <p className={`text-4xl font-bold font-headline ${riskColorClass.split(' ')[1]}`}>{riskPercentage}%</p>
        <p className="text-sm font-semibold">{patient.riskLevel}</p>
      </div>
    </div>
  );
}
