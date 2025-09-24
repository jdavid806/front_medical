import React, { useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { StepperPanel } from 'primereact/stepperpanel';
import PaymentMethodFormConfig from '../../../config-accounting/paymentmethods/form/PaymentMethodFormConfig';
import TaxFormConfig from '../../../config-accounting/taxes/form/TaxesConfigForm';
import RetentionFormConfig from '../../../config-accounting/retention/form/RetentionFormConfig';
import CostCenterFormConfig from '../../../config-accounting/costcenters/form/CostCenterFormConfig';
import BillingConfigTab from '../../../config-accounting/billing/BilingConfigTab';

const MetodosPago: React.FC = () => (
    <PaymentMethodFormConfig />
);

const ImpuestosConfig: React.FC = () => (
    <TaxFormConfig />
);

const RetencionesConfig: React.FC = () => (
    <RetentionFormConfig />
);

const CentrosCostoConfig: React.FC = () => (
    <CostCenterFormConfig />
);

const FacturacionConfig: React.FC = () => (
    <BillingConfigTab />
);

export const ContabilidadConfig: React.FC = () => {
    const [activeSubStep, setActiveSubStep] = useState(0);

    const subSteps = [
        { label: 'Métodos de Pago', component: <MetodosPago /> },
        { label: 'Impuestos', component: <ImpuestosConfig /> },
        { label: 'Retenciones', component: <RetencionesConfig /> },
        { label: 'Centros de Costo', component: <CentrosCostoConfig /> },
        { label: 'Facturación', component: <FacturacionConfig /> }
    ];

    const handleNextSubStep = () => {
        setActiveSubStep(prev => Math.min(prev + 1, subSteps.length - 1));
    };

    const handlePrevSubStep = () => {
        setActiveSubStep(prev => Math.max(prev - 1, 0));
    };

    return (
        <div className="contabilidad-configuration">
            <div className="row">
                <div className="col-md-4">
                    <Card title="Submódulos de Contabilidad" className="h-100">
                        <Stepper
                            activeStep={activeSubStep}
                            onSelect={(e) => setActiveSubStep(e.index)}
                            orientation="vertical"
                            linear={false}
                        >
                            {subSteps.map((step, index) => (
                                <StepperPanel key={index} header={step.label} />
                            ))}
                        </Stepper>
                    </Card>
                </div>

                <div className="col-md-8">
                    <div className="substep-content">
                        {subSteps[activeSubStep].component}

                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                label="Anterior Submódulo"
                                className="p-button-outlined"
                                disabled={activeSubStep === 0}
                                onClick={handlePrevSubStep}
                            >
                                <i style={{ marginLeft: '10px' }} className="fa-solid fa-arrow-left"></i>
                            </Button>

                            <Button
                                iconPos="right"
                                label="Siguiente Submódulo"
                                className="p-button-success"
                                disabled={activeSubStep === subSteps.length - 1}
                                onClick={handleNextSubStep}
                            >
                                <i style={{ marginLeft: '10px' }} className="fa-solid fa-arrow-right"></i>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};