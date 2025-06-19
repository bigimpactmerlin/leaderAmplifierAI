
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SourcesTab = () => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Content Sources</CardTitle>
        <p className="text-gray-300">Manage your content sources and feeds</p>
      </CardHeader>
      <CardContent>
        <div className="text-white">
          <p>Sources management coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SourcesTab;
