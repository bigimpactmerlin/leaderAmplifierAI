import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import AutomationForm from "@/components/AutomationForm";
import Dashboard from "@/components/Dashboard";
import LoginPage from "@/components/auth/LoginPage";
import { useUsers } from "@/hooks/useUsers";

type AppState = "welcome" | "form" | "dashboard" | "login";

const Index = () => {
  const { currentUser, isAuthenticated, loading } = useUsers();
  const [appState, setAppState] = useState<AppState>("login");

  // Update app state based on authentication status
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated() && currentUser) {
        // If user is authenticated, go to dashboard
        setAppState("dashboard");
      } else {
        // If user is not authenticated, go to login page
        setAppState("login");
      }
    }
  }, [currentUser, isAuthenticated, loading]);

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
    console.log("Login successful, redirecting to dashboard...");
    setAppState("dashboard");
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

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