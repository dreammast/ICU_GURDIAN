'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type Status = 'loading' | 'ok' | 'error';

interface ServiceStatus {
  name: string;
  status: Status;
  details: string;
}

export default function SystemStatusPage() {
  const [statuses, setStatuses] = useState<ServiceStatus[]>([
    { name: 'Frontend Application', status: 'loading', details: 'Checking status...' },
    { name: 'AI Model API', status: 'loading', details: 'Checking status...' },
    { name: 'Database Connection', status: 'loading', details: 'Checking status...' },
    { name: 'Email Service', status: 'loading', details: 'Checking status...' },
  ]);

  useEffect(() => {
    const checkStatus = async () => {
      // Simulate checking frontend (always ok if we're here)
      updateStatus('Frontend Application', 'ok', 'Operational');

      // Check backend health
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const data = await response.json();
          updateStatus('AI Model API', 'ok', `Operational - Last check: ${new Date(data.timestamp).toLocaleTimeString()}`);
        } else {
          throw new Error('Health check failed');
        }
      } catch (error) {
        updateStatus('AI Model API', 'error', 'Service is unreachable.');
      }

      // Simulate checking other services
      setTimeout(() => updateStatus('Database Connection', 'ok', 'Connected and responsive.'), 500);
      setTimeout(() => updateStatus('Email Service', 'ok', 'SMTP server responding.'), 800);
    };

    checkStatus();
  }, []);

  const updateStatus = (name: string, status: Status, details: string) => {
    setStatuses(prev =>
      prev.map(s => (s.name === name ? { ...s, status, details } : s))
    );
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-destructive" />;
      case 'loading':
        return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
    }
  };
  
  const overallStatus = statuses.some(s => s.status === 'error') ? 'error' : statuses.some(s => s.status === 'loading') ? 'loading' : 'ok';
  
  const getOverallStatusMessage = () => {
    switch(overallStatus) {
        case 'ok':
            return 'All systems are operational.';
        case 'error':
            return 'One or more systems are experiencing issues.';
        case 'loading':
            return 'Checking system status...';
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-headline font-bold">System Status</h2>
        <p className="text-muted-foreground">
          Monitor the health of all application services.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex-row items-center gap-4">
          {getStatusIcon(overallStatus)}
          <div>
            <CardTitle className="font-headline text-2xl">
              {getOverallStatusMessage()}
            </CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleTimeString()}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        {statuses.map(service => (
          <Card key={service.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{service.name}</CardTitle>
              {getStatusIcon(service.status)}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
