
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Trash2 } from "lucide-react";
import { useState } from "react";

const SourcesTab = () => {
  const [sources, setSources] = useState([
    { id: 1, type: "Website", url: "https://techcrunch.com", status: "Active" },
    { id: 2, type: "RSS Feed", url: "https://feeds.feedburner.com/venturebeat", status: "Active" },
    { id: 3, type: "Social Media", url: "@elonmusk", status: "Inactive" },
  ]);
  
  const [newSource, setNewSource] = useState("");

  const addSource = () => {
    if (newSource.trim()) {
      setSources([...sources, {
        id: Date.now(),
        type: newSource.includes("@") ? "Social Media" : newSource.includes("feed") ? "RSS Feed" : "Website",
        url: newSource,
        status: "Active"
      }]);
      setNewSource("");
    }
  };

  const removeSource = (id: number) => {
    setSources(sources.filter(source => source.id !== id));
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Globe className="mr-2 h-5 w-5" />
          Content Sources
        </CardTitle>
        <p className="text-gray-600">Manage your content sources and feeds</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Source */}
          <div className="flex space-x-2">
            <Input
              placeholder="Enter website URL, RSS feed, or social handle..."
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addSource}>
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </div>

          {/* Sources List */}
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={source.type === "Website" ? "default" : source.type === "RSS Feed" ? "secondary" : "outline"}>
                    {source.type}
                  </Badge>
                  <span className="text-gray-900">{source.url}</span>
                  <Badge variant={source.status === "Active" ? "default" : "secondary"}>
                    {source.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSource(source.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SourcesTab;
