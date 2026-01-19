'use client';

import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PatientCard from '@/components/dashboard/patient-card';
import { getInitialPatientData, updatePatientData } from '@/lib/data';
import type { Patient, Alert } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { handleSendEmail } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const INITIAL_PATIENT_COUNT = 8;

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPatients(getInitialPatientData(INITIAL_PATIENT_COUNT));
  }, []);

  const runUpdate = useCallback(() => {
    const alertsToSend: Array<{ alertId: string; email: string; patient: Patient }> = [];
    
    setPatients(prevPatients =>
      prevPatients.map(p => {
        const updatedPatient = updatePatientData(p);
        if (updatedPatient.riskLevel === 'High' && p.riskLevel !== 'High') {
          const alertId = `alert-${Date.now()}-${p.id}`;
          const newAlert: Alert = {
            id: alertId,
            patientId: p.id,
            patientName: p.name,
            riskScore: updatedPatient.riskScore,
            timestamp: new Date().toLocaleTimeString(),
            emailNotification: updatedPatient.email ? {
              email: updatedPatient.email,
              sent: false,
            } : undefined,
          };
          setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
          
          // Collect alerts that need email sending (outside of render cycle)
          if(updatedPatient.email) {
            alertsToSend.push({
              alertId,
              email: updatedPatient.email,
              patient: updatedPatient,
            });
          }
        }
        return updatedPatient;
      })
    );
    
    // Send emails after state update completes (outside render cycle)
    if (alertsToSend.length > 0) {
      alertsToSend.forEach(({ alertId, email, patient }) => {
        startTransition(() => {
          handleSendEmail(email, patient).then(response => {
            if (response.success) {
              // Update the alert with email sent status
              setAlerts(prevAlerts => 
                prevAlerts.map(alert => 
                  alert.id === alertId 
                    ? {
                        ...alert,
                        emailNotification: {
                          ...alert.emailNotification!,
                          sent: true,
                          sentAt: new Date().toLocaleTimeString(),
                        }
                      }
                    : alert
                )
              );
              toast({
                title: 'Alert Email Sent',
                description: `An email alert for ${patient.name} has been sent to ${email}.`,
              });
            } else {
              // Update the alert with email error status
              setAlerts(prevAlerts => 
                prevAlerts.map(alert => 
                  alert.id === alertId 
                    ? {
                        ...alert,
                        emailNotification: {
                          ...alert.emailNotification!,
                          sent: false,
                          error: response.error,
                        }
                      }
                    : alert
                )
              );
              toast({
                variant: 'destructive',
                title: 'Email Failed',
                description: response.error,
              });
            }
          });
        });
      });
    }
  }, [toast, startTransition]);
  
  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(runUpdate, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring, runUpdate]);

  const handleRefresh = () => {
    setPatients(getInitialPatientData(INITIAL_PATIENT_COUNT));
    setAlerts([]);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
            <Switch id="auto-monitoring" checked={isMonitoring} onCheckedChange={setIsMonitoring} />
            <Label htmlFor="auto-monitoring" className="text-lg">Auto Monitoring</Label>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsMonitoring(!isMonitoring)} variant="outline">
            {isMonitoring ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isMonitoring ? 'Stop' : 'Start'}
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {patients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
