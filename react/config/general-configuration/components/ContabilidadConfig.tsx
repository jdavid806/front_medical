import React, { useState, useEffect } from 'react';
import { Stepper } from 'primereact/stepper';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { StepperPanel } from 'primereact/stepperpanel';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import BillingConfigTab from '../../../config-accounting/billing/BilingConfigTab';
import { PaymentMethodsConfig } from '../../../config-accounting/paymentmethods/PaymentMethodsConfig';
import { TaxesConfig } from '../../../config-accounting/taxes/TaxesConfig';
import { RetentionConfig } from '../../../config-accounting/retention/RetentionConfig';
import { CostCenterConfig } from '../../../config-accounting/costcenters/CostCenterConfig';

// Componentes envueltos con props de validación
const MetodosPago: React.FC<{
    onConfigurationComplete?: (isComplete: boolean) => void;
    showValidation?: boolean;
}> = ({ onConfigurationComplete, showValidation }) => (
    <PaymentMethodsConfig
        onConfigurationComplete={onConfigurationComplete}
        showValidation={showValidation}
    />
);

const ImpuestosConfig: React.FC<{
    onConfigurationComplete?: (isComplete: boolean) => void;
    showValidation?: boolean;
}> = ({ onConfigurationComplete, showValidation }) => (
    <TaxesConfig
        onConfigurationComplete={onConfigurationComplete}
        showValidation={showValidation}
    />
);

const RetencionesConfig: React.FC<{
    onConfigurationComplete?: (isComplete: boolean) => void;
    showValidation?: boolean;
}> = ({ onConfigurationComplete, showValidation }) => (
    <RetentionConfig
        onConfigurationComplete={onConfigurationComplete}
        showValidation={showValidation}
    />
);

const CentrosCostoConfig: React.FC<{
    onConfigurationComplete?: (isComplete: boolean) => void;
    showValidation?: boolean;
}> = ({ onConfigurationComplete, showValidation }) => (
    <CostCenterConfig
        onConfigurationComplete={onConfigurationComplete}
        showValidation={showValidation}
    />
);

const FacturacionConfig: React.FC<{
    onConfigurationComplete?: (isComplete: boolean) => void;
    showValidation?: boolean;
}> = ({ onConfigurationComplete, showValidation }) => (
    <BillingConfigTab
        onConfigurationComplete={onConfigurationComplete}
        showValidation={showValidation}
    />
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
    const [stepProgress, setStepProgress] = useState<{ completed: number, total: number }>({ completed: 0, total: 0 });

    const subSteps = [
        {
            label: 'Métodos de Pago',
            component: MetodosPago,
            description: 'Configure al menos un método de pago',
            validationText: 'métodos de pago configurados'
        },
        {
            label: 'Impuestos',
            component: ImpuestosConfig,
            description: 'Configure al menos un impuesto',
            validationText: 'impuestos configurados'
        },
        {
            label: 'Retenciones',
            component: RetencionesConfig,
            description: 'Configure al menos una retención',
            validationText: 'retenciones configuradas'
        },
        {
            label: 'Centros de Costo',
            component: CentrosCostoConfig,
            description: 'Configure al menos un centro de costo',
            validationText: 'centros de costo configurados'
        },
        {
            label: 'Facturación',
            component: FacturacionConfig,
            description: 'Complete todas las configuraciones de facturación',
            validationText: 'configuraciones de facturación completadas'
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

    // Calcular progreso general
    useEffect(() => {
        const completedSteps = subStepCompletion.filter(Boolean).length;
        setStepProgress({
            completed: completedSteps,
            total: subSteps.length
        });
    }, [subStepCompletion]);

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

    // Enviar el estado completo al padre cada vez que cambie
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

    const progressValue = (stepProgress.completed / stepProgress.total) * 100;

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
                                    {stepProgress.completed} de {stepProgress.total}
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
                        {/* HEADER DE VALIDACIÓN SOLO EN CONTABILIDADCONFIG */}
                        <div className="content-header mb-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h4 className="text-primary mb-2">
                                        {subSteps[activeSubStep].label}
                                    </h4>
                                    <p className="text-muted mb-0">
                                        {subSteps[activeSubStep].description}
                                    </p>
                                </div>

                                {/* Badge de estado */}
                                <Badge
                                    value={subStepCompletion[activeSubStep] ? "✅ Completado" : "⏳ Pendiente"}
                                    severity={subStepCompletion[activeSubStep] ? "success" : "warning"}
                                    className="ms-2"
                                />
                            </div>

                            {/* Mensaje de validación interno */}
                            <div className={`alert ${subStepCompletion[activeSubStep] ? 'alert-success' : 'alert-info'} p-3`}>
                                <div className="d-flex align-items-center">
                                    <i className={`${subStepCompletion[activeSubStep] ? 'pi pi-check-circle' : 'pi pi-info-circle'} me-2`}></i>
                                    <span className="small">
                                        {subStepCompletion[activeSubStep]
                                            ? `✅ ${subSteps[activeSubStep].label} configurado correctamente. Puedes continuar al siguiente submódulo.`
                                            : `ℹ️ ${subSteps[activeSubStep].description}`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Componente actual SIN validaciones visibles */}
                        <CurrentComponent
                            onConfigurationComplete={handleSubStepComplete}
                            showValidation={false} // Prop para ocultar validaciones internas
                        />

                        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                            <div>
                                <small className="text-muted">
                                    Submódulo <strong>{activeSubStep + 1}</strong> de <strong>{subSteps.length}</strong>
                                </small>
                                {!canProceed && (
                                    <small className="text-warning d-block mt-1">
                                        ⚠️ Complete este submódulo para continuar
                                    </small>
                                )}
                            </div>

                            <div className="d-flex gap-2">
                                <Button
                                    label="Submódulo Anterior"
                                    icon="pi pi-arrow-left"
                                    className="p-button-outlined"
                                    disabled={activeSubStep === 0}
                                    onClick={handlePrevSubStep}
                                    severity="secondary"
                                />

                                <Button
                                    label="Siguiente Submódulo"
                                    icon="pi pi-arrow-right"
                                    iconPos="right"
                                    className="p-button-success"
                                    disabled={!canProceed}
                                    onClick={handleNextSubStep}
                                    tooltip={!canProceed ?
                                        `Complete la configuración de ${subSteps[activeSubStep].label.toLowerCase()} para continuar` :
                                        "Continuar al siguiente submódulo"
                                    }
                                    tooltipOptions={{ position: 'top' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};