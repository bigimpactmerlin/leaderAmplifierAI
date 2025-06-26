import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { Loader2, User, Mail, Globe, Linkedin, Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const { toast } = useToast();
  const { loginUserByEmail, createUser } = useUsers();
  
  // Sign In State
  const [signInData, setSignInData] = useState({
    email: "",
    name: ""
  });
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    domain: "",
    linkedin_url: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: ""
  });
  const [isSigningUp, setIsSigningUp] = useState(false);

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string) => {
    if (!url.trim()) return true; // Optional field
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSignIn = async () => {
    // Validation
    if (!signInData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(signInData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (!signInData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    setIsSigningIn(true);
    try {
      await loginUserByEmail(signInData.email.trim());
      onLoginSuccess();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async () => {
    // Validation
    if (!signUpData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    if (!signUpData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(signUpData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (!signUpData.domain) {
      toast({
        title: "Validation Error",
        description: "Please select a domain",
        variant: "destructive"
      });
      return;
    }

    // Check if at least one social media URL is provided
    const socialUrls = [
      signUpData.linkedin_url,
      signUpData.facebook_url,
      signUpData.instagram_url,
      signUpData.twitter_url
    ].filter(url => url.trim());

    if (socialUrls.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide at least one social media profile URL",
        variant: "destructive"
      });
      return;
    }

    // Validate URLs
    const urlFields = [
      { field: 'linkedin_url', name: 'LinkedIn' },
      { field: 'facebook_url', name: 'Facebook' },
      { field: 'instagram_url', name: 'Instagram' },
      { field: 'twitter_url', name: 'Twitter' }
    ];

    for (const { field, name } of urlFields) {
      const url = signUpData[field as keyof typeof signUpData] as string;
      if (url && !validateUrl(url)) {
        toast({
          title: "Validation Error",
          description: `Please enter a valid ${name} URL`,
          variant: "destructive"
        });
        return;
      }
    }

    setIsSigningUp(true);
    try {
      // Normalize URLs
      const normalizeUrl = (url: string) => {
        if (!url.trim()) return null;
        return url.startsWith('http') ? url : `https://${url}`;
      };

      await createUser({
        name: signUpData.name.trim(),
        email: signUpData.email.trim(),
        domain: signUpData.domain,
        linkedin_url: normalizeUrl(signUpData.linkedin_url),
        facebook_url: normalizeUrl(signUpData.facebook_url),
        instagram_url: normalizeUrl(signUpData.instagram_url),
        twitter_url: normalizeUrl(signUpData.twitter_url)
      });

      toast({
        title: "Success!",
        description: "Account created successfully. You are now logged in.",
      });

      onLoginSuccess();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            LeaderAmplifierAi
          </h1>
          <p className="text-gray-300">
            Sign in to your account or create a new one
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <div>
                  <Label htmlFor="signin-email" className="text-white flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address *
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="signin-name" className="text-white flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="signin-name"
                    placeholder="Your full name"
                    value={signInData.name}
                    onChange={(e) => setSignInData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <Button 
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-white flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Full Name *
                    </Label>
                    <Input
                      id="signup-name"
                      placeholder="Your full name"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-white flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address *
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-domain" className="text-white flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Domain *
                    </Label>
                    <Select value={signUpData.domain} onValueChange={(value) => setSignUpData(prev => ({ ...prev, domain: value }))}>
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
                </div>

                <div className="space-y-3">
                  <Label className="text-white text-lg font-medium">
                    Social Media Profiles *
                  </Label>
                  <p className="text-sm text-gray-400">
                    Please provide at least one social media profile URL
                  </p>
                  
                  <div>
                    <Label htmlFor="signup-linkedin" className="text-white flex items-center">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn URL
                    </Label>
                    <Input
                      id="signup-linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={signUpData.linkedin_url}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-twitter" className="text-white flex items-center">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter URL
                    </Label>
                    <Input
                      id="signup-twitter"
                      placeholder="https://twitter.com/yourusername"
                      value={signUpData.twitter_url}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, twitter_url: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-facebook" className="text-white flex items-center">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook URL
                    </Label>
                    <Input
                      id="signup-facebook"
                      placeholder="https://facebook.com/yourprofile"
                      value={signUpData.facebook_url}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, facebook_url: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-instagram" className="text-white flex items-center">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram URL
                    </Label>
                    <Input
                      id="signup-instagram"
                      placeholder="https://instagram.com/yourusername"
                      value={signUpData.instagram_url}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, instagram_url: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSignUp}
                  disabled={isSigningUp}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3"
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;