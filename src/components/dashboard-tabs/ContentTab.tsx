import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useContents } from "@/hooks/useContents";
import { Loader2, Plus, RefreshCw, Trash2, Eye, ExternalLink, Edit, Save } from "lucide-react";

const ContentTab = () => {
  const { toast } = useToast();
  const { 
    contents, 
    loading, 
    createContent, 
    deleteContent, 
    publishContent, 
    generateMoreContent,
    updateContent,
    fetchContents 
  } = useContents();

  const [selectedContent, setSelectedContent] = useState<number[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingContent, setViewingContent] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state for creating new content
  const [newContent, setNewContent] = useState({
    content: "",
    platform: "",
    type: "",
    status: "draft"
  });

  // Form state for editing content
  const [editContentForm, setEditContentForm] = useState({
    content: "",
    platform: "",
    type: "",
    status: "draft"
  });

  const socialMediaPlatforms = [
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "facebook", label: "Facebook" },
    { value: "youtube", label: "YouTube" }
  ];

  const contentTypes = [
    { value: "article", label: "Article" },
    { value: "post", label: "Post" },
    { value: "tweet", label: "Tweet" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "story", label: "Story" }
  ];

  // Publishing webhook URLs
  const publishingWebhooks = {
    linkedin: "https://hook.eu2.make.com/xaikyfjrn4tbhuut7klil7e3f2slqt8w"
  };

  const handleSelectContent = (contentId: number) => {
    setSelectedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleContentClick = (content: any, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingContent(content);
    setEditContentForm({
      content: content.content || "",
      platform: content.platform || "",
      type: content.type || "",
      status: content.status || "draft"
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateContent = async () => {
    if (!editingContent || !editContentForm.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateContent(editingContent.id, {
        content: editContentForm.content.trim(),
        platform: editContentForm.platform,
        type: editContentForm.type,
        status: editContentForm.status
      });
      
      setIsEditDialogOpen(false);
      setEditingContent(null);
      setEditContentForm({
        content: "",
        platform: "",
        type: "",
        status: "draft"
      });
      
      toast({
        title: "Success",
        description: "Content updated successfully"
      });
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    try {
      await generateMoreContent();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // Function to call publishing webhook for specific platform
  const callPublishingWebhook = async (platform: string, contentId: number) => {
    const webhookUrl = publishingWebhooks[platform as keyof typeof publishingWebhooks];
    
    if (!webhookUrl) {
      console.warn(`No publishing webhook URL configured for platform: ${platform}`);
      return false;
    }

    try {
      console.log(`Calling ${platform} publishing webhook for content ID: ${contentId}`);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Add this to handle CORS issues
        body: JSON.stringify({
          id: contentId // Send the content ID as 'id' field
        }),
      });

      // Note: With no-cors mode, we can't check response status
      // but the request will be sent successfully
      console.log(`${platform} publishing webhook called successfully for content ID ${contentId}`);
      return true;
    } catch (error) {
      console.error(`Error calling ${platform} publishing webhook for content ID ${contentId}:`, error);
      throw error;
    }
  };

  const handlePublishSelected = async () => {
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

    setIsPublishing(true);

    try {
      // Group content by platform for webhook processing
      const webhookPlatforms = Object.keys(publishingWebhooks);
      const webhookResults = [];
      const standardPlatforms = [];

      // Process each selected platform
      for (const platform of selectedPlatforms) {
        if (webhookPlatforms.includes(platform)) {
          console.log(`Processing webhook platform: ${platform} with ${selectedContent.length} content items`);
          
          // Call webhook for each content item for this platform
          const platformPromises = selectedContent.map(async (contentId) => {
            try {
              await callPublishingWebhook(platform, contentId);
              return { success: true, contentId };
            } catch (error) {
              console.error(`Failed webhook call for ${platform}, content ${contentId}:`, error);
              return { success: false, contentId, error };
            }
          });

          const results = await Promise.all(platformPromises);
          const successCount = results.filter(r => r.success).length;
          const failureCount = results.filter(r => !r.success).length;

          webhookResults.push({
            platform,
            totalCount: selectedContent.length,
            successCount,
            failureCount,
            success: successCount > 0,
            contentIds: selectedContent
          });
        } else {
          standardPlatforms.push(platform);
        }
      }

      // Handle webhook platforms
      for (const result of webhookResults) {
        if (result.successCount > 0) {
          toast({
            title: `${result.platform.charAt(0).toUpperCase() + result.platform.slice(1)} Publishing Success`,
            description: `Successfully initiated publishing for ${result.successCount} content item(s). IDs: ${result.contentIds.join(', ')}`
          });
        }
        
        if (result.failureCount > 0) {
          toast({
            title: `${result.platform.charAt(0).toUpperCase() + result.platform.slice(1)} Publishing Errors`,
            description: `Failed to publish ${result.failureCount} content item(s). Check console for details.`,
            variant: "destructive"
          });
        }
      }

      // Handle standard platforms (existing logic)
      if (standardPlatforms.length > 0) {
        await publishContent(selectedContent, standardPlatforms);
      }

      // Summary toast
      const totalWebhookCalls = webhookResults.reduce((sum, r) => sum + r.successCount, 0);
      const totalFailures = webhookResults.reduce((sum, r) => sum + r.failureCount, 0);
      
      if (webhookResults.length > 0) {
        toast({
          title: "Publishing Summary",
          description: `Processed ${selectedContent.length} content items. Webhook calls: ${totalWebhookCalls} successful, ${totalFailures} failed. Content IDs: ${selectedContent.join(', ')}`
        });
      }

      setSelectedContent([]);
      setSelectedPlatforms([]);
    } catch (error) {
      console.error("Error in publishing process:", error);
      toast({
        title: "Error",
        description: "Failed to publish some content items",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCreateContent = async () => {
    if (!newContent.content.trim() || !newContent.platform || !newContent.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      await createContent({
        content: newContent.content,
        platform: newContent.platform,
        type: newContent.type,
        status: newContent.status,
        user_id: 1 // Using demo user ID
      });

      setNewContent({
        content: "",
        platform: "",
        type: "",
        status: "draft"
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    try {
      await deleteContent(contentId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleViewContent = (content: any) => {
    setViewingContent(content);
    setIsViewDialogOpen(true);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "published": return "bg-green-500/20 text-green-300";
      case "ready": return "bg-blue-500/20 text-blue-300";
      case "draft": return "bg-yellow-500/20 text-yellow-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const capitalizeFirst = (str: string | null) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const isPlatformWebhookEnabled = (platform: string) => {
    return Object.keys(publishingWebhooks).includes(platform);
  };

  const getWebhookIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return '🔗';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading content...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Generated Content</CardTitle>
        <p className="text-gray-300">Manage and publish your content. Click on content to edit.</p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateMore}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate More Content"
              )}
            </Button>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Content</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content" className="text-white">Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter your content..."
                      value={newContent.content}
                      onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="platform" className="text-white">Platform *</Label>
                      <Select value={newContent.platform} onValueChange={(value) => setNewContent(prev => ({ ...prev, platform: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {socialMediaPlatforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value} className="text-white hover:bg-gray-700">
                              {platform.label}
                              {isPlatformWebhookEnabled(platform.value) && ` ${getWebhookIcon(platform.value)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="type" className="text-white">Content Type *</Label>
                      <Select value={newContent.type} onValueChange={(value) => setNewContent(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateContent}
                    disabled={isCreating}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Content"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={fetchContents}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
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
                      className={`px-3 py-1 rounded-full text-sm transition-all flex items-center space-x-1 ${
                        selectedPlatforms.includes(platform.value)
                          ? isPlatformWebhookEnabled(platform.value)
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white ring-2 ring-blue-400"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      <span>{platform.label}</span>
                      {isPlatformWebhookEnabled(platform.value) && selectedPlatforms.includes(platform.value) && (
                        <span>{getWebhookIcon(platform.value)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handlePublishSelected}
                disabled={selectedPlatforms.length === 0 || isPublishing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish to Selected Platforms"
                )}
              </Button>

              {/* Webhook Integration Info */}
              {selectedPlatforms.some(platform => isPlatformWebhookEnabled(platform)) && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-blue-400 text-lg">🚀</span>
                    <span className="text-blue-300 font-medium">Webhook Publishing Active</span>
                  </div>
                  <div className="text-sm text-blue-200 space-y-1">
                    {selectedPlatforms
                      .filter(platform => isPlatformWebhookEnabled(platform))
                      .map(platform => (
                        <div key={platform} className="flex items-center space-x-2">
                          <span>{getWebhookIcon(platform)}</span>
                          <span>{capitalizeFirst(platform)} content will be published via webhook for content IDs: {selectedContent.join(', ')}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {contents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-300 mb-4">No content found. Generate or create your first content piece!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Select</TableHead>
                <TableHead className="text-white">ID</TableHead>
                <TableHead className="text-white">Content</TableHead>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Platform</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.map((item) => (
                <TableRow key={item.id} className="border-white/10">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(item.id)}
                      onChange={() => handleSelectContent(item.id)}
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded"
                    />
                  </TableCell>
                  <TableCell className="text-white font-mono text-sm">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-white font-medium max-w-xs">
                    <div 
                      className="truncate cursor-pointer hover:bg-white/10 p-2 rounded transition-colors flex items-center space-x-2" 
                      title={item.content || ''}
                      onClick={(e) => handleContentClick(item, e)}
                    >
                      <span>{item.content || 'No content'}</span>
                      <Edit className="h-3 w-3 opacity-50" />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{capitalizeFirst(item.type)}</TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center space-x-1">
                      <span>{capitalizeFirst(item.platform)}</span>
                      {isPlatformWebhookEnabled(item.platform || '') && (
                        <span className="text-blue-400">{getWebhookIcon(item.platform || '')}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                      {capitalizeFirst(item.status) || 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">{formatDate(item.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewContent(item)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {item.content_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.content_url!, '_blank')}
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContent(item.id)}
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

        {/* Edit Content Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-content" className="text-white">Content *</Label>
                <Textarea
                  id="edit-content"
                  placeholder="Enter your content..."
                  value={editContentForm.content}
                  onChange={(e) => setEditContentForm(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[200px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-platform" className="text-white">Platform</Label>
                  <Select value={editContentForm.platform} onValueChange={(value) => setEditContentForm(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {socialMediaPlatforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value} className="text-white hover:bg-gray-700">
                          {platform.label}
                          {isPlatformWebhookEnabled(platform.value) && ` ${getWebhookIcon(platform.value)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-type" className="text-white">Content Type</Label>
                  <Select value={editContentForm.type} onValueChange={(value) => setEditContentForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleUpdateContent}
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

        {/* View Content Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">View Content</DialogTitle>
            </DialogHeader>
            {viewingContent && (
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Content ID</Label>
                  <p className="text-gray-300 font-mono">{viewingContent.id}</p>
                </div>
                <div>
                  <Label className="text-white">Platform</Label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-300">{capitalizeFirst(viewingContent.platform)}</p>
                    {isPlatformWebhookEnabled(viewingContent.platform || '') && (
                      <span className="text-blue-400 text-lg">{getWebhookIcon(viewingContent.platform || '')}</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-white">Type</Label>
                  <p className="text-gray-300">{capitalizeFirst(viewingContent.type)}</p>
                </div>
                <div>
                  <Label className="text-white">Status</Label>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(viewingContent.status)}`}>
                    {capitalizeFirst(viewingContent.status) || 'Draft'}
                  </span>
                </div>
                <div>
                  <Label className="text-white">Content</Label>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3 text-gray-300 max-h-60 overflow-y-auto">
                    {viewingContent.content || 'No content'}
                  </div>
                </div>
                {viewingContent.content_url && (
                  <div>
                    <Label className="text-white">URL</Label>
                    <a 
                      href={viewingContent.content_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline block"
                    >
                      {viewingContent.content_url}
                    </a>
                  </div>
                )}
                <div>
                  <Label className="text-white">Created</Label>
                  <p className="text-gray-300">{formatDate(viewingContent.created_at)}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContentTab;