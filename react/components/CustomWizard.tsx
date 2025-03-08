import React, { useState } from 'react';
import { useEffect } from 'react';

export interface CustomWizardStepProps {
    label: string,
    icon: string,
    component: (props: { formData: any, handleChange: (e: any) => void, errors: any }) => React.ReactNode,
    disabled: boolean
}

interface CustomWizardProps {
    steps: CustomWizardStepProps[],
    validate: (currentStep: number, formData: any) => any,
    onSubmit: (data: any) => void
}

export const CustomWizard: React.FC<CustomWizardProps> = ({ steps, validate, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        const stepValidation = validate(currentStep, formData);
        if (Object.keys(stepValidation).length > 0) return setErrors(stepValidation);

        setErrors({});
        isLastStep ? onSubmit(formData) : setCurrentStep(prev => prev + 1);
    };

    const handlePrev = () => setCurrentStep(prev => prev - 1);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                type === 'file' ? files[0] : value
        }));
    };

    return (
        <div className="card theme-wizard mb-5">
            <div className="card-header bg-body-highlight pt-3 pb-2 border-bottom-0">
                <ul className="nav justify-content-between nav-wizard nav-wizard-success">
                    {steps.map((step, index) => (
                        <li key={step.label + index} className="nav-item">
                            <div className={`nav-link fw-semibold ${currentStep >= index ? 'active' : ''}`}>
                                <div className="text-center d-inline-block">
                                    <span className="nav-item-circle-parent">
                                        <span className="nav-item-circle">
                                            <i className={`fas ${step.icon}`} />
                                        </span>
                                    </span>
                                    <span className="d-none d-md-block mt-1 fs-9">{step.label}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card-body pt-4 pb-0">
                {steps.map((step, index) => (
                    <div
                        key={step.label + index}
                        className={`wizard-step ${currentStep === index ? 'active' : 'd-none'}`}
                    >
                        <step.component
                            formData={formData}
                            handleChange={handleChange}
                            errors={errors}
                        />
                    </div>
                ))}
            </div>

            <div className="card-footer border-top-0">
                <div className="d-flex pager wizard list-inline mb-0">
                    {currentStep > 0 && (
                        <button className="btn btn-link ps-0" onClick={handlePrev} type="button">
                            <i className="fas fa-chevron-left me-1" /> Previous
                        </button>
                    )}

                    <div className="flex-1 text-end">
                        <button
                            className="btn btn-primary px-6"
                            onClick={handleNext}
                            type="button"
                        >
                            {isLastStep ? 'Guardar' : 'Next'}
                            {!isLastStep && <i className="fas fa-chevron-right ms-1" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};