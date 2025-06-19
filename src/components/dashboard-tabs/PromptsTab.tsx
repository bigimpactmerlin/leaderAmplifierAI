
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const PromptsTab = () => {
  const { toast } = useToast();
  const [ideaPrompt, setIdeaPrompt] = useState("");
  const [contentPrompt, setContentPrompt] = useState("");

  const handleSave = () => {
    if (!ideaPrompt.trim() && !contentPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one prompt",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Prompts saved successfully"
    });

    console.log("Saved prompts:", { ideaPrompt, contentPrompt });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Custom Prompts</CardTitle>
        <p className="text-gray-300">Configure your AI prompts for ideas and content generation</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="ideaPrompt" className="text-white text-lg font-medium">
            Idea Generation Prompt
          </Label>
          <Textarea
            id="ideaPrompt"
            placeholder="Enter your prompt for generating content ideas. Example: Generate creative content ideas for a tech startup focused on AI solutions..."
            value={ideaPrompt}
            onChange={(e) => setIdeaPrompt(e.target.value)}
            className="mt-2 min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <div>
          <Label htmlFor="contentPrompt" className="text-white text-lg font-medium">
            Content Generation Prompt
          </Label>
          <Textarea
            id="contentPrompt"
            placeholder="Enter your prompt for generating actual content. Example: Create engaging social media content based on the selected ideas, keeping a professional yet approachable tone..."
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value)}
            className="mt-2 min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg"
        >
          Save Prompts
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromptsTab;
