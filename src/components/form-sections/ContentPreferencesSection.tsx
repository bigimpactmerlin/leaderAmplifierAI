
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ContentPreferencesSectionProps {
  preferences: {
    contentTypes: string[];
    platforms: string[];
    tone: string;
  };
  onUpdate: (preferences: {
    contentTypes: string[];
    platforms: string[];
    tone: string;
  }) => void;
}

const ContentPreferencesSection = ({ preferences, onUpdate }: ContentPreferencesSectionProps) => {
  const contentTypes = [
    { id: "text", label: "Text Posts" },
    { id: "image", label: "Image Content" },
    { id: "video", label: "Video Content" }
  ];

  const platforms = [
    { id: "twitter", label: "Twitter" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" }
  ];

  const tones = [
    { id: "professional", label: "Professional" },
    { id: "casual", label: "Casual" },
    { id: "humorous", label: "Humorous" }
  ];

  const handleContentTypeChange = (typeId: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...preferences.contentTypes, typeId]
      : preferences.contentTypes.filter(type => type !== typeId);
    
    onUpdate({
      ...preferences,
      contentTypes: updatedTypes
    });
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    const updatedPlatforms = checked
      ? [...preferences.platforms, platformId]
      : preferences.platforms.filter(platform => platform !== platformId);
    
    onUpdate({
      ...preferences,
      platforms: updatedPlatforms
    });
  };

  return (
    <div className="space-y-6">
      {/* Content Types */}
      <div className="space-y-3">
        <Label className="text-white text-base">Content Types</Label>
        <div className="space-y-2">
          {contentTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={preferences.contentTypes.includes(type.id)}
                onCheckedChange={(checked) => handleContentTypeChange(type.id, checked as boolean)}
                className="border-white/20 data-[state=checked]:bg-purple-600"
              />
              <Label htmlFor={type.id} className="text-white">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="space-y-3">
        <Label className="text-white text-base">Platforms</Label>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center space-x-2">
              <Checkbox
                id={platform.id}
                checked={preferences.platforms.includes(platform.id)}
                onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                className="border-white/20 data-[state=checked]:bg-purple-600"
              />
              <Label htmlFor={platform.id} className="text-white">
                {platform.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="space-y-3">
        <Label className="text-white text-base">Content Tone</Label>
        <RadioGroup
          value={preferences.tone}
          onValueChange={(value) => onUpdate({ ...preferences, tone: value })}
          className="space-y-2"
        >
          {tones.map((tone) => (
            <div key={tone.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={tone.id}
                id={tone.id}
                className="border-white/20 text-purple-600"
              />
              <Label htmlFor={tone.id} className="text-white">
                {tone.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ContentPreferencesSection;
