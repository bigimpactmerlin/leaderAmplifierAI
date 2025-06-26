import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import AutomationForm from "@/components/AutomationForm";
import Dashboard from "@/components/Dashboard";
import LoginPage from "@/components/auth/LoginPage";
import { useUsers } from "@/hooks/useUsers";

type AppState = "welcome" | "form" | "dashboard" | "login";

const Index = () => {
  const { currentUser, isAuthenticated } = useUsers();
  const [appState, setAppState] = useState<AppState>("login");

  // Update app state based on authentication status
  useEffect(() => {
    if (isAuthenticated()) {
      if (appState === "login") {
        setAppState("dashboard");
      }
    } else {
      setAppState("login");
    }
  }, [currentUser, isAuthenticated]);

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      setAppState("dashboard");
    } else {
      setAppState("login");
    }
  };

  const handleFormComplete = () => {
    setAppState("dashboard");
  };

  const handleBackToWelcome = () => {
    setAppState("welcome");
  };

  const handleBackToLogin = () => {
    setAppState("login");
  };

  const handleLoginSuccess = () => {
    setAppState("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {appState === "login" && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
      
      {appState === "welcome" && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}
      
      {appState === "form" && (
        <AutomationForm onBack={handleBackToWelcome} />
      )}
      
      {appState === "dashboard" && (
        <Dashboard onBack={handleBackToLogin} />
      )}
    </div>
  );
};

export default Index;