import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming cn utility exists, usually standard in shadcn/ui or modern setups

interface Step {
    id: string;
    name: string;
    type?: string;
    required?: boolean;
}

interface WorkflowStepperProps {
    steps: Step[];
    currentStep: number;
    className?: string;
}

export function WorkflowStepper({ steps, currentStep, className }: WorkflowStepperProps) {
    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative flex items-center justify-between w-full">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full -z-10" />

                {/* Active Progress Bar */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full -z-10 transition-all duration-300 ease-in-out"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isFuture = index > currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center group">
                            <div
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300 z-10 bg-white",
                                    isCompleted && "bg-success border-success text-white",
                                    isCurrent && "border-primary text-primary ring-4 ring-primary/20",
                                    isFuture && "border-gray-300 text-gray-300"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-medium">{index + 1}</span>
                                )}
                            </div>

                            <div className="absolute mt-10 flex flex-col items-center">
                                <span
                                    className={cn(
                                        "text-xs font-medium max-w-[80px] text-center transition-colors duration-300",
                                        isCompleted && "text-success",
                                        isCurrent && "text-primary font-bold",
                                        isFuture && "text-gray-400"
                                    )}
                                >
                                    {step.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
