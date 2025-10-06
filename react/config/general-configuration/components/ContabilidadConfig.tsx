import React, { useState, useEffect } from 'react';
import { Stepper } from 'primereact/stepper';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { StepperPanel } from 'primereact/stepperpanel';
import { ProgressBar } from 'primereact/progressbar';
import BillingConfigTab from '../../../config-accounting/billing/BilingConfigTab';
import { PaymentMethodsConfig } from '../../../config-accounting/paymentmethods/PaymentMethodsConfig';
import { TaxesConfig } from '../../../config-accounting/taxes/TaxesConfig';
import { RetentionConfig } from '../../../config-accounting/retention/RetentionConfig';
import { CostCenterConfig } from '../../../config-accounting/costcenters/CostCenterConfig';

// Componentes envueltos con props de validación
const MetodosPago: React.FC<{ onConfigurationComplete?: (isComplete: boolean) => void }> = ({
    onConfigurationComplete
}) => (
    <PaymentMethodsConfig onConfigurationComplete={onConfigurationComplete} />
);

const ImpuestosConfig: React.FC<{ onConfigurationComplete?: (isComplete: boolean) => void }> = ({
    onConfigurationComplete
}) => (
    <TaxesConfig onConfigurationComplete={onConfigurationComplete} />
);

const RetencionesConfig: React.FC<{ onConfigurationComplete?: (isComplete: boolean) => void }> = ({
    onConfigurationComplete
}) => (
    <RetentionConfig onConfigurationComplete={onConfigurationComplete} />
);

const CentrosCostoConfig: React.FC<{ onConfigurationComplete?: (isComplete: boolean) => void }> = ({
    onConfigurationComplete
}) => (
    <CostCenterConfig onConfigurationComplete={onConfigurationComplete} />
);

const FacturacionConfig: React.FC<{ onConfigurationComplete?: (isComplete: boolean) => void }> = ({
    onConfigurationComplete
}) => (
    <BillingConfigTab onConfigurationComplete={onConfigurationComplete} />
);

interface ContabilidadConfigProps {
    onConfigurationComplete?: (subStepCompletion: boolean[]) => void;
}

export const ContabilidadConfig: React.FC<ContabilidadConfigProps> = ({
    onConfigurationComplete
}) => {
    const [activeSubStep, setActiveSubStep] = useState(0);
    const [subStepCompletion, setSubStepCompletion] = useState<boolean[]>([false, false, false, false, false]);
    const [canProceed, setCanProceed] = useState(false);

    const subSteps = [
        {
            label: 'Métodos de Pago',
            component: MetodosPago,
            description: 'Configure al menos un método de pago'
        },
        {
            label: 'Impuestos',
            component: ImpuestosConfig,
            description: 'Configure al menos un impuesto'
        },
        {
            label: 'Retenciones',
            component: RetencionesConfig,
            description: 'Configure al menos una retención'
        },
        {
            label: 'Centros de Costo',
            component: CentrosCostoConfig,
            description: 'Configure al menos un centro de costo'
        },
        {
            label: 'Facturación',
            component: FacturacionConfig,
            description: 'Complete todas las configuraciones de facturación'
        }
    ];

    // Actualizar estado de completitud del paso actual
    const handleSubStepComplete = (isComplete: boolean) => {
        setSubStepCompletion(prev => {
            const newCompletion = [...prev];
            newCompletion[activeSubStep] = isComplete;

            console.log('🔄 Actualizando submódulo:', {
                activeSubStep,
                isComplete,
                newCompletion
            });

            return newCompletion;
        });
    };

    // Verificar si puede proceder al siguiente paso
    useEffect(() => {
        const currentStepComplete = subStepCompletion[activeSubStep];
        console.log('🔄 Estado de submódulos:', {
            activeSubStep,
            currentStepComplete,
            subStepCompletion
        });
        setCanProceed(currentStepComplete);
    }, [activeSubStep, subStepCompletion]);

    // ENVIAR EL ESTADO COMPLETO AL PADRE CADA VEZ QUE CAMBIE
    useEffect(() => {
        console.log('📤 Enviando estado completo al padre:', subStepCompletion);
        onConfigurationComplete?.(subStepCompletion);
    }, [subStepCompletion, onConfigurationComplete]);

    const handleNextSubStep = () => {
        if (!canProceed) return;

        setActiveSubStep(prev => Math.min(prev + 1, subSteps.length - 1));
    };

    const handlePrevSubStep = () => {
        setActiveSubStep(prev => Math.max(prev - 1, 0));
    };

    // Calcular progreso general
    const completedSteps = subStepCompletion.filter(Boolean).length;
    const progressValue = (completedSteps / subSteps.length) * 100;

    const CurrentComponent = subSteps[activeSubStep].component;

    return (
        <div className="contabilidad-configuration">
            <div className="row">
                <div className="col-md-4">
                    <Card title="Submódulos de Contabilidad" className="h-100">
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted">Progreso general</small>
                                <small className="text-primary fw-bold">
                                    {completedSteps} de {subSteps.length}
                                </small>
                            </div>
                            <ProgressBar
                                value={progressValue}
                                showValue={false}
                                style={{ height: '8px' }}
                            />
                        </div>

                        <Stepper
                            activeStep={activeSubStep}
                            onSelect={(e) => setActiveSubStep(e.index)}
                            orientation="vertical"
                            linear={false}
                        >
                            {subSteps.map((step, index) => (
                                <StepperPanel
                                    key={index}
                                    header={step.label}
                                    className={
                                        subStepCompletion[index]
                                            ? 'text-success fw-bold'
                                            : index === activeSubStep
                                                ? 'text-primary'
                                                : 'text-muted'
                                    }
                                />
                            ))}
                        </Stepper>
                    </Card>
                </div>

                <div className="col-md-8">
                    <div className="substep-content">
                        <div className="content-header mb-4">
                            <h4 className="text-primary mb-2">
                                {subSteps[activeSubStep].label}
                            </h4>
                        
                        </div>

                        <CurrentComponent onConfigurationComplete={handleSubStepComplete} />

                        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                            <div>
                                <small className="text-muted">
                                    Submódulo <strong>{activeSubStep + 1}</strong> de <strong>{subSteps.length}</strong>
                                </small>
                            </div>

                            <div className="d-flex gap-2">
                                <Button
                                    label="Submódulo Anterior"
                                    className="p-button-outlined"
                                    disabled={activeSubStep === 0}
                                    onClick={handlePrevSubStep}
                                    severity="secondary"
                                >
                                    <i style={{ marginLeft: '10px' }} className="fa-solid fa-arrow-left"></i>
                                </Button>

                                <Button
                                    iconPos="right"
                                    label="Siguiente Submódulo"
                                    className="p-button-success"
                                    disabled={!canProceed}
                                    onClick={handleNextSubStep}
                                    tooltip={!canProceed ?
                                        `Complete la configuración de ${subSteps[activeSubStep].label.toLowerCase()} para continuar` :
                                        "Continuar al siguiente submódulo"
                                    }
                                    tooltipOptions={{ position: 'top' }}
                                >
                                    <i style={{ marginLeft: '10px' }} className="fa-solid fa-arrow-right"></i>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};