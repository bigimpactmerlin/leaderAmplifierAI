
import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import AutomationForm from "@/components/AutomationForm";
import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";

type AppState = "auth" | "welcome" | "form" | "dashboard";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("auth");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
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
