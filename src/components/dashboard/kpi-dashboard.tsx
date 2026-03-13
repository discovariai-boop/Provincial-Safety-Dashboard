import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { kpiData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

function TrendIcon({ trend, status }: { trend: string; status: "success" | "warning" | "neutral" }) {
  const trendClass = status === "success" ? "text-green-400" : status === "warning" ? "text-yellow-400" : "text-muted-foreground";

  if (trend.startsWith("↑")) {
    return <ArrowUp className={cn("h-4 w-4", trendClass)} />;
  }
  if (trend.startsWith("↓")) {
    return <ArrowDown className={cn("h-4 w-4", trendClass)} />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function KpiDashboard() {
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader>
        <CardTitle className="font-headline">Real-Time KPI Dashboard</CardTitle>
        <CardDescription>Premier's weekly performance metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>This Week</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kpiData.map((kpi) => (
              <TableRow key={kpi.metric}>
                <TableCell className="font-medium">{kpi.metric}</TableCell>
                <TableCell>{kpi.thisWeek}</TableCell>
                <TableCell>{kpi.target}</TableCell>
                <TableCell>
                  <div className={cn("w-3 h-3 rounded-full", kpi.status === 'success' ? 'bg-green-500' : 'bg-yellow-500')}></div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                        <TrendIcon trend={kpi.trend} status={kpi.trendStatus as "success" | "warning" | "neutral"}/>
                        <span>{kpi.trend}</span>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
