
import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import AutomationForm from "@/components/AutomationForm";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {!showForm ? (
        <WelcomeScreen onGetStarted={() => setShowForm(true)} />
      ) : (
        <AutomationForm onBack={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default Index;
