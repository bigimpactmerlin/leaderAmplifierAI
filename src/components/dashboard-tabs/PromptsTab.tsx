import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, RefreshCw, Loader2, Trash2, Edit, Save, Power, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePrompts } from "@/hooks/usePrompts";

const PromptsTab = () => {
  const { toast } = useToast();
  const { 
    prompts, 
    loading, 
    createPrompt, 
    updatePrompt, 
    deletePrompt, 
    setActivePrompt,
    fetchPrompts 
  } = usePrompts();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<any>(null);
  const [viewingPrompt, setViewingPrompt] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state for creating/editing prompts
  const [promptForm, setPromptForm] = useState({
    name: "",
    prompt: "",
    status: "inactive"
  });

  const handleCreatePrompt = async () => {
    if (!promptForm.name.trim() || !promptForm.prompt.trim()) {
      toast({
        title: "Error",
        description: "Name and prompt are required",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await createPrompt({
        name: promptForm.name.trim(),
        prompt: promptForm.prompt.trim(),
        status: promptForm.status
      });
      
      setPromptForm({
        name: "",
        prompt: "",
        status: "inactive"
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPrompt = (prompt: any) => {
    setEditingPrompt(prompt);
    setPromptForm({
      name: prompt.name || "",
      prompt: prompt.prompt || "",
      status: prompt.status || "inactive"
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePrompt = async () => {
    if (!editingPrompt) return;

    if (!promptForm.name.trim() || !promptForm.prompt.trim()) {
      toast({
        title: "Error",
        description: "Name and prompt are required",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updatePrompt(editingPrompt.id, {
        name: promptForm.name.trim(),
        prompt: promptForm.prompt.trim(),
        status: promptForm.status
      });
      
      setPromptForm({
        name: "",
        prompt: "",
        status: "inactive"
      });
      setEditingPrompt(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePrompt = async (id: number) => {
    try {
      await deletePrompt(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleToggleActive = async (id: number, currentStatus: string | null) => {
    try {
      if (currentStatus === 'active') {
        // Deactivate the prompt
        await updatePrompt(id, { status: 'inactive' });
      } else {
        // Set this prompt as active (will deactivate others)
        await setActivePrompt(id);
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleViewPrompt = (prompt: any) => {
    setViewingPrompt(prompt);
    setIsViewDialogOpen(true);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active": return "bg-green-600 text-white";
      case "inactive": return "bg-gray-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <MessageSquare className="mr-2 h-5 w-5" />
            Idea Generation Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading prompts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <MessageSquare className="mr-2 h-5 w-5" />
          Idea Generation Prompts
        </CardTitle>
        <p className="text-gray-300">Configure your AI prompts for idea generation</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Prompt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter prompt name..."
                    value={promptForm.name}
                    onChange={(e) => setPromptForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="prompt" className="text-white">Prompt *</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter your prompt for generating content ideas. Example: Generate creative content ideas for a tech startup focused on AI solutions..."
                    value={promptForm.prompt}
                    onChange={(e) => setPromptForm(prev => ({ ...prev, prompt: e.target.value }))}
                    className="mt-2 min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-white">Status</Label>
                  <Select value={promptForm.status} onValueChange={(value) => setPromptForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
                      <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleCreatePrompt}
                  disabled={isCreating}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Prompt"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={fetchPrompts}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Prompts Table */}
        {prompts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">No prompts found. Create your first prompt to get started!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Prompt Preview</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id} className="border-white/10">
                  <TableCell className="text-white font-medium">
                    {prompt.name || 'Unnamed Prompt'}
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-xs">
                    <div className="truncate" title={prompt.prompt || ''}>
                      {truncateText(prompt.prompt || 'No prompt content', 80)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(prompt.status)}>
                      {prompt.status || 'inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(prompt.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPrompt(prompt)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPrompt(prompt)}
                        className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(prompt.id, prompt.status)}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                        title={prompt.status === 'active' ? 'Deactivate' : 'Set as Active'}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePrompt(prompt.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* View Prompt Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">View Prompt</DialogTitle>
            </DialogHeader>
            {viewingPrompt && (
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Name</Label>
                  <p className="text-gray-300">{viewingPrompt.name || 'Unnamed Prompt'}</p>
                </div>
                <div>
                  <Label className="text-white">Status</Label>
                  <Badge className={getStatusColor(viewingPrompt.status)}>
                    {viewingPrompt.status || 'inactive'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-white">Prompt</Label>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3 text-gray-300 max-h-60 overflow-y-auto">
                    {viewingPrompt.prompt || 'No prompt content'}
                  </div>
                </div>
                <div>
                  <Label className="text-white">Created</Label>
                  <p className="text-gray-300">{formatDate(viewingPrompt.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEditPrompt(viewingPrompt);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Prompt
                  </Button>
                  <Button
                    onClick={() => handleToggleActive(viewingPrompt.id, viewingPrompt.status)}
                    className={viewingPrompt.status === 'active' ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {viewingPrompt.status === 'active' ? 'Deactivate' : 'Set as Active'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Prompt Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Prompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-white">Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter prompt name..."
                  value={promptForm.name}
                  onChange={(e) => setPromptForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-prompt" className="text-white">Prompt *</Label>
                <Textarea
                  id="edit-prompt"
                  placeholder="Enter your prompt for generating content ideas..."
                  value={promptForm.prompt}
                  onChange={(e) => setPromptForm(prev => ({ ...prev, prompt: e.target.value }))}
                  className="mt-2 min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="edit-status" className="text-white">Status</Label>
                <Select value={promptForm.status} onValueChange={(value) => setPromptForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
                    <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleUpdatePrompt}
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setIsEditDialogOpen(false)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Active Prompt Info */}
        {prompts.some(p => p.status === 'active') && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-400 text-lg">✓</span>
              <span className="text-green-300 font-medium">Active Prompt</span>
            </div>
            <div className="text-sm text-green-200">
              <strong>{prompts.find(p => p.status === 'active')?.name}</strong> is currently being used for idea generation.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptsTab;