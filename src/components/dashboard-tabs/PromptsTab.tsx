
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
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
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <MessageSquare className="mr-2 h-5 w-5" />
          Custom Prompts
        </CardTitle>
        <p className="text-gray-600">Configure your AI prompts for ideas and content generation</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="ideaPrompt" className="text-gray-900 text-lg font-medium">
            Idea Generation Prompt
          </Label>
          <Textarea
            id="ideaPrompt"
            placeholder="Enter your prompt for generating content ideas. Example: Generate creative content ideas for a tech startup focused on AI solutions..."
            value={ideaPrompt}
            onChange={(e) => setIdeaPrompt(e.target.value)}
            className="mt-2 min-h-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label htmlFor="contentPrompt" className="text-gray-900 text-lg font-medium">
            Content Generation Prompt
          </Label>
          <Textarea
            id="contentPrompt"
            placeholder="Enter your prompt for generating actual content. Example: Create engaging social media content based on the selected ideas, keeping a professional yet approachable tone..."
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value)}
            className="mt-2 min-h-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
        >
          Save Prompts
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromptsTab;
