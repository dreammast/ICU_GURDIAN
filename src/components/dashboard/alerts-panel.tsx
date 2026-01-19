'use client';

import { Bell, ArrowRight, Mail, MailCheck, MailX, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Alert } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 bg-destructive/10 rounded-md">
            <Bell className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="font-headline">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[60vh]">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No recent alerts.
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id}>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{alert.patientName}</p>
                              {alert.emailNotification && (
                                <div className="flex items-center gap-1">
                                  {alert.emailNotification.sent ? (
                                    <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                                      <MailCheck className="h-3 w-3 mr-1" />
                                      Email Sent
                                    </Badge>
                                  ) : alert.emailNotification.error ? (
                                    <Badge variant="destructive" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                                      <MailX className="h-3 w-3 mr-1" />
                                      Email Failed
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Sending...
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                            Risk Score: <span className="font-bold text-destructive">{(alert.riskScore * 100).toFixed(0)}%</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                            {alert.emailNotification && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span>{alert.emailNotification.email}</span>
                                {alert.emailNotification.sentAt && (
                                  <span className="text-muted-foreground/70">• Sent at {alert.emailNotification.sentAt}</span>
                                )}
                                {alert.emailNotification.error && (
                                  <span className="text-red-500">• {alert.emailNotification.error}</span>
                                )}
                              </div>
                            )}
                        </div>
                        <Button asChild variant="outline" size="icon" className="h-8 w-8 ml-2">
                            <Link href={`/patient/${alert.patientId}`}>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <Separator />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
