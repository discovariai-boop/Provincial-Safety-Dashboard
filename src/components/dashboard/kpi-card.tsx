import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface KpiCardProps {
    title: string;
    value: string;
    target: string;
    trend: string;
    trendDirection: "up" | "down";
    status: "success" | "warning" | "danger";
}

export default function KpiCard({ title, value, target, trend, trendDirection, status }: KpiCardProps) {
    const trendIcon = trendDirection === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    
    const trendColor = status === "success" ? "text-green-400" : status === "warning" ? "text-yellow-400" : "text-red-400";
    
    const borderColor = status === "success" ? "border-green-400/50" : status === "warning" ? "border-yellow-400/50" : "border-red-400/50";
    
    return (
        <Card className={cn("bg-muted/30 border", borderColor)}>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold font-headline text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground flex justify-between items-center">
                    <span>Target: {target}</span>
                    <span className={cn("flex items-center font-semibold", trendColor)}>
                        {trendIcon}
                        {trend}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
