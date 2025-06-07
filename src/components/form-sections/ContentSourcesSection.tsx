
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface ContentSourcesSectionProps {
  sources: {
    websites: string[];
    socialHandles: string[];
    rssFeeds: string[];
  };
  onUpdate: (sources: {
    websites: string[];
    socialHandles: string[];
    rssFeeds: string[];
  }) => void;
}

const ContentSourcesSection = ({ sources, onUpdate }: ContentSourcesSectionProps) => {
  const [newWebsite, setNewWebsite] = useState("");
  const [newSocialHandle, setNewSocialHandle] = useState("");
  const [newRssFeed, setNewRssFeed] = useState("");

  const addSource = (type: 'websites' | 'socialHandles' | 'rssFeeds', value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      onUpdate({
        ...sources,
        [type]: [...sources[type], value.trim()]
      });
      setter("");
    }
  };

  const removeSource = (type: 'websites' | 'socialHandles' | 'rssFeeds', index: number) => {
    onUpdate({
      ...sources,
      [type]: sources[type].filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Websites */}
      <div className="space-y-2">
        <Label className="text-white">Website URLs</Label>
        <div className="flex gap-2">
          <Input
            value={newWebsite}
            onChange={(e) => setNewWebsite(e.target.value)}
            placeholder="https://example.com"
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSource('websites', newWebsite, setNewWebsite))}
          />
          <Button
            type="button"
            onClick={() => addSource('websites', newWebsite, setNewWebsite)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.websites.map((website, index) => (
            <Badge key={index} variant="secondary" className="bg-white/10 text-white">
              {website}
              <button
                type="button"
                onClick={() => removeSource('websites', index)}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Social Handles */}
      <div className="space-y-2">
        <Label className="text-white">Social Media Handles</Label>
        <div className="flex gap-2">
          <Input
            value={newSocialHandle}
            onChange={(e) => setNewSocialHandle(e.target.value)}
            placeholder="@username"
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSource('socialHandles', newSocialHandle, setNewSocialHandle))}
          />
          <Button
            type="button"
            onClick={() => addSource('socialHandles', newSocialHandle, setNewSocialHandle)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.socialHandles.map((handle, index) => (
            <Badge key={index} variant="secondary" className="bg-white/10 text-white">
              {handle}
              <button
                type="button"
                onClick={() => removeSource('socialHandles', index)}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* RSS Feeds */}
      <div className="space-y-2">
        <Label className="text-white">RSS Feeds</Label>
        <div className="flex gap-2">
          <Input
            value={newRssFeed}
            onChange={(e) => setNewRssFeed(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="bg-white/5 border-white/20 text-white placeholder-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSource('rssFeeds', newRssFeed, setNewRssFeed))}
          />
          <Button
            type="button"
            onClick={() => addSource('rssFeeds', newRssFeed, setNewRssFeed)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.rssFeeds.map((feed, index) => (
            <Badge key={index} variant="secondary" className="bg-white/10 text-white">
              {feed}
              <button
                type="button"
                onClick={() => removeSource('rssFeeds', index)}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentSourcesSection;
