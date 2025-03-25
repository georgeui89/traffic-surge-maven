
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileCode, Clock, Smartphone, Code } from "lucide-react";

const templates = [
  {
    id: "basic-redirect",
    name: "Basic Redirect",
    description: "Simple timed redirect to a destination URL",
    code: `// Basic Redirect Script
setTimeout(() => {
  window.location.href = "https://example.com";
}, 1000); // 1 second delay`,
    icon: <Clock className="h-4 w-4" />,
    difficulty: "beginner",
  },
  {
    id: "device-detection",
    name: "Device Detection",
    description: "Redirect based on user's device type",
    code: `// Device Detection Redirect Script
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  window.location.href = "https://mobile.example.com";
} else {
  window.location.href = "https://desktop.example.com";
}`,
    icon: <Smartphone className="h-4 w-4" />,
    difficulty: "intermediate",
  },
  {
    id: "advanced",
    name: "Advanced Redirect",
    description: "Includes parameters and tracking",
    code: `// Advanced Redirect Script with Tracking
const urlParams = new URLSearchParams(window.location.search);
const source = urlParams.get('source') || 'direct';
const campaign = urlParams.get('campaign') || 'none';

// Track the visit
fetch('https://api.example.com/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ source, campaign })
})
.then(() => {
  // Redirect after tracking
  window.location.href = \`https://example.com?ref=\${source}&camp=\${campaign}\`;
})
.catch(err => {
  console.error('Tracking failed:', err);
  // Redirect anyway
  window.location.href = "https://example.com";
});`,
    icon: <Code className="h-4 w-4" />,
    difficulty: "advanced",
  },
];

interface ScriptTemplatesProps {
  onSelectTemplate: (template: typeof templates[0]) => void;
}

const ScriptTemplates = ({ onSelectTemplate }: ScriptTemplatesProps) => {
  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="relative flex flex-col p-4 border border-border/50 rounded-lg bg-card hover:bg-muted/20 transition-colors cursor-pointer"
        >
          <div className="absolute top-3 right-3">
            <StatusBadge 
              variant={
                template.difficulty === "beginner" 
                  ? "success" 
                  : template.difficulty === "intermediate" 
                  ? "warning" 
                  : "info"
              } 
              label={template.difficulty}
              size="sm"
            />
          </div>
          <div className="flex items-center mb-2">
            <div className="mr-2 p-1.5 bg-primary/10 rounded-md text-primary">
              {template.icon}
            </div>
            <h3 className="font-medium">{template.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onSelectTemplate(template)}
          >
            <FileCode className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ScriptTemplates;
