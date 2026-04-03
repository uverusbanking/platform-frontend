import { Button } from "@/components/ui/button";
import React from "react";

interface _Props {
  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  currentStep: number;
  steps: any[];
}

function NavigationButtons({
  handlePrevious,
  handleNext,
  handleSubmit,
  currentStep,
  steps,
}: _Props) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 1}
      >
        Previous
      </Button>
      {currentStep < steps.length ? (
        <Button onClick={handleNext}>Next</Button>
      ) : (
        <Button onClick={handleSubmit}>Submit Application</Button>
      )}
    </div>
  );
}

export default NavigationButtons;
