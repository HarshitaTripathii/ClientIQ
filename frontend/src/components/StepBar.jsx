const steps = ["Project", "Upload", "Analyze", "Generate", "Automate"];

function StepBar({ currentStep }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b bg-white px-5 py-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const active = stepNumber <= currentStep;

        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                active ? "bg-teal-600 text-white" : "border border-slate-300 text-slate-500"
              }`}
            >
              {stepNumber}
            </div>
            <span className={active ? "font-medium text-teal-700" : "text-slate-500"}>{step}</span>
            {index < steps.length - 1 && <div className="hidden h-px w-12 bg-slate-300 sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

export default StepBar;

