import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { executiveKpis, incidents } from "@/lib/data";
import { PlayCircle, Pin, Clock, User, Car, Siren, Users } from "lucide-react";
import KpiCard from "./kpi-card";
import { cn } from "@/lib/utils";

export default function LiveIncidents() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'heatmap-map');

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-destructive border-destructive/50 bg-destructive/10";
      case "Medium":
        return "text-yellow-400 border-yellow-400/50 bg-yellow-400/10";
      default:
        return "text-muted-foreground border-muted-foreground/50 bg-muted-foreground/10";
    }
  };

  const getIncidentIcon = (type: string) => {
    if (type.includes("Crash")) return <Car className="h-4 w-4" />;
    if (type.includes("Heist")) return <Siren className="h-4 w-4" />;
    if (type.includes("Robbery")) return <Users className="h-4 w-4" />;
    return <Siren className="h-4 w-4" />;
  };

  return (
    <Card className="xl:col-span-2 border-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle className="font-headline text-2xl">Live Crisis Overview ({incidents.length} Active)</CardTitle>
          <CardDescription>
            Real-time provincial heatmap and incident command.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg border-2 border-primary/50 shadow-inner shadow-primary/20">
              {mapImage && (
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={mapImage.imageHint}
                  className="opacity-70"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              <div className="absolute top-2 right-2 flex gap-2">
                  <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-slow"></div>Crash</div>
                  <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse-slow"></div>Heist</div>
                  <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse-slow"></div>Robbery</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {executiveKpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="font-headline text-lg mb-2">Active Incidents</h3>
             <div className="space-y-4">
                {incidents.map((incident) => (
                    <Card key={incident.id} className="bg-background/50 hover:bg-muted/50 transition-colors">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className={cn("font-bold mb-2", getPriorityClass(incident.priority))}>
                                        {incident.priority}
                                    </Badge>
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                      {getIncidentIcon(incident.type)} {incident.type}
                                    </CardTitle>
                                </div>
                                {incident.video && <Button variant="ghost" size="icon"><PlayCircle className="h-5 w-5 text-primary" /></Button>}
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
                           <div className="flex items-center gap-2"><Pin className="h-4 w-4"/><span>{incident.location}</span></div>
                           <div className="flex items-center gap-2"><Clock className="h-4 w-4"/><span>Police: {incident.etaPolice} | Ambulance: {incident.etaAmbulance}</span></div>
                           <div className="flex items-center gap-2"><User className="h-4 w-4"/><span>{incident.assigned} [{incident.status}]</span></div>
                        </CardContent>
                    </Card>
                ))}
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
