
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import IdeasTab from "./dashboard-tabs/IdeasTab";
import ContentTab from "./dashboard-tabs/ContentTab";
import SourcesTab from "./dashboard-tabs/SourcesTab";
import TrackingTab from "./dashboard-tabs/TrackingTab";
import PromptsTab from "./dashboard-tabs/PromptsTab";

interface DashboardProps {
  onBack: () => void;
}

const Dashboard = ({ onBack }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-300">
            Manage your content automation
          </p>
        </div>

        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="ideas" className="text-white data-[state=active]:bg-white/20">Ideas</TabsTrigger>
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-white/20">Content</TabsTrigger>
            <TabsTrigger value="sources" className="text-white data-[state=active]:bg-white/20">Sources</TabsTrigger>
            <TabsTrigger value="tracking" className="text-white data-[state=active]:bg-white/20">Tracking</TabsTrigger>
            <TabsTrigger value="prompts" className="text-white data-[state=active]:bg-white/20">Prompts</TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <IdeasTab />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab />
          </TabsContent>

          <TabsContent value="sources">
            <SourcesTab />
          </TabsContent>

          <TabsContent value="tracking">
            <TrackingTab />
          </TabsContent>

          <TabsContent value="prompts">
            <PromptsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
