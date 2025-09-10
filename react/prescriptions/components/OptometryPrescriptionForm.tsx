
import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

export interface OptometryPrescriptionFormProps {
    initialData?: OptometryPrescriptionFormInputs;
    ref?: React.RefObject<OptometryPrescriptionFormData>;
}

export interface OptometryPrescriptionFormInputs {
    visionSencilla: string;
    visionSencillaV: string;
    bifocalFLTTOP: string;
    bifocalFLTTOPH: string;
    bifocalInvisible: string;
    bifocalInvisibleD: string;
    progresivo: string;
    progresivoP: string;
    tratamiento: string;
    montura: string;
}

export interface OptometryPrescriptionFormData {
    visionSencilla: string;
    visionSencillaV: string;
    bifocalFLTTOP: string;
    bifocalFLTTOPH: string;
    bifocalInvisible: string;
    bifocalInvisibleD: string;
    progresivo: string;
    progresivoP: string;
    tratamiento: string;
    montura: string;
    [key: string]: string;
}

export interface OptometryPrescriptionFormRef {
    getFormData: () => OptometryPrescriptionFormData;
}

export const OptometryPrescriptionForm = forwardRef((props: OptometryPrescriptionFormProps, ref) => {
    const { initialData } = props;
    const { control, handleSubmit, getValues } = useForm<OptometryPrescriptionFormInputs>({
        defaultValues: initialData
    });

    const getFormData = (): OptometryPrescriptionFormData => {
        const data = {
            visionSencilla: getValues("visionSencilla"),
            visionSencillaV: getValues("visionSencillaV"),
            bifocalFLTTOP: getValues("bifocalFLTTOP"),
            bifocalFLTTOPH: getValues("bifocalFLTTOPH"),
            bifocalInvisible: getValues("bifocalInvisible"),
            bifocalInvisibleD: getValues("bifocalInvisibleD"),
            progresivo: getValues("progresivo"),
            progresivoP: getValues("progresivoP"),
            tratamiento: getValues("tratamiento"),
            montura: getValues("montura")
        };

        const camposQueratometria = [
            "queratometriaOjoDerecho",
            "esferaOjoDerecho",
            "cilindroOjoDerecho",
            "ejeOjoDerecho",
            "adicionOjoDerecho",
            "alturaOjoDerecho",
            "dpOjoDerecho",
            "queratometriaOjoIzquierdo",
            "esferaOjoIzquierdo",
            "cilindroOjoIzquierdo",
            "ejeOjoIzquierdo",
            "adicionOjoIzquierdo",
            "alturaOjoIzquierdo",
            "dpOjoIzquierdo"
        ]

        camposQueratometria.forEach(campo => {
            const value = (document.getElementById(campo) as HTMLInputElement)?.value
            if (value) {
                data[campo] = value
            }
        })

        return data;
    };

    useImperativeHandle(ref, () => ({
        getFormData
    }));

    return (
        <form id="formRecetaOptometria">
            <div className="mb-3">
                <div className="row">
                    <h4 className="mb-3">Cristal recomendado</h4>
                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="visionSencilla" className="form-label">Visión sencilla</label>
                        <Controller
                            name="visionSencilla"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="visionSencilla"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>
                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="visionSencillaV" className="form-label">V</label>
                        <Controller
                            name="visionSencillaV"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="visionSencillaV"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="bifocalFLTTOP" className="form-label">Bifocal FLTTOP</label>
                        <Controller
                            name="bifocalFLTTOP"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="bifocalFLTTOP"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>
                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="bifocalFLTTOPH" className="form-label">H</label>
                        <Controller
                            name="bifocalFLTTOPH"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="bifocalFLTTOPH"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="bifocalInvisible" className="form-label">Bifocal Invisible</label>
                        <Controller
                            name="bifocalInvisible"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="bifocalInvisible"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>
                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="bifocalInvisibleD" className="form-label">D</label>
                        <Controller
                            name="bifocalInvisibleD"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="bifocalInvisibleD"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="progresivo" className="form-label">Progresivo</label>
                        <Controller
                            name="progresivo"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="progresivo"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>
                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="progresivoP" className="form-label">P</label>
                        <Controller
                            name="progresivoP"
                            control={control}
                            render={({ field }) => (
                                <InputText
                                    id="progresivoP"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="tratamiento" className="form-label">Tratamiento</label>
                        <Controller
                            name="tratamiento"
                            control={control}
                            render={({ field }) => (
                                <InputTextarea
                                    id="tratamiento"
                                    {...field}
                                    className="w-100"
                                    autoResize
                                    rows={3}
                                />
                            )}
                        />
                    </div>
                    <div className="col-6 d-flex flex-column gap-2 mb-3">
                        <label htmlFor="montura" className="form-label">Montura</label>
                        <Controller
                            name="montura"
                            control={control}
                            render={({ field }) => (
                                <InputTextarea
                                    id="montura"
                                    {...field}
                                    className="w-100"
                                    autoResize
                                    rows={3}
                                />
                            )}
                        />
                    </div>

                </div>
            </div>

        </form>
    );
});