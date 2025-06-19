
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, Heart, Share } from "lucide-react";

const TrackingTab = () => {
  const metrics = [
    { name: "Views", value: "12,543", change: "+12.5%", icon: Eye },
    { name: "Likes", value: "2,847", change: "+8.2%", icon: Heart },
    { name: "Shares", value: "651", change: "+15.7%", icon: Share },
    { name: "Engagement Rate", value: "4.2%", change: "+2.1%", icon: TrendingUp },
  ];

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <BarChart3 className="mr-2 h-5 w-5" />
          Performance Tracking
        </CardTitle>
        <p className="text-gray-600">Track your content performance and analytics</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-green-600 font-medium">{metric.change}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-gray-500">{metric.name}</div>
            </div>
          ))}
        </div>
        
        <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics Coming Soon</h3>
          <p className="text-gray-600">
            Detailed charts and insights will be available here to help you track your content performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingTab;
