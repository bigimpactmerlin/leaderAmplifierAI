import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import AutomationForm from "@/components/AutomationForm";
import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type AppState = "auth" | "welcome" | "form" | "dashboard";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("auth");
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        setAppState("dashboard");
      } else {
        setAppState("auth");
      }
    }
  }, [isAuthenticated, loading]);

  const handleAuthSuccess = () => {
    setAppState("welcome");
  };

  const handleGetStarted = () => {
    setAppState("form");
  };

  const handleFormComplete = () => {
    setAppState("dashboard");
  };

  const handleBackToWelcome = () => {
    setAppState("welcome");
  };

  const handleBackToForm = () => {
    setAppState("form");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {appState === "auth" && (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
      
      {appState === "welcome" && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}
      
      {appState === "form" && (
        <AutomationForm onBack={handleBackToWelcome} />
      )}
      
      {appState === "dashboard" && (
        <Dashboard onBack={handleBackToForm} />
      )}
    </div>
  );
};

export default Index;