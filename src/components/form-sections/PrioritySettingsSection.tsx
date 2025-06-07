
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PrioritySettingsSectionProps {
  settings: {
    engagementWeight: number;
    relevanceWeight: number;
    trendingWeight: number;
  };
  onUpdate: (settings: {
    engagementWeight: number;
    relevanceWeight: number;
    trendingWeight: number;
  }) => void;
}

const PrioritySettingsSection = ({ settings, onUpdate }: PrioritySettingsSectionProps) => {
  const handleSliderChange = (key: keyof typeof settings, value: number[]) => {
    onUpdate({
      ...settings,
      [key]: value[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-white">Engagement Weight</Label>
          <span className="text-sm text-gray-300">{(settings.engagementWeight * 100).toFixed(0)}%</span>
        </div>
        <Slider
          value={[settings.engagementWeight]}
          onValueChange={(value) => handleSliderChange('engagementWeight', value)}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
        <p className="text-sm text-gray-400">
          How much to prioritize content that drives engagement
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-white">Relevance Weight</Label>
          <span className="text-sm text-gray-300">{(settings.relevanceWeight * 100).toFixed(0)}%</span>
        </div>
        <Slider
          value={[settings.relevanceWeight]}
          onValueChange={(value) => handleSliderChange('relevanceWeight', value)}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
        <p className="text-sm text-gray-400">
          How much to prioritize content relevance to your domain
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-white">Trending Weight</Label>
          <span className="text-sm text-gray-300">{(settings.trendingWeight * 100).toFixed(0)}%</span>
        </div>
        <Slider
          value={[settings.trendingWeight]}
          onValueChange={(value) => handleSliderChange('trendingWeight', value)}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
        <p className="text-sm text-gray-400">
          How much to prioritize trending topics and hashtags
        </p>
      </div>
    </div>
  );
};

export default PrioritySettingsSection;
