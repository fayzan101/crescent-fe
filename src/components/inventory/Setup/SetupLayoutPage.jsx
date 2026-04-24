"use client";

import React, { useState } from 'react';
import SetupSidebar from './SetupSidebar';
import AddStorePage from './AddStore/AddStorePage';
import AddCategoryPage from './AddCategory/AddCategoryPage';
import AddGroupSectionPage from './AddGroupSection/AddGroupSectionPage';
import AddVendorPage from './AddVendor/AddVendorPage';

const SetupLayoutPage = () => {
    const [currentStep, setCurrentStep] = useState('add-store');
    const [completedSteps, setCompletedSteps] = useState([]);

    const steps = [
        { id: 'add-store', component: AddStorePage, label: 'Add Store' },
        { id: 'add-category', component: AddCategoryPage, label: 'Add Category' },
        { id: 'add-group-section', component: AddGroupSectionPage, label: 'Add Group/Section' },
        { id: 'add-vendor', component: AddVendorPage, label: 'Add Vendor/Supplier' }
    ];

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    const CurrentStepComponent = steps[currentStepIndex]?.component;

    const handleStepChange = (stepId) => {
        setCurrentStep(stepId);
    };

    const markStepCompleted = (stepId) => {
        if (!completedSteps.includes(stepId)) {
            setCompletedSteps(prev => [...prev, stepId]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="px-4 pt-4">
                <aside className="bg-white border-b rounded-xl border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <span>&gt;</span>
                            <span>Inventory Management</span>
                            <span>&gt;</span>
                            <span>Setup</span>
                            <span>&gt;</span>
                            <span className="text-gray-900 font-medium">{steps[currentStepIndex]?.label}</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Horizontal Steps Navigation */}
            <div className="px-4 py-6">
                <div className="flex items-center justify-between gap-3 mb-6 w-full flex-wrap">
                    {steps.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = completedSteps.includes(step.id);
                        
                        return (
                            <button
                                key={step.id}
                                onClick={() => handleStepChange(step.id)}
                                className={`
                                    flex-1 px-6 py-4 rounded-lg border-2 transition-all duration-200 font-medium text-base cursor-pointer whitespace-nowrap
                                    ${isActive 
                                        ? 'border-customBlue bg-customBlue text-white shadow-md' 
                                        : isCompleted 
                                            ? 'border-green-200 bg-green-50 text-green-700 hover:border-green-300'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {step.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="px-4 pb-4">
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                    {CurrentStepComponent && (
                        <CurrentStepComponent
                            onStepChange={handleStepChange}
                            onMarkCompleted={markStepCompleted}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SetupLayoutPage;
