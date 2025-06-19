
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Lightbulb, FileText, Globe, BarChart3, MessageSquare, User, Settings, LogOut } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">LeaderAmplifierAi</h1>
          <p className="text-sm text-gray-500 mt-1">Content Automation</p>
        </div>
        
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </div>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="flex-1">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={onBack}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600">Manage your content automation</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+2 new this week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="ideas" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white border border-gray-200">
              <TabsTrigger value="ideas" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Ideas</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="sources" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Sources</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Tracking</span>
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Prompts</span>
              </TabsTrigger>
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
