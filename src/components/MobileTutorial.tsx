import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface MobileTutorialProps {
  onClose: () => void;
}

export default function MobileTutorial({ onClose }: MobileTutorialProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to RAB\'s 🏠',
      description: 'Design your dream home on mobile! Let\'s take a quick tour.',
      icon: '👋',
    },
    {
      title: 'Add Rooms & Elements',
      description: 'Tap the menu icon (☰) to add rooms and elements to your design.',
      icon: '➕',
    },
    {
      title: 'Edit Properties',
      description: 'Select any item and tap the settings icon (⚙️) to edit its properties.',
      icon: '✏️',
    },
    {
      title: 'Use Floating Buttons',
      description: 'Quick access to zoom, pan, and border controls on the bottom-right.',
      icon: '🎯',
    },
    {
      title: 'Ready to Design!',
      description: 'Start creating your floor plan. Your work auto-saves!',
      icon: '🚀',
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <div className="text-4xl">{currentStep.icon}</div>
          <button
            onClick={handleSkip}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-3">{currentStep.title}</h2>
        <p className="text-gray-600 mb-6">{currentStep.description}</p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === step
                  ? 'w-8 bg-blue-600'
                  : index < step
                  ? 'w-2 bg-blue-400'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {step < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'Get Started!'
            )}
          </button>
        </div>

        {step === 0 && (
          <button
            onClick={handleSkip}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip tutorial
          </button>
        )}
      </div>
    </div>
  );
}
