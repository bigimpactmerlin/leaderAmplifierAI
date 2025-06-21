
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";

interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
}

interface ContentSelection {
  ideaId: number;
  platform: string;
  contentType: string;
}

const IdeasTab = () => {
  const { toast } = useToast();
  const [ideas] = useState<Idea[]>([
    { id: 1, title: "AI in Healthcare", description: "Explore AI applications in medical diagnosis", category: "Tech", status: "New" },
    { id: 2, title: "Remote Work Trends", description: "Analyze latest remote work statistics", category: "Business", status: "New" },
    { id: 3, title: "Sustainable Fashion", description: "Eco-friendly fashion brands spotlight", category: "Fashion", status: "New" },
    { id: 4, title: "Social Media Marketing", description: "Best practices for 2024", category: "Marketing", status: "New" },
    { id: 5, title: "Fitness Technology", description: "Wearable fitness tracker comparison", category: "Fitness", status: "New" }
  ]);

  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([]);
  const [contentSelections, setContentSelections] = useState<ContentSelection[]>([]);

  const platformContentTypes = {
    LinkedIn: ["Article", "Post", "Newsletter", "Image"],
    Instagram: ["Reels", "Post", "Story", "Image"],
    YouTube: ["Video", "Shorts"],
    Twitter: ["Tweet", "Thread", "Image"],
    Facebook: ["Post", "Article", "Image", "Video"],
    TikTok: ["Video", "Shorts"]
  };

  const handleRowClick = (ideaId: number) => {
    setSelectedIdeas(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const handleContentSelection = (ideaId: number, platform: string, contentType: string) => {
    const newSelection: ContentSelection = { ideaId, platform, contentType };
    
    setContentSelections(prev => {
      const filtered = prev.filter(sel => !(sel.ideaId === ideaId && sel.platform === platform));
      return [...filtered, newSelection];
    });

    toast({
      title: "Content Type Selected",
      description: `${platform} ${contentType} selected for "${ideas.find(i => i.id === ideaId)?.title}"`
    });
  };

  const handleGenerateContent = () => {
    if (selectedIdeas.length === 0) {
      toast({
        title: "No ideas selected",
        description: "Please select at least one idea to generate content",
        variant: "destructive"
      });
      return;
    }

    if (contentSelections.length === 0) {
      toast({
        title: "No content types selected",
        description: "Please select content types for your ideas",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Content Generation Started",
      description: `Generating ${contentSelections.length} content pieces for ${selectedIdeas.length} selected ideas`
    });
  };

  const getSelectionForIdea = (ideaId: number, platform: string) => {
    return contentSelections.find(sel => sel.ideaId === ideaId && sel.platform === platform);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-slate-600/30 shadow-2xl">
      <CardHeader className="border-b border-slate-600/30 bg-gradient-to-r from-slate-800/30 to-slate-700/30">
        <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-2xl font-bold">
          Content Ideas
        </CardTitle>
        <p className="text-slate-300">Click on ideas to select them, then choose content types for each platform</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <Button 
            onClick={handleGenerateContent}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            disabled={selectedIdeas.length === 0 || contentSelections.length === 0}
          >
            Generate Content ({contentSelections.length} pieces) ✨
          </Button>
        </div>
        
        <div className="rounded-xl overflow-hidden border border-slate-600/30 bg-gradient-to-br from-slate-800/30 to-slate-900/30">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-600/30 bg-gradient-to-r from-slate-700/50 to-slate-800/50">
                <TableHead className="text-slate-200 font-semibold text-sm uppercase tracking-wide">Title</TableHead>
                <TableHead className="text-slate-200 font-semibold text-sm uppercase tracking-wide">Description</TableHead>
                <TableHead className="text-slate-200 font-semibold text-sm uppercase tracking-wide">Category</TableHead>
                <TableHead className="text-slate-200 font-semibold text-sm uppercase tracking-wide">Status</TableHead>
                <TableHead className="text-slate-200 font-semibold text-sm uppercase tracking-wide">Content Types</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ideas.map((idea) => (
                <TableRow 
                  key={idea.id} 
                  className={`border-slate-600/20 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-700/30 hover:to-slate-600/30 ${
                    selectedIdeas.includes(idea.id) 
                      ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-400/30 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleRowClick(idea.id)}
                >
                  <TableCell className="text-slate-100 font-medium text-base py-4">{idea.title}</TableCell>
                  <TableCell className="text-slate-300 py-4">{idea.description}</TableCell>
                  <TableCell className="text-slate-300 py-4">{idea.category}</TableCell>
                  <TableCell className="py-4">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-400/30">
                      {idea.status}
                    </span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()} className="py-4">
                    {selectedIdeas.includes(idea.id) && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(platformContentTypes).map(([platform, contentTypes]) => (
                          <DropdownMenu key={platform}>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`text-xs font-medium transition-all duration-200 ${
                                  getSelectionForIdea(idea.id, platform) 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md hover:from-blue-700 hover:to-purple-700' 
                                    : 'bg-slate-700/50 text-slate-300 border-slate-500/30 hover:bg-slate-600/50 hover:text-slate-200'
                                }`}
                              >
                                {platform}
                                {getSelectionForIdea(idea.id, platform) && 
                                  `: ${getSelectionForIdea(idea.id, platform)?.contentType}`
                                }
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-600 shadow-xl backdrop-blur-sm" align="start">
                              <DropdownMenuLabel className="text-slate-200 font-semibold">{platform} Content Types</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-slate-600" />
                              {contentTypes.map((contentType) => (
                                <DropdownMenuItem
                                  key={contentType}
                                  onClick={() => handleContentSelection(idea.id, platform, contentType)}
                                  className="text-slate-300 hover:bg-slate-700 hover:text-slate-100 cursor-pointer transition-colors duration-200"
                                >
                                  {contentType}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeasTab;
