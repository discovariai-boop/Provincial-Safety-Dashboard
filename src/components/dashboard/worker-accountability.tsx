import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { workers } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function WorkerAccountability() {
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle className="font-headline">Worker Accountability</CardTitle>
        <CardDescription>Live readiness & Proof-of-Work scores.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">PoW Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((worker) => (
              <TableRow key={worker.id}>
                <TableCell>
                  <div className="font-medium">{worker.id}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {worker.department}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", worker.statusColor)}></span>
                    <span>{worker.status}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{worker.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
