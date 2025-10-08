import React, { useState } from "react"
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Specialty } from "../interfaces"
import { classNames } from "primereact/utils"
import { MultiSelect } from "primereact/multiselect"
import { Dialog } from "primereact/dialog"
import { PreviewSpecialtyPatientViewCards } from "./PreviewSpecialtyPatientViewCards"
import { useLoggedUser } from "../../../users/hooks/useLoggedUser"
import { Divider } from "primereact/divider"

interface SpecialtyPatientViewConfigFormProps {
    formId: string
    specialty: Specialty
}

interface SpecialtyPatientViewConfigFormInputs {
    visible_cards: string[]
}

export const SpecialtyPatientViewConfigForm = (props: SpecialtyPatientViewConfigFormProps) => {

    const { specialty, formId } = props

    const { loggedUser } = useLoggedUser()

    const { handleSubmit, control, formState: { errors } } = useForm<SpecialtyPatientViewConfigFormInputs>({
        defaultValues: {
            visible_cards: []
        }
    })

    const [showPreview, setShowPreview] = useState<boolean>(false)

    const onSubmit = (data: SpecialtyPatientViewConfigFormInputs) => {
        console.log(data);
    }

    const visibleCards = useWatch({
        name: "visible_cards",
        control: control
    })

    const getFormErrorMessage = (name: keyof SpecialtyPatientViewConfigFormInputs) => {
        return (
            errors[name] &&
            errors[name].type !== "required" && (
                <small className="p-error">{errors[name].message}</small>
            )
        );
    };

    const cards = [
        { value: 'consulta', label: "Consultas medicas" },
        { value: 'citas', label: "Citas" },
        { value: 'llamar-paciente', label: "Llamar al paciente" },
        { value: 'ordenes-medicas', label: "Ordenes médicas" },
        { value: 'ordenes-laboratorio', label: "Laboratorio" },
        { value: 'recetas', label: "Recetas médicas" },
        { value: 'recetas-optometria', label: "Recetas Optometría" },
        { value: 'incapacidades', label: "Incapacidades clínicas" },
        { value: 'antecedentes', label: "Antecedentes personales" },
        { value: 'consentimientos', label: "Consentimientos" },
        { value: 'presupuestos', label: "Presupuestos" },
        { value: 'esquema-vacunacion', label: "Esquema de vacunación" },
        { value: 'notas-enfermeria', label: "Notas de Enfermeria" },
        { value: 'evoluciones', label: "Evoluciones" },
        { value: 'remisiones', label: "Remisiones" },
        { value: 'preadmisiones', label: "Preadmisiones" },
    ]

    return <>
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-2">
                    <div className="d-flex flex-grow-1">
                        <div className="d-flex flex-column w-100">
                            <Controller
                                name="visible_cards"
                                control={control}
                                render={({ field }) => (<>
                                    <label htmlFor={field.name} className="form-label">
                                        Cards visibles *
                                    </label>
                                    <MultiSelect
                                        inputId={field.name}
                                        options={cards}
                                        optionLabel="label"
                                        filter
                                        showClear
                                        maxSelectedLabels={2}
                                        placeholder="Seleccione uno o más items"
                                        className={classNames("w-100", {
                                            "p-invalid": errors.visible_cards,
                                        })}
                                        appendTo={document.body}
                                        {...field}
                                    />
                                    <small className="text-muted">Seleccione las cards que estarán visibles en la vista del paciente</small>
                                </>)}
                            />
                            {getFormErrorMessage("visible_cards")}
                        </div>
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-primary me-2" onClick={() => setShowPreview(true)}>
                            <i className="fa fa-eye"></i> Previsualizar
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <Dialog
            header="Previsualización de cards"
            visible={showPreview}
            onHide={() => setShowPreview(false)}
            style={{ width: "80vw" }}
        >
            <PreviewSpecialtyPatientViewCards
                disableRedirects={true}
                availableCardsIds={visibleCards}
                userId={loggedUser?.id}
            />
        </Dialog>
    </>
}