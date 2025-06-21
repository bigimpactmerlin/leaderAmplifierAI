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
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Content Ideas</CardTitle>
        <p className="text-gray-300">Click on ideas to select them, then choose content types for each platform</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={handleGenerateContent}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            disabled={selectedIdeas.length === 0 || contentSelections.length === 0}
          >
            Generate Content ({contentSelections.length} pieces)
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white">Title</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Content Types</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideas.map((idea) => (
              <TableRow 
                key={idea.id} 
                className={`border-white/10 cursor-pointer transition-all hover:bg-white/5 ${
                  selectedIdeas.includes(idea.id) ? 'bg-purple-500/20 border-purple-400/30' : ''
                }`}
                onClick={() => handleRowClick(idea.id)}
              >
                <TableCell className="text-white font-medium">{idea.title}</TableCell>
                <TableCell className="text-gray-300">{idea.description}</TableCell>
                <TableCell className="text-gray-300">{idea.category}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    {idea.status}
                  </span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {selectedIdeas.includes(idea.id) && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(platformContentTypes).map(([platform, contentTypes]) => (
                        <DropdownMenu key={platform}>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`text-xs ${
                                getSelectionForIdea(idea.id, platform) 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                                  : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
                              }`}
                            >
                              {platform}
                              {getSelectionForIdea(idea.id, platform) && 
                                `: ${getSelectionForIdea(idea.id, platform)?.contentType}`
                              }
                              <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700" align="start">
                            <DropdownMenuLabel className="text-white">{platform} Content Types</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            {contentTypes.map((contentType) => (
                              <DropdownMenuItem
                                key={contentType}
                                onClick={() => handleContentSelection(idea.id, platform, contentType)}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
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
      </CardContent>
    </Card>
  );
};

export default IdeasTab;
