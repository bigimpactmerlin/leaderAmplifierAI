import Dashboard from "@/components/Dashboard";

const Index = () => {
  const handleBackToForm = () => {
    // For now, this doesn't do anything since we removed the form
    console.log("Back to form clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard onBack={handleBackToForm} />
    </div>
  );
};

export default Index;