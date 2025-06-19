
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Bot, Zap, TrendingUp } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            LeaderAmplifierAi
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Transform your social media presence with AI-powered automation. 
            Create engaging content, schedule posts, and amplify your leadership voice across all platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 p-6">
            <Bot className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Content Generation</h3>
            <p className="text-gray-700 text-sm">
              Intelligent content creation tailored to your domain and voice
            </p>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-white/20 p-6">
            <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Platform Automation</h3>
            <p className="text-gray-700 text-sm">
              Seamlessly post across Twitter, LinkedIn, Instagram, and TikTok
            </p>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-white/20 p-6">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Optimization</h3>
            <p className="text-gray-700 text-sm">
              Data-driven insights to maximize engagement and reach
            </p>
          </Card>
        </div>

        <Button 
          onClick={onGetStarted}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg group"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
