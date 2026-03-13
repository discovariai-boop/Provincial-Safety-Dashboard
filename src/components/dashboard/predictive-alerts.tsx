import { predictiveRiskAlerts, type PredictiveRiskAlertsOutput } from "@/ai/flows/predictive-risk-alerts-flow";
import { predictiveAIInput } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

function AlertIcon({ riskLevel }: { riskLevel: string }) {
    switch (riskLevel) {
        case 'CRITICAL':
            return <ShieldAlert className="h-4 w-4" />;
        case 'WARNING':
            return <AlertTriangle className="h-4 w-4" />;
        default:
            return <Info className="h-4 w-4" />;
    }
}

function getAlertVariant(riskLevel: string) {
    if (riskLevel === 'CRITICAL') {
        return 'destructive';
    }
    return 'default';
}

export default async function PredictiveAlerts() {
  let alerts: PredictiveRiskAlertsOutput['alerts'] = [];
  try {
    const result = await predictiveRiskAlerts(predictiveAIInput);
    alerts = result.alerts;
  } catch (error) {
    console.error("Error fetching predictive alerts:", error);
    // Provide fallback/mock data on error
    alerts = [
        { id: 'err-1', riskLevel: 'CRITICAL', location: 'R101 18:15', message: 'Heist likely - Pre-position Unit 319', suggestedAction: 'Pre-position assets.', confidence: '84%' },
        { id: 'err-2', riskLevel: 'WARNING', location: 'N1 KM40-50', message: 'Fatigue crashes rising - Add patrols', suggestedAction: 'Increase patrol visibility.', confidence: '76%' }
    ];
  }

  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle className="font-headline">Predictive Analytics & Risk</CardTitle>
        <CardDescription>AI-powered risk forecasting and Premier's alerts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={getAlertVariant(alert.riskLevel)}>
            <AlertIcon riskLevel={alert.riskLevel} />
            <AlertTitle className="flex justify-between">
              <span>{alert.riskLevel}: {alert.location}</span>
              {alert.confidence && <span className="text-sm font-medium">{alert.confidence} conf.</span>}
            </AlertTitle>
            <AlertDescription>
                <p className="font-semibold">{alert.message}</p>
                <p className="text-muted-foreground">{alert.suggestedAction}</p>
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
