import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, RefreshCw, Loader2, Trash2, Edit, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useToast } from "@/hooks/use-toast";

const UsersTab = () => {
  const { toast } = useToast();
  const { 
    users, 
    currentUser,
    loading, 
    createUser, 
    deleteUser,
    fetchUsers 
  } = useUsers();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for creating new user
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    domain: "",
    linkedin_url: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: ""
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

  const handleCreateUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await createUser({
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        domain: userForm.domain || null,
        linkedin_url: userForm.linkedin_url.trim() || null,
        facebook_url: userForm.facebook_url.trim() || null,
        instagram_url: userForm.instagram_url.trim() || null,
        twitter_url: userForm.twitter_url.trim() || null
      });
      
      setUserForm({
        name: "",
        email: "",
        domain: "",
        linkedin_url: "",
        facebook_url: "",
        instagram_url: "",
        twitter_url: ""
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (currentUser && currentUser.id === id) {
      toast({
        title: "Error",
        description: "Cannot delete the currently logged in user",
        variant: "destructive"
      });
      return;
    }

    try {
      await deleteUser(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDomainColor = (domain: string | null) => {
    const colors = {
      'technology': 'bg-blue-600 text-white',
      'marketing': 'bg-green-600 text-white',
      'fashion': 'bg-pink-600 text-white',
      'fitness': 'bg-orange-600 text-white',
      'finance': 'bg-yellow-600 text-white',
      'healthcare': 'bg-red-600 text-white',
      'education': 'bg-purple-600 text-white',
      'other': 'bg-gray-600 text-white'
    };
    return colors[domain as keyof typeof colors] || 'bg-gray-600 text-white';
  };

  const capitalizeFirst = (str: string | null) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Users className="mr-2 h-5 w-5" />
            Users Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading users...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Users className="mr-2 h-5 w-5" />
          Users Management
        </CardTitle>
        <p className="text-gray-300">Manage user accounts and profiles</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Full name"
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
                        placeholder="email@example.com"
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
                        <SelectValue placeholder="Select domain" />
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
                    <Label className="text-white text-lg font-medium">Social Media Profiles (Optional)</Label>
                    
                    <div>
                      <Label htmlFor="linkedin" className="text-white">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/profile"
                        value={userForm.linkedin_url}
                        onChange={(e) => setUserForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="twitter" className="text-white">Twitter URL</Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/username"
                        value={userForm.twitter_url}
                        onChange={(e) => setUserForm(prev => ({ ...prev, twitter_url: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="facebook" className="text-white">Facebook URL</Label>
                      <Input
                        id="facebook"
                        placeholder="https://facebook.com/profile"
                        value={userForm.facebook_url}
                        onChange={(e) => setUserForm(prev => ({ ...prev, facebook_url: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="instagram" className="text-white">Instagram URL</Label>
                      <Input
                        id="instagram"
                        placeholder="https://instagram.com/username"
                        value={userForm.instagram_url}
                        onChange={(e) => setUserForm(prev => ({ ...prev, instagram_url: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateUser}
                    disabled={isCreating}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={fetchUsers}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Users Table */}
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">No users found. Create your first user to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Domain</TableHead>
                  <TableHead className="text-white">Social Links</TableHead>
                  <TableHead className="text-white">Created</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className={`border-white/10 ${
                      currentUser && currentUser.id === user.id ? 'bg-blue-500/20 border-blue-400/30' : ''
                    }`}
                  >
                    <TableCell className="text-white font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{user.name || 'No name'}</span>
                        {currentUser && currentUser.id === user.id && (
                          <Badge className="bg-blue-600 text-white text-xs">Current</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{user.email || 'No email'}</TableCell>
                    <TableCell>
                      {user.domain ? (
                        <Badge className={getDomainColor(user.domain)}>
                          {capitalizeFirst(user.domain)}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.linkedin_url && (
                          <a 
                            href={user.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                            title="LinkedIn"
                          >
                            💼
                          </a>
                        )}
                        {user.twitter_url && (
                          <a 
                            href={user.twitter_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                            title="Twitter"
                          >
                            🐦
                          </a>
                        )}
                        {user.facebook_url && (
                          <a 
                            href={user.facebook_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                            title="Facebook"
                          >
                            📘
                          </a>
                        )}
                        {user.instagram_url && (
                          <a 
                            href={user.instagram_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                            title="Instagram"
                          >
                            📷
                          </a>
                        )}
                        {!user.linkedin_url && !user.twitter_url && !user.facebook_url && !user.instagram_url && (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={currentUser && currentUser.id === user.id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 disabled:opacity-50"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;