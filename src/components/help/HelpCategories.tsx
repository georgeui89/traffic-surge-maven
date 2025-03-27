
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import HelpArticle from "./HelpArticle";
import { helpCategoriesData } from "@/utils/helpData";

export default function HelpCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("getting-started");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const filteredCategories = searchQuery 
    ? helpCategoriesData.map(category => ({
        ...category,
        articles: category.articles.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(category => category.articles.length > 0)
    : helpCategoriesData;

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticle(articleId);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/30 border-border/30 focus-visible:ring-neon-cyan/30 focus-visible:border-neon-cyan/50"
        />
      </div>

      {!selectedArticle ? (
        <Tabs 
          defaultValue={selectedCategory} 
          onValueChange={setSelectedCategory}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-4 h-auto mb-6">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {filteredCategories.map((category) => (
            <TabsContent 
              key={category.id} 
              value={category.id} 
              className="flex-1 bg-card/30 rounded-lg p-4 border border-border/30 overflow-hidden flex flex-col"
            >
              <h2 className="text-xl font-medium text-neon-cyan mb-2">{category.title}</h2>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <Separator className="mb-4" />
              
              <ScrollArea className="flex-1 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.articles.map((article) => (
                    <div 
                      key={article.id}
                      onClick={() => handleArticleSelect(article.id)}
                      className="p-4 rounded-lg border border-border/50 hover:border-neon-cyan/50 bg-card/50 cursor-pointer transition-all duration-200 hover:shadow-sm hover:shadow-neon-cyan/20"
                    >
                      <h3 className="font-medium">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <HelpArticle 
          articleId={selectedArticle} 
          onBack={handleBackToList} 
        />
      )}
    </div>
  );
}
