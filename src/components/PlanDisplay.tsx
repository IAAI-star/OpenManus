const PlanDisplay = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="font-medium">Step 1</h3>
          <p className="text-gray-600">Analyzing request...</p>
        </div>
        {/* Add more steps as needed */}
      </div>
    </div>
  );
};

export default PlanDisplay;