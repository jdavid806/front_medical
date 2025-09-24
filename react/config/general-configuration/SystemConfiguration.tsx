import React from 'react';
import { Stepper } from 'primereact/stepper';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { useSystemConfiguration } from './hooks/useSystemConfiguration';
import { SystemConfigurationProps } from './types';
import { SystemConfigurationStyles } from './styles/SystemConfigurationStyles';
import { configurationSteps } from './types/steps';
import { StepperNavigation } from './StepperNavigation';
import { StepperPanel } from 'primereact/stepperpanel';

export const SystemConfiguration: React.FC<SystemConfigurationProps> = ({
    onSave,
    onCancel,
    initialStep = 0
}) => {
    const {
        activeIndex,
        goToNext,
        goToPrevious,
        goToStep,
        totalSteps,
        currentStep
    } = useSystemConfiguration(configurationSteps, initialStep);

    console.log('🔍 Paso actual en SystemConfiguration:', activeIndex, currentStep.label);

    const CurrentComponent = currentStep.component;

    const handleSave = () => {
        onSave?.({
            currentStep: currentStep.id,
            stepIndex: activeIndex
        });
    };

    const handleCancel = () => {
        onCancel?.();
    };

    const progressValue = ((activeIndex + 1) / totalSteps) * 100;

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-12">
                    <Card
                        title="Configuración General del Sistema"
                        className="shadow-sm system-configuration-card"
                    >
                        <div className="row g-0">
                            <div className="col-md-3 border-end">
                                <div className="p-3 h-100 bg-light">
                                    <h6 className="text-primary mb-3 fw-bold">Módulos de Configuración</h6>

                                    <Stepper
                                        activeStep={activeIndex}
                                        orientation="vertical"
                                        linear={false}
                                        className="vertical-stepper overflow-auto"
                                    >
                                        {configurationSteps.map((step, index) => (
                                            <StepperPanel
                                                key={step.id}
                                                header={step.label}
                                                icon={step.icon}

                                                onClick={() => goToStep(index)}
                                            />
                                        ))}
                                    </Stepper>
                                </div>
                            </div>

                            {/* Contenido Principal */}
                            <div className="col-md-9">
                                <div className="configuration-content p-4 card">
                                    <div className="progress-section mb-4">
                                        < div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">
                                                Módulo {activeIndex + 1} de {totalSteps}
                                            </small>
                                            <small className="text-primary fw-bold">
                                                {Math.round(progressValue)}% completado
                                            </small>
                                        </div>
                                        <ProgressBar
                                            value={progressValue}
                                            showValue={false}
                                            style={{ height: '10px', borderRadius: '5px' }}
                                        />
                                    </div>

                                    <div className="content-header mb-4">
                                        <h3 className="text-primary mb-2">
                                            <i className={`${currentStep.icon} me-3`}></i>
                                            {currentStep.label}
                                        </h3>
                                        <p className="text-muted mb-0">
                                            Complete la configuración de este módulo antes de continuar al siguiente.
                                        </p>
                                    </div>

                                    <div className="content-body mb-4">
                                        <CurrentComponent />
                                    </div>

                                    <StepperNavigation
                                        activeIndex={activeIndex}
                                        totalSteps={totalSteps}
                                        onPrevious={goToPrevious}
                                        onNext={goToNext}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div >
            </div >

            <style>{SystemConfigurationStyles}</style>
        </div >
    );
};

export default SystemConfiguration;