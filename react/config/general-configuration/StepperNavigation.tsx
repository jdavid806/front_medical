import React from 'react';
import { Button } from 'primereact/button';
import { StepperNavigationProps } from './types';

export const StepperNavigation: React.FC<StepperNavigationProps> = ({
    activeIndex,
    totalSteps,
    onPrevious,
    onNext,
    onSave,
    onCancel,
    isNextDisabled = false
}) => {

    return (
        <div className="stepper-navigation mt-4 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <small className="text-muted">
                        Navegación entre Módulos: <strong>{activeIndex + 1}</strong> de <strong>{totalSteps}</strong>
                    </small>
                </div>

                <div className="d-flex gap-2">
                    <Button
                        label="Módulo Anterior"
                        className="p-button-outlined"
                        disabled={activeIndex === 0}
                        onClick={onPrevious}
                        severity="secondary"
                    >
                        <i style={{ marginLeft: '10px' }} className="fa-solid fa-arrow-left me-2"></i>
                    </Button>

                  
                        <div className={`${activeIndex === totalSteps - 1 ? 'd-block' : 'd-none'}`} >
                            <Button
                                label="Finalizar Configuración"
                                icon="pi pi-check"
                                className="p-button-success"
                                onClick={onSave}
                                severity="success"
                            />
                        </div>
                  
                        <div className={`${!(activeIndex === totalSteps - 1) ? 'd-block' : 'd-none'}`} >
                            <Button
                                iconPos="right"
                                label="Siguiente Módulo"
                                className="p-button-primary"
                                onClick={onNext}
                                severity="primary"
                                disabled={isNextDisabled}
                                tooltip={isNextDisabled ? "Complete la configuración actual para continuar" : "Continuar al siguiente módulo"}
                                tooltipOptions={{ position: 'top' }}
                            >
                                <i style={{ marginLeft: '10px' }} className="fa-solid fa-arrow-right"></i>
                            </Button>
                        </div>
                </div>
            </div>
        </div >
    );
};