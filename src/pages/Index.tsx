import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import AutomationForm from "@/components/AutomationForm";
import Dashboard from "@/components/Dashboard";

type AppState = "welcome" | "form" | "dashboard";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("dashboard");

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
    <div className="min-h-screen bg-gray-50">
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