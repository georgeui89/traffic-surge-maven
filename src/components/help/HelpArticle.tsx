
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Printer, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { findArticleById } from "@/utils/helpData";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";

interface HelpArticleProps {
  articleId: string;
  onBack: () => void;
}

export default function HelpArticle({ articleId, onBack }: HelpArticleProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const article = findArticleById(articleId);

  if (!article) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-medium mb-2">Article not found</h2>
        <p className="text-muted-foreground mb-4">The requested article could not be found.</p>
        <Button onClick={onBack} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Help Center
        </Button>
      </div>
    );
  }

  const handleFeedback = (helpful: boolean) => {
    toast.success(`Thank you for your feedback${helpful ? "!" : "."} We'll use it to improve our documentation.`);
    setFeedbackSubmitted(true);
  };

  // Print functionality
  const handlePrint = () => {
    toast.success("Preparing document for printing...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      }).then(() => {
        toast.success("Shared successfully");
      }).catch(() => {
        toast.error("Error sharing content");
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/30 rounded-lg border border-border/30 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm" className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div className="flex items-center gap-2">
          {article.isNew && (
            <StatusBadge 
              variant="success" 
              label="NEW"
              size="sm"
            />
          )}
          <StatusBadge 
            variant="info" 
            label={`Last Updated: ${article.lastUpdated || 'Recently'}`}
            size="sm"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-2xl font-medium mb-2 text-gradient-cyan">{article.title}</h1>
          <p className="text-muted-foreground mb-6">{article.description}</p>

          <div className="space-y-8">
            {article.sections.map((section, index) => (
              <section key={index} className="space-y-4">
                <h2 className="text-xl font-medium text-neon-cyan mt-6">{section.title}</h2>
                <p className="text-muted-foreground">{section.content}</p>
                
                {section.image && (
                  <div className="my-4 rounded-lg border border-border overflow-hidden">
                    <div className="bg-card/50 p-6 flex items-center justify-center text-muted-foreground">
                      [Image: {section.image}]
                    </div>
                  </div>
                )}
                
                {section.steps && (
                  <ol className="mt-4 space-y-3 list-decimal list-inside">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-muted-foreground">
                        <span className="font-medium text-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
                
                {section.tips && (
                  <div className="mt-4 bg-neon-cyan/5 border border-neon-cyan/20 p-4 rounded-lg">
                    <h3 className="text-neon-cyan font-medium mb-2">Tips & Best Practices</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-muted-foreground text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          <Separator className="my-8" />
          
          <div className="bg-card/50 p-4 rounded-lg border border-border/50 mt-6">
            <h3 className="font-medium mb-2">Related Articles</h3>
            <ul className="space-y-1">
              {article.relatedArticles?.map((relatedId, index) => {
                const relatedArticle = findArticleById(relatedId);
                return relatedArticle ? (
                  <li key={index}>
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-neon-cyan"
                      onClick={() => onBack()}
                    >
                      {relatedArticle.title}
                    </Button>
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          <div className="bg-card/30 p-4 rounded-lg border border-border/30 mt-6">
            <h3 className="font-medium mb-4">Was this article helpful?</h3>
            {!feedbackSubmitted ? (
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleFeedback(true)}
                  className="flex gap-2"
                >
                  <ThumbsUp size={16} /> Yes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleFeedback(false)}
                  className="flex gap-2"
                >
                  <ThumbsDown size={16} /> No
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Thank you for your feedback!</p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Have more feedback? <Button variant="link" className="h-auto p-0 text-xs text-neon-cyan">Contact Support</Button>
            </p>
          </div>
        </article>
      </ScrollArea>
    </div>
  );
}
