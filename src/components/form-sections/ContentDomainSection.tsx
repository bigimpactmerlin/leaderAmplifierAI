
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentDomainSectionProps {
  domain: string;
  onUpdate: (domain: string) => void;
}

const ContentDomainSection = ({ domain, onUpdate }: ContentDomainSectionProps) => {
  const domains = [
    { value: "tech", label: "Technology" },
    { value: "marketing", label: "Marketing" },
    { value: "fashion", label: "Fashion" },
    { value: "fitness", label: "Fitness" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="space-y-2">
      <Label className="text-white">Content Domain</Label>
      <Select value={domain} onValueChange={onUpdate}>
        <SelectTrigger className="bg-white/5 border-white/20 text-white">
          <SelectValue placeholder="Select your content domain" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/20">
          {domains.map((item) => (
            <SelectItem key={item.value} value={item.value} className="text-white hover:bg-white/10">
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-400">
        Choose the primary domain for your content
      </p>
    </div>
  );
};

export default ContentDomainSection;
