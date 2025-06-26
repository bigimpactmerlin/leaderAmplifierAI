import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers } from "@/hooks/useUsers";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Save, X, Loader2 } from "lucide-react";

const UserProfile = () => {
  const { currentUser, updateUser, logout } = useUsers();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state for editing user
  const [userForm, setUserForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    domain: currentUser?.domain || "",
    linkedin_url: currentUser?.linkedin_url || "",
    facebook_url: currentUser?.facebook_url || "",
    instagram_url: currentUser?.instagram_url || "",
    twitter_url: currentUser?.twitter_url || ""
  });

  const domains = [
    { value: "technology", label: "Technology" },
    { value: "marketing", label: "Marketing" },
    { value: "fashion", label: "Fashion" },
    { value: "fitness", label: "Fitness" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" }
  ];

  const handleUpdateUser = async () => {
    if (!currentUser) return;

    if (!userForm.name.trim() || !userForm.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateUser(currentUser.id, {
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        domain: userForm.domain || null,
        linkedin_url: userForm.linkedin_url.trim() || null,
        facebook_url: userForm.facebook_url.trim() || null,
        instagram_url: userForm.instagram_url.trim() || null,
        twitter_url: userForm.twitter_url.trim() || null
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = () => {
    if (currentUser) {
      setUserForm({
        name: currentUser.name || "",
        email: currentUser.email || "",
        domain: currentUser.domain || "",
        linkedin_url: currentUser.linkedin_url || "",
        facebook_url: currentUser.facebook_url || "",
        instagram_url: currentUser.instagram_url || "",
        twitter_url: currentUser.twitter_url || ""
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    // Since we removed the login page, just reload the page
    window.location.reload();
  };

  // Helper function to extract domain from URL
  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (!currentUser) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <User className="mr-2 h-5 w-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">No user logged in</p>
            <p className="text-gray-400 text-sm">Demo mode - using sample data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            User Profile
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
            >
              <X className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white text-sm font-medium">Name</Label>
              <p className="text-gray-300 mt-1">{currentUser.name || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-white text-sm font-medium">Email</Label>
              <p className="text-gray-300 mt-1">{currentUser.email || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-white text-sm font-medium">Domain</Label>
              <p className="text-gray-300 mt-1">{currentUser.domain || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-white text-sm font-medium">Member Since</Label>
              <p className="text-gray-300 mt-1">
                {new Date(currentUser.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <Label className="text-white text-lg font-medium mb-3 block">Social Media Profiles</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'linkedin_url', label: 'LinkedIn', icon: '💼' },
                { key: 'twitter_url', label: 'Twitter', icon: '🐦' },
                { key: 'facebook_url', label: 'Facebook', icon: '📘' },
                { key: 'instagram_url', label: 'Instagram', icon: '📷' }
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center space-x-3">
                  <span className="text-lg">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <Label className="text-white text-sm">{label}</Label>
                    {currentUser[key as keyof typeof currentUser] ? (
                      <a 
                        href={currentUser[key as keyof typeof currentUser] as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs block truncate max-w-[120px]"
                        title={currentUser[key as keyof typeof currentUser] as string}
                      >
                        {extractDomain(currentUser[key as keyof typeof currentUser] as string)}
                      </a>
                    ) : (
                      <p className="text-gray-400 text-sm">Not set</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="domain" className="text-white">Domain</Label>
                <Select value={userForm.domain} onValueChange={(value) => setUserForm(prev => ({ ...prev, domain: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your domain" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {domains.map((domain) => (
                      <SelectItem key={domain.value} value={domain.value} className="text-white hover:bg-gray-700">
                        {domain.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Social Media URLs */}
              <div className="space-y-3">
                <Label className="text-white text-lg font-medium">Social Media Profiles</Label>
                
                <div>
                  <Label htmlFor="linkedin" className="text-white">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={userForm.linkedin_url}
                    onChange={(e) => setUserForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter" className="text-white">Twitter URL</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/yourusername"
                    value={userForm.twitter_url}
                    onChange={(e) => setUserForm(prev => ({ ...prev, twitter_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="facebook" className="text-white">Facebook URL</Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/yourprofile"
                    value={userForm.facebook_url}
                    onChange={(e) => setUserForm(prev => ({ ...prev, facebook_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram" className="text-white">Instagram URL</Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/yourusername"
                    value={userForm.instagram_url}
                    onChange={(e) => setUserForm(prev => ({ ...prev, instagram_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <Button 
                onClick={handleUpdateUser}
                disabled={isUpdating}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserProfile;