export interface SubStep {
    id: string;
    label: string;
    icon: string;
}

// En tu archivo de tipos
export interface ConfigurationStep {
    id: string;
    label: string;
    icon: React.ReactNode;
    component: React.ComponentType<any>;
}
export interface SystemConfigurationProps {
    onSave?: (data: { currentStep: string; stepIndex: number }) => void;
    onCancel?: () => void;
    initialStep?: number;
}

export interface StepperNavigationProps {
    activeIndex: number;
    totalSteps: number;
    onPrevious: () => void;
    onNext: () => void;
    onSave: () => void;
    onCancel: () => void;
}

export interface ComponentConfigProps {
    currentSubStep: number;
    totalSubSteps: number;
    onSubStepChange: (index: number) => void;
}