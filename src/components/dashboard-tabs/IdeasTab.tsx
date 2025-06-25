import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Plus, Loader2, Trash2 } from "lucide-react";
import { useIdeas, useCreateIdea, useUpdateIdea, useDeleteIdea } from "@/hooks/useIdeas";
import { useAuth } from "@/hooks/useAuth";
import { type Idea } from "@/lib/supabase";

interface ContentSelection {
  ideaId: number;
  platform: string;
  contentType: string;
}

const IdeasTab = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { data: ideas = [], isLoading, error } = useIdeas();
  const createIdeaMutation = useCreateIdea();
  const updateIdeaMutation = useUpdateIdea();
  const deleteIdeaMutation = useDeleteIdea();
  
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([]);
  const [contentSelections, setContentSelections] = useState<ContentSelection[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newIdeaContent, setNewIdeaContent] = useState("");

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
    if (contentType === "None") {
      setContentSelections(prev => 
        prev.filter(sel => !(sel.ideaId === ideaId && sel.platform === platform))
      );
      
      toast({
        title: "Content Selection Removed",
        description: `Removed ${platform} content for idea`
      });
      return;
    }

    const newSelection: ContentSelection = { ideaId, platform, contentType };
    
    setContentSelections(prev => {
      const filtered = prev.filter(sel => !(sel.ideaId === ideaId && sel.platform === platform));
      return [...filtered, newSelection];
    });

    toast({
      title: "Content Type Selected",
      description: `${platform} ${contentType} selected for idea`
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

    // Mark selected ideas as used
    selectedIdeas.forEach(ideaId => {
      updateIdeaMutation.mutate({
        id: ideaId,
        updates: { 
          status: 'used',
          used_at: new Date().toISOString()
        }
      });
    });

    toast({
      title: "Content Generation Started",
      description: `Generating ${contentSelections.length} content pieces for ${selectedIdeas.length} selected ideas`
    });
  };

  const handleCreateIdea = () => {
    if (!newIdeaContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter idea content",
        variant: "destructive"
      });
      return;
    }

    createIdeaMutation.mutate({
      user_id: null, // Will be set automatically in the hook
      content: newIdeaContent,
      status: 'new',
      priority_score: 0.5,
      used_at: null
    });

    setNewIdeaContent("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteIdea = (ideaId: number) => {
    deleteIdeaMutation.mutate(ideaId);
  };

  const getSelectionForIdea = (ideaId: number, platform: string) => {
    return contentSelections.find(sel => sel.ideaId === ideaId && sel.platform === platform);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "used": return "bg-green-500/20 text-green-300";
      case "new": return "bg-blue-500/20 text-blue-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Content Ideas</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-300">Please sign in to view your ideas.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Content Ideas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="ml-2 text-white">Loading ideas...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Content Ideas</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-red-300">Error loading ideas: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Content Ideas</CardTitle>
        <p className="text-gray-300">Click on ideas to select them, then choose content types for each platform</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Button 
            onClick={handleGenerateContent}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            disabled={selectedIdeas.length === 0 || contentSelections.length === 0}
          >
            Generate Content ({contentSelections.length} pieces)
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Idea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content" className="text-white">Idea Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your content idea..."
                    value={newIdeaContent}
                    onChange={(e) => setNewIdeaContent(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <Button 
                  onClick={handleCreateIdea}
                  disabled={createIdeaMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {createIdeaMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Idea"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {ideas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-300 mb-4">No ideas found. Create your first idea to get started!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Content</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Priority</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white">Content Types</TableHead>
                <TableHead className="text-white">Actions</TableHead>
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
                  <TableCell className="text-white font-medium max-w-xs">
                    <div className="truncate" title={idea.content || ''}>
                      {idea.content || 'No content'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(idea.status)}`}>
                      {idea.status || 'unknown'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {idea.priority_score ? (idea.priority_score * 100).toFixed(0) + '%' : 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(idea.created_at).toLocaleDateString()}
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
                              <DropdownMenuItem
                                onClick={() => handleContentSelection(idea.id, platform, "None")}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                              >
                                None
                              </DropdownMenuItem>
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
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      disabled={deleteIdeaMutation.isPending}
                    >
                      {deleteIdeaMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default IdeasTab;