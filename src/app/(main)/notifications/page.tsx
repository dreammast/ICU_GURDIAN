'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AlertsPanel from '@/components/dashboard/alerts-panel';
import { getInitialPatientData, updatePatientData } from '@/lib/data';
import type { Patient, Alert } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { handleSendEmail } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const INITIAL_PATIENT_COUNT = 8;

export default function NotificationsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPatients(getInitialPatientData(INITIAL_PATIENT_COUNT));
  }, []);

  const runUpdate = useCallback(() => {
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
          
          if(updatedPatient.email) {
            handleSendEmail(updatedPatient.email, updatedPatient).then(response => {
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
                  description: `An email alert for ${updatedPatient.name} has been sent to ${updatedPatient.email}.`,
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
          }
        }
        return updatedPatient;
      })
    );
  }, [toast]);
  
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
        <div>
          <h2 className="text-3xl font-headline font-bold">Notifications</h2>
          <p className="text-muted-foreground">View real-time high-risk alerts for all patients.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
                <Switch id="auto-monitoring" checked={isMonitoring} onCheckedChange={setIsMonitoring} />
                <Label htmlFor="auto-monitoring">Live Alerts</Label>
            </div>
            <Button onClick={() => setAlerts([])} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Alerts
            </Button>
        </div>
      </div>
      <AlertsPanel alerts={alerts} />
    </div>
  );
}
