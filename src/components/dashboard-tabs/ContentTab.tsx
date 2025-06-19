
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Content {
  id: number;
  title: string;
  type: string;
  platform: string;
  status: string;
  createdDate: string;
}

const ContentTab = () => {
  const { toast } = useToast();
  const [content] = useState<Content[]>([
    { id: 1, title: "AI Healthcare Benefits", type: "Article", platform: "LinkedIn", status: "Draft", createdDate: "2024-01-15" },
    { id: 2, title: "Remote Work Stats Infographic", type: "Image", platform: "Instagram", status: "Ready", createdDate: "2024-01-14" },
    { id: 3, title: "Sustainable Fashion Video", type: "Video", platform: "TikTok", status: "Published", createdDate: "2024-01-13" },
    { id: 4, title: "Marketing Best Practices", type: "Text", platform: "Twitter", status: "Draft", createdDate: "2024-01-12" },
    { id: 5, title: "Fitness Tech Review", type: "Article", platform: "LinkedIn", status: "Ready", createdDate: "2024-01-11" }
  ]);

  const [selectedContent, setSelectedContent] = useState<number[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const socialMediaPlatforms = [
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "facebook", label: "Facebook" },
    { value: "youtube", label: "YouTube" }
  ];

  const handleSelectContent = (contentId: number) => {
    setSelectedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleGenerateMore = () => {
    toast({
      title: "Generating More Content",
      description: "Creating additional content variations..."
    });
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handlePublishSelected = () => {
    if (selectedContent.length === 0) {
      toast({
        title: "No Content Selected",
        description: "Please select content to publish",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select platforms to publish to",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Publishing Content",
      description: `Publishing ${selectedContent.length} content items to ${selectedPlatforms.join(", ")}...`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-500/20 text-green-300";
      case "Ready": return "bg-blue-500/20 text-blue-300";
      case "Draft": return "bg-yellow-500/20 text-yellow-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Generated Content</CardTitle>
        <p className="text-gray-300">Manage and generate your content</p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateMore}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Generate More Content
            </Button>
          </div>
          
          {/* Platform Selection for Publishing */}
          {selectedContent.length > 0 && (
            <div className="p-4 bg-white/5 border border-white/20 rounded-lg space-y-3">
              <h3 className="text-white font-medium">Publish Selected Content ({selectedContent.length})</h3>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Select platforms to publish to:</label>
                <div className="flex flex-wrap gap-2">
                  {socialMediaPlatforms.map((platform) => (
                    <button
                      key={platform.value}
                      onClick={() => handlePlatformToggle(platform.value)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedPlatforms.includes(platform.value)
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {platform.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handlePublishSelected}
                disabled={selectedPlatforms.length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
              >
                Publish to Selected Platforms
              </Button>
            </div>
          )}
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white">Select</TableHead>
              <TableHead className="text-white">Title</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Platform</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.map((item) => (
              <TableRow key={item.id} className="border-white/10">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedContent.includes(item.id)}
                    onChange={() => handleSelectContent(item.id)}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded"
                  />
                </TableCell>
                <TableCell className="text-white font-medium">{item.title}</TableCell>
                <TableCell className="text-gray-300">{item.type}</TableCell>
                <TableCell className="text-gray-300">{item.platform}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-300">{item.createdDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContentTab;
