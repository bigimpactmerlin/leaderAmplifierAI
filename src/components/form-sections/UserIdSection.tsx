
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface UserIdSectionProps {
  userId: string;
  onUpdate: (userId: string) => void;
}

const UserIdSection = ({ userId, onUpdate }: UserIdSectionProps) => {
  const generateNewId = () => {
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    onUpdate(newId);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="userId" className="text-white">User ID</Label>
      <div className="flex gap-2">
        <Input
          id="userId"
          value={userId}
          onChange={(e) => onUpdate(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder-gray-400"
          placeholder="Enter your user ID"
        />
        <Button
          type="button"
          variant="outline"
          onClick={generateNewId}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-400">
        Auto-generated ID or enter your custom identifier
      </p>
    </div>
  );
};

export default UserIdSection;
