
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        <div className="mb-4 flex gap-2">
          <Button 
            onClick={handleGenerateMore}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Generate More Content
          </Button>
          <Button 
            variant="outline"
            disabled={selectedContent.length === 0}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Publish Selected ({selectedContent.length})
          </Button>
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
