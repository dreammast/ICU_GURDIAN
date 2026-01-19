'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getRiskColorClass } from '@/lib/utils';
import type { Patient } from '@/lib/types';
import VitalsMiniChart from './vitals-mini-chart';
import { Badge } from '@/components/ui/badge';

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const riskColorClass = getRiskColorClass(patient.riskLevel);
  const riskPercentage = (patient.riskScore * 100).toFixed(0);

  return (
    <Card className={`flex flex-col transition-all duration-300 border-2 ${riskColorClass}`}>
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl">{patient.name}</CardTitle>
          <CardDescription>Patient ID: {patient.id}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-muted-foreground">Risk Score</span>
          <Badge variant={patient.riskLevel === 'High' ? 'destructive' : patient.riskLevel === 'Moderate' ? 'secondary' : 'default'} className={patient.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : ''}>
            {patient.riskLevel}
          </Badge>
        </div>
        <p className={`text-5xl font-bold font-headline mb-4 ${riskColorClass.split(' ')[1]}`}>
          {riskPercentage}%
        </p>

        <VitalsMiniChart vitals={patient.vitals} />
        
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Last update: {patient.lastUpdate}</span>
        <Button asChild variant="ghost" size="sm" className="-mr-2">
          <Link href={`/patient/${patient.id}`}>
            Details <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
