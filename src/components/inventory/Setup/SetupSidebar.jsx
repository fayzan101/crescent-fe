"use client";

import React from 'react';

const SetupSidebar = ({ currentStep, onStepChange, completedSteps }) => {
    const steps = [
        { id: 'add-store', label: 'Add Store', description: 'Create storage locations' },
        { id: 'add-category', label: 'Add Category', description: 'Define item categories' },
        { id: 'add-group-section', label: 'Add Group/Section', description: 'Organize items into groups' },
        { id: 'add-vendor', label: 'Add Vendor/Supplier', description: 'Manage supplier information' }
    ];

    return (
        <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Setup Steps</h2>
            
            <div className="space-y-3">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = completedSteps.includes(step.id);
                    
                    return (
                        <button
                            key={step.id}
                            onClick={() => onStepChange(step.id)}
                            className={`
                                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                                ${isActive 
                                    ? 'border-customBlue bg-customBlue/10 shadow-sm' 
                                    : isCompleted 
                                        ? 'border-green-200 bg-green-50 hover:border-green-300'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                {/* Step Number */}
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                    ${isActive 
                                        ? 'bg-customBlue text-white' 
                                        : isCompleted 
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }
                                `}>
                                    {isCompleted ? '✓' : index + 1}
                                </div>
                                
                                {/* Step Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className={`
                                        font-medium text-sm
                                        ${isActive 
                                            ? 'text-customBlue' 
                                            : isCompleted 
                                                ? 'text-green-700'
                                                : 'text-gray-900'
                                        }
                                    `}>
                                        {step.label}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {/* Progress Indicator */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                        {completedSteps.length} of {steps.length} completed
                    </span>
                </div>
                
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SetupSidebar;
