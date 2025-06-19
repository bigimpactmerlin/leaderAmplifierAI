
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TrackingTab = () => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Performance Tracking</CardTitle>
        <p className="text-gray-300">Track your content performance and analytics</p>
      </CardHeader>
      <CardContent>
        <div className="text-white">
          <p>Analytics and tracking coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingTab;
