import React, { useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { useForm } from "react-hook-form";

interface MedicationInventoryFormInputs {
    name: string;
    price: number;
    product_type_id: string | null;
    presentation: string | null;
    barcode: string;
    attention_type: string;
    sale_price: number;
    copayment: number;
    tax_charge_id: number;
    exam_type_id: number;
    account_number: string;
}

export const MedicationInventoryForm = () => {

    const stepperRef = useRef(null);

    const handleNext = () => {
        (stepperRef?.current as any | null)?.nextCallback();
    };

    const handlePrev = () => {
        (stepperRef?.current as any | null)?.prevCallback();
    };

    const {
        control,
        register,
        reset,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<MedicationInventoryFormInputs>({
        defaultValues: {
            product_type_id: null,
            presentation: null
        }
    });

    return <>
        <div className="card">
            <Stepper ref={stepperRef}>
                <StepperPanel header="Datos generales">
                    <div className="d-flex flex-column">
                        <div className="flex-auto d-flex justify-content-center align-items-center">

                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-end">
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={handleNext} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Información precio">
                    <div className="d-flex flex-column h-12rem">
                        <div className="flex-auto flex justify-content-center align-items-center">

                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-start">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={handlePrev} />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    </>;
};