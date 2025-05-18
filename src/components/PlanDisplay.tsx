import { useChatStore } from '../store';

const PlanDisplay = () => {
  const { currentPlan } = useChatStore();

  if (!currentPlan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <p className="text-gray-600">No active plan</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{currentPlan.title}</h2>
      <div className="space-y-4">
        {currentPlan.steps.map((step, index) => (
          <div
            key={index}
            className={`border-l-4 pl-4 ${
              step.status === 'completed'
                ? 'border-green-500'
                : step.status === 'in_progress'
                ? 'border-blue-500'
                : step.status === 'blocked'
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          >
            <h3 className="font-medium">Step {index + 1}</h3>
            <p className="text-gray-600">{step.text}</p>
            {step.notes && (
              <p className="text-sm text-gray-500 mt-1">{step.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDisplay;