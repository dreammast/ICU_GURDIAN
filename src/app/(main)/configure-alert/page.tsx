import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Smartphone, User, AlertTriangle } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function ConfigureAlertPage() {
  return (
    <div className="container mx-auto max-w-2xl">
      <h2 className="text-3xl font-headline font-bold mb-2">Configure Alerts</h2>
      <p className="text-muted-foreground mb-8">
        Set up email and SMS notifications for high-risk alerts for specific patients.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Patient-Specific Alert</CardTitle>
          <CardDescription>
            Enter the patient's ID and contact details for alert notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientId" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Patient ID
            </Label>
            <Input id="patientId" type="text" placeholder="e.g., P1001" />
            <p className="text-xs text-muted-foreground">Specify the patient to configure alerts for.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email (Gmail SMTP)
            </Label>
            <Input id="email" type="email" placeholder="doctor@example.com" />
            <p className="text-xs text-muted-foreground">Alerts will be sent from the configured Gmail account.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Phone Number (Twilio)
            </Label>
            <Input id="phone" type="tel" placeholder="+1234567890" />
            <p className="text-xs text-muted-foreground">Ensure the number is in E.164 format. Standard messaging rates may apply.</p>
          </div>
          <div className="space-y-4">
            <Label htmlFor="threshold" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Alert Threshold
            </Label>
            <div className="flex items-center gap-4">
                <Slider id="threshold" defaultValue={[80]} max={100} step={5} className="flex-1" />
                <span className="font-bold text-lg w-16 text-center">80%</span>
            </div>
            <p className="text-xs text-muted-foreground">Set the risk score percentage that will trigger an alert.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Configuration</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
