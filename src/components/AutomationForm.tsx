import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserIdSection from "./form-sections/UserIdSection";
import ContentDomainSection from "./form-sections/ContentDomainSection";
import ContentSourcesSection from "./form-sections/ContentSourcesSection";
import ContentPreferencesSection from "./form-sections/ContentPreferencesSection";
import PrioritySettingsSection from "./form-sections/PrioritySettingsSection";

interface AutomationFormProps {
  onBack: () => void;
}

export interface FormData {
  userId: string;
  contentDomain: string;
  contentSources: {
    websites: string[];
    socialHandles: string[];
    rssFeeds: string[];
  };
  contentPreferences: {
    contentTypes: string[];
    platforms: string[];
    tone: string;
  };
  prioritySettings: {
    engagementWeight: number;
    relevanceWeight: number;
    trendingWeight: number;
  };
}

const AutomationForm = ({ onBack }: AutomationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    userId: `user_${Date.now()}`,
    contentDomain: "",
    contentSources: {
      websites: [],
      socialHandles: [],
      rssFeeds: []
    },
    contentPreferences: {
      contentTypes: [],
      platforms: [],
      tone: ""
    },
    prioritySettings: {
      engagementWeight: 0.5,
      relevanceWeight: 0.5,
      trendingWeight: 0.5
    }
  });

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.contentDomain) {
      toast({
        title: "Validation Error",
        description: "Please select a content domain",
        variant: "destructive"
      });
      return;
    }

    if (formData.contentPreferences.contentTypes.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Please select at least one content type",
        variant: "destructive"
      });
      return;
    }

    if (formData.contentPreferences.platforms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one platform",
        variant: "destructive"
      });
      return;
    }

    if (!formData.contentPreferences.tone) {
      toast({
        title: "Validation Error",
        description: "Please select a tone",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    try {
      // Replace with your actual Make.com webhook URL
      const webhookUrl = "https://hook.us2.make.com/9ncgoj14ec9a8kvj9u5i4ep6axtypus2";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: "LeaderAmplifierAi"
        }),
      });

      toast({
        title: "Success!",
        description: "Your automation profile has been created successfully. You'll receive a confirmation email shortly.",
      });

      // Reset form or navigate to success page
      console.log("Form submitted successfully");
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit your automation profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Welcome
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Configure Your Automation
          </h1>
          <p className="text-gray-300">
            Set up your social media automation preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">User Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <UserIdSection 
                userId={formData.userId}
                onUpdate={(userId) => updateFormData('userId', userId)}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Content Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentDomainSection
                domain={formData.contentDomain}
                onUpdate={(domain) => updateFormData('contentDomain', domain)}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Content Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentSourcesSection
                sources={formData.contentSources}
                onUpdate={(sources) => updateFormData('contentSources', sources)}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Content Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentPreferencesSection
                preferences={formData.contentPreferences}
                onUpdate={(preferences) => updateFormData('contentPreferences', preferences)}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Priority Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <PrioritySettingsSection
                settings={formData.prioritySettings}
                onUpdate={(settings) => updateFormData('prioritySettings', settings)}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg"
          >
            {isSubmitting ? "Creating Your Automation..." : "Create Automation Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AutomationForm;
