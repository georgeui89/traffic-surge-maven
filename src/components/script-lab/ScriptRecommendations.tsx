
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, AlertTriangle, ShieldAlert, Gauge } from "lucide-react";

const recommendations = [
  {
    id: "1",
    title: "Increase delay time",
    description: "Adding a 35ms delay before redirect could improve acceptance rate by 12%",
    improvement: "+12%",
    impact: "high",
    icon: <Gauge className="h-4 w-4" />,
  },
  {
    id: "2",
    title: "Add user-agent detection",
    description: "Serving mobile-specific content could increase CTR by 8%",
    improvement: "+8%",
    impact: "medium",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: "3",
    title: "Security vulnerability",
    description: "Your script contains an unsecured external request",
    improvement: "Security",
    impact: "critical",
    icon: <ShieldAlert className="h-4 w-4" />,
  },
];

const ScriptRecommendations = () => {
  return (
    <Card className="shadow-modern border border-border/50">
      <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
        <CardTitle className="text-xl">AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div 
              key={rec.id}
              className={`
                p-4 rounded-lg border flex flex-col gap-2
                ${rec.impact === 'critical' ? 'bg-destructive/10 border-destructive/30' : 
                  rec.impact === 'high' ? 'bg-success/10 border-success/30' :
                  'bg-muted/30 border-border/50'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2 items-center">
                  <div className={`
                    rounded-full p-1.5
                    ${rec.impact === 'critical' ? 'bg-destructive/20 text-destructive' : 
                      rec.impact === 'high' ? 'bg-success/20 text-success' :
                      'bg-muted-foreground/20 text-muted-foreground'}
                  `}>
                    {rec.icon}
                  </div>
                  <span className="font-medium">{rec.title}</span>
                </div>
                <span className={`
                  text-xs font-medium px-2 py-0.5 rounded-full
                  ${rec.impact === 'critical' ? 'bg-destructive text-destructive-foreground' : 
                    rec.impact === 'high' ? 'bg-success text-success-foreground' :
                    'bg-primary text-primary-foreground'}
                `}>
                  {rec.improvement}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              <Button 
                variant={rec.impact === 'critical' ? 'destructive' : 'default'} 
                size="sm" 
                className="mt-1 w-full"
              >
                Apply Fix
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptRecommendations;
