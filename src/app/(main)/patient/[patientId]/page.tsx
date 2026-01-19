import { getInitialPatientData } from '@/lib/data';
import { notFound } from 'next/navigation';
import PatientHeader from '@/components/patient/patient-header';
import RiskHistoryChart from '@/components/patient/risk-history-chart';
import VitalsTimelineChart from '@/components/patient/vitals-timeline-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PatientPage({ params }: { params: { patientId: string } }) {
  const allPatients = getInitialPatientData(8);
  const patient = allPatients.find(p => p.id === params.patientId);

  if (!patient) {
    notFound();
  }

  return (
    <div className="container mx-auto space-y-8">
      <PatientHeader patient={patient} />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="font-headline">Risk Score History</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskHistoryChart history={patient.riskHistory} />
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Download Data</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Vitals CSV
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Prediction History CSV
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Vitals Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <VitalsTimelineChart vitals={patient.vitals} />
        </CardContent>
      </Card>
    </div>
  );
}
