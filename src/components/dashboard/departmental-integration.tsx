import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { departmentIntegrationData } from "@/lib/data";

type DepartmentKey = keyof typeof departmentIntegrationData;

export default function DepartmentIntegration() {
  return (
    <Card className="xl:col-span-1" x-chunk="dashboard-01-chunk-4">
      <CardHeader>
        <CardTitle className="font-headline">Departmental Integration</CardTitle>
        <CardDescription>Cross-departmental operational data streams.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="saps">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {(Object.keys(departmentIntegrationData) as DepartmentKey[]).map(key => (
              <TabsTrigger key={key} value={key} className="capitalize text-xs">
                {key === 'private' ? 'Partners' : key.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          {(Object.keys(departmentIntegrationData) as DepartmentKey[]).map(key => {
            const dept = departmentIntegrationData[key];
            return (
              <TabsContent key={key} value={key} className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><dept.icon className="h-5 w-5"/>{dept.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {dept.stats.map(stat => (
                      <div key={stat.label} className="flex items-start gap-3">
                         <div className="flex-shrink-0 w-5 h-5 mt-0.5"><stat.icon className="h-5 w-5 text-primary" /></div>
                         <div>
                            <p className="font-medium text-muted-foreground">{stat.label}</p>
                            <p className="font-semibold text-foreground">{stat.value}</p>
                         </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
