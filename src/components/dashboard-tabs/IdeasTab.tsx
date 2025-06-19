
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
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

  const handleSelectIdea = (ideaId: number) => {
    setSelectedIdeas(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
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

    toast({
      title: "Content Generation Started",
      description: `Generating content for ${selectedIdeas.length} selected ideas`
    });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Content Ideas</CardTitle>
        <p className="text-gray-300">Select ideas to generate content from</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button 
            onClick={handleGenerateContent}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={selectedIdeas.length === 0}
          >
            Generate Content ({selectedIdeas.length})
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white">Select</TableHead>
              <TableHead className="text-white">Title</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideas.map((idea) => (
              <TableRow key={idea.id} className="border-white/10">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIdeas.includes(idea.id)}
                    onChange={() => handleSelectIdea(idea.id)}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded"
                  />
                </TableCell>
                <TableCell className="text-white font-medium">{idea.title}</TableCell>
                <TableCell className="text-gray-300">{idea.description}</TableCell>
                <TableCell className="text-gray-300">{idea.category}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    {idea.status}
                  </span>
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
