import React, { forwardRef, useImperativeHandle } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { useClinicalPackage } from "../clinical-packages/hooks/useClinicalPackage";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty";
import { DisabilityForm, DisabilityFormInputs } from "../disabilities/form/DisabilityForm";
import PrescriptionForm, { PrescriptionFormInputs } from "../prescriptions/components/PrescriptionForm";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Tab } from "../components/tabs/Tab";
import { ExamForm } from "../exams/components/ExamForm";
import { Remission, remissionsForm as RemissionsForm } from "../remissions/RemissionsForm";
import { addDaysToDate } from "../../services/utilidades";
import { PrescriptionPackagesMapper } from "./mappers";

export interface PrescriptionPackagesFormProps {
    packageId?: string;
    ref?: React.RefObject<PrescriptionPackagesFormRef>;
}

export interface PrescriptionPackagesFormInputs {
    name: string;
    description: string;
    relatedTo: string;
    cie11: string | null;
    cups: string | null;
}

export interface PrescriptionPackagesFormData {
    name: string;
    description: string;
    cie11: string | null;
    cups: string | null;
    items: any[];
}

export interface PrescriptionPackagesFormRef {
    getFormData: () => PrescriptionPackagesFormData;
    resetForm: () => void;
}

export const PrescriptionPackagesForm = forwardRef((props: PrescriptionPackagesFormProps, ref) => {

    const { packageId } = props;

    const { clinicalPackage, fetchClinicalPackage, loading } = useClinicalPackage();
    const { cie11Codes, loadCie11Codes, cie11Code, setCie11Code } =
        useSpecialty();

    const { control, setValue, getValues, reset } = useForm<PrescriptionPackagesFormInputs>({
        defaultValues: {
            name: '',
            description: '',
            relatedTo: 'cie11',
            cie11: null,
            cups: null
        }
    });

    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [examsActive, setExamsActive] = useState<boolean>(false);
    const [disabilitiesActive, setDisabilitiesActive] =
        useState<boolean>(false);
    const [prescriptionsActive, setPrescriptionsActive] =
        useState<boolean>(false);
    const [remissionsActive, setRemissionsActive] = useState<boolean>(false);

    const [initialSelectedExamTypes, setInitialSelectedExamTypes] = useState<string[]>([]);
    const [initialDisabilityFormData, setInitialDisabilityFormData] = useState<DisabilityFormInputs | undefined>(undefined);
    const [initialRemissionData, setInitialRemissionData] = useState<Remission | undefined>(undefined);
    const [initialPrescriptionData, setInitialPrescriptionData] = useState<PrescriptionFormInputs | undefined>(undefined);

    const examFormRef = useRef<any>(null);
    const disabilityFormRef = useRef<any>(null);
    const prescriptionFormRef = useRef<any>(null);
    const remissionFormRef = useRef<any>(null);

    const relatedToOptions = [
        {
            label: 'CIE-11',
            value: 'cie11'
        },
        {
            label: 'CUPS',
            value: 'cups'
        }
    ];

    const tabs = [
        {
            key: "examinations",
            label: "Exámenes Clínicos",
        },
        {
            key: "incapacities",
            label: "Incapacidades Clínicas",
        },
        {
            key: "prescriptions",
            label: "Recetas Médicas",
        },
        {
            key: "referral",
            label: "Remisión",
        }
    ];

    useImperativeHandle(ref, () => ({
        getFormData: () => {
            return PrescriptionPackagesMapper.toFormDataFromFormInputs({
                formInputs: getValues(),
                exams: examsActive ? examFormRef.current?.getFormData() || [] : [],
                prescriptions: prescriptionsActive ? prescriptionFormRef.current?.getFormData() || [] : [],
                referrals: remissionsActive ? remissionFormRef.current?.getFormData() || null : null,
                disabilities: disabilitiesActive ? disabilityFormRef.current?.getFormData() || null : null,
            });
        },
        resetForm: () => {
            reset()
            examFormRef.current?.resetForm()
            disabilityFormRef.current?.resetForm()
            prescriptionFormRef.current?.resetForm()
            remissionFormRef.current?.resetForm()
        }
    }));

    useEffect(() => {
        if (packageId) {
            fetchClinicalPackage(packageId);
        }
    }, [packageId]);

    useEffect(() => {
        if (clinicalPackage) {
            setValue('name', clinicalPackage.name);
            setValue('description', clinicalPackage.description);
            setValue('relatedTo', clinicalPackage.cie11 ? 'cie11' : 'cups');
            setValue('cie11', clinicalPackage.cie11);
            setValue('cups', clinicalPackage.cups);
            setCie11Code(clinicalPackage.cie11);
            onPackageChange();
        }
    }, [clinicalPackage]);

    const onPackageChange = () => {

        setExamsActive(false)
        setDisabilitiesActive(false)
        setRemissionsActive(false)
        setPrescriptionsActive(false)

        setInitialSelectedExamTypes([])
        setInitialDisabilityFormData(undefined)
        setInitialRemissionData(undefined)
        setInitialPrescriptionData(undefined)

        const packageExamTypes = clinicalPackage.package_items.filter(item => item.item_type == "App\\Models\\Examen")
        const packageExamTypeIds = packageExamTypes.map(item => `${item.item_id}`)

        if (packageExamTypeIds.length > 0) {
            setExamsActive(true)
            setInitialSelectedExamTypes(packageExamTypeIds)
        }

        const packageDisability = clinicalPackage.package_items.find(item => item.item_type == "App\\Models\\Incapacidad")
        if (packageDisability) {
            setDisabilitiesActive(true)
            setInitialDisabilityFormData({
                user_id: 0,
                days_disability: packageDisability.prescription.days_incapacity,
                start_date: new Date(),
                end_date: addDaysToDate(new Date(), packageDisability.prescription.days_incapacity),
                reason: packageDisability.prescription.reason,
                id: 0,
                isEditing: false
            })
        }

        const packageRemission = clinicalPackage.package_items.find(item => item.item_type == "App\\Models\\Remision")
        if (packageRemission) {
            setRemissionsActive(true)
            setInitialRemissionData({
                receiver_user_id: packageRemission.prescription.user_id,
                remitter_user_id: 0,
                clinical_record_id: 0,
                receiver_user_specialty_id: packageRemission.prescription.specialty_id,
                note: packageRemission.prescription.reason,
            })
        }

        const packagePrescriptions = clinicalPackage.package_items.filter(item => item.item_type == "App\\Models\\medicamento")
        if (packagePrescriptions.length > 0) {
            setPrescriptionsActive(true)
            setInitialPrescriptionData({
                user_id: 0,
                patient_id: 0,
                is_active: true,
                medicines: [...packagePrescriptions.map(item => ({
                    medication: item.prescription.medication,
                    concentration: item.prescription.concentration, //
                    duration: item.prescription.duration_days, //
                    frequency: item.prescription.frequency, //
                    medication_type: item.prescription.medication_type, //
                    observations: item.prescription.instructions, //
                    quantity: item.prescription.quantity, //
                    take_every_hours: +(item.prescription.medication_frequency?.split(" ")[0]) || 0,
                    showQuantity: false,
                    showTimeField: false,
                }))]
            })
        }
    };

    const relatedTo = useWatch({
        control,
        name: 'relatedTo'
    });

    const shouldShowCheckIcon = (tabKey: string): boolean => {
        switch (tabKey) {
            case "examinations":
                return examsActive;
            case "incapacities":
                return disabilitiesActive;
            case "referral":
                return remissionsActive;
            case "prescriptions":
                return prescriptionsActive;
            default:
                return false;
        }
    }

    return (<>
        <div className="d-flex flex-column gap-3">
            <Controller
                name="name"
                control={control}
                render={({ field }) => (<>
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <InputText
                        id="name"
                        {...field}
                        className="w-100"
                    />
                </>)}
            />
            <Controller
                name="description"
                control={control}
                render={({ field }) => (<>
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <InputTextarea
                        id="description"
                        {...field}
                        rows={4}
                        cols={50}
                        className="w-100"
                    />
                </>)}
            />
            <div className="row">
                <div className="col-6">
                    <Controller
                        name="relatedTo"
                        control={control}
                        render={({ field }) => (<>
                            <label htmlFor="relatedTo" className="form-label">Relacionado con</label>
                            <Dropdown
                                id="relatedTo"
                                {...field}
                                options={relatedToOptions}
                                optionLabel="label"
                                optionValue="value"
                                className="w-100"
                            />
                        </>)}
                    />
                </div>
                <div className="col-6">
                    {relatedTo === 'cie11' && <>
                        <label htmlFor="cie11-code" className="form-label">
                            Escriba un Código CIE-11
                        </label>
                        <AutoComplete
                            inputId="cie11-code"
                            placeholder="Seleccione un CIE-11"
                            field="label"
                            suggestions={cie11Codes}
                            completeMethod={(event: AutoCompleteCompleteEvent) =>
                                loadCie11Codes(event.query)
                            }
                            inputClassName="w-100"
                            className="w-100"
                            value={cie11Code}
                            onChange={(e) => {
                                setCie11Code(e.value);
                                setValue('cie11', e.value?.codigo || null)
                            }}
                            forceSelection={false}
                            showEmptyMessage={true}
                            emptyMessage="No se encontraron códigos CIE-11"
                            delay={1000}
                            minLength={3}
                        />
                    </>}
                    {relatedTo === 'cups' && <>
                        <label htmlFor="cupsCode" className="form-label">Código CUPS</label>
                        <InputText
                            id="cupsCode"
                            className="w-100"
                        />
                    </>}
                </div>
            </div>
            <Divider />
            <div className="d-flex">
                <div
                    className="border-right d-flex flex-column gap-2"
                    style={{ width: "300px", minWidth: "300px" }}
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.key}
                            tab={tab}
                            activeTab={activeTab}
                            onActiveTabChange={(activeTab) => setActiveTab(activeTab)}
                            showCheckIcon={shouldShowCheckIcon(tab.key)}
                        />
                    ))}
                </div>
                <div className="p-3 flex-grow-1">
                    <div
                        className={activeTab === "examinations" ? "d-block" : "d-none"}
                    >
                        <div className="d-flex justify-content-between">
                            <h2>Exámenes Clínicos</h2>
                            {!examsActive && (
                                <Button
                                    label="Agregar Exámenes"
                                    className="btn btn-primary"
                                    onClick={() => setExamsActive(true)}
                                />
                            )}
                            {examsActive && (
                                <Button
                                    label="Cancelar"
                                    className="btn btn-danger"
                                    onClick={() => setExamsActive(false)}
                                />
                            )}
                        </div>
                        <Divider />
                        <div className={examsActive ? "d-block" : "d-none"}>
                            <ExamForm ref={examFormRef} initialSelectedExamTypes={initialSelectedExamTypes} />
                        </div>
                    </div>
                    <div
                        className={activeTab === "incapacities" ? "d-block" : "d-none"}
                    >
                        <div className="d-flex justify-content-between">
                            <h2>Incapacidades Clínicas</h2>
                            {!disabilitiesActive && (
                                <Button
                                    label="Agregar Incapacidad"
                                    className="btn btn-primary"
                                    onClick={() => setDisabilitiesActive(true)}
                                />
                            )}
                            {disabilitiesActive && (
                                <Button
                                    label="Cancelar"
                                    className="btn btn-danger"
                                    onClick={() => setDisabilitiesActive(false)}
                                />
                            )}
                        </div>
                        <Divider />
                        <div className={disabilitiesActive ? "d-block" : "d-none"}>
                            <DisabilityForm
                                ref={disabilityFormRef}
                                formConfig={{
                                    fieldsConfig: {
                                        user_id: {
                                            visible: false
                                        }
                                    }
                                }}
                                initialData={initialDisabilityFormData}
                            />
                        </div>
                    </div>
                    <div
                        className={activeTab === "prescriptions" ? "d-block" : "d-none"}
                    >
                        <div className="d-flex justify-content-between">
                            <h2>Recetas Médicas</h2>
                            {!prescriptionsActive && (
                                <Button
                                    label="Agregar Recetas"
                                    className="btn btn-primary"
                                    onClick={() => setPrescriptionsActive(true)}
                                />
                            )}
                            {prescriptionsActive && (
                                <Button
                                    label="Cancelar"
                                    className="btn btn-danger"
                                    onClick={() => setPrescriptionsActive(false)}
                                />
                            )}
                        </div>
                        <Divider />
                        <div className={prescriptionsActive ? "d-block" : "d-none"}>
                            <PrescriptionForm
                                ref={prescriptionFormRef}
                                initialData={initialPrescriptionData}
                            />
                        </div>
                    </div>
                    <div className={activeTab === "referral" ? "d-block" : "d-none"}>
                        <div className="d-flex justify-content-between">
                            <h2>Remisión</h2>
                            {!remissionsActive && (
                                <Button
                                    label="Agregar Remisión"
                                    className="btn btn-primary"
                                    onClick={() => setRemissionsActive(true)}
                                />
                            )}
                            {remissionsActive && (
                                <Button
                                    label="Cancelar"
                                    className="btn btn-danger"
                                    onClick={() => setRemissionsActive(false)}
                                />
                            )}
                        </div>
                        <Divider />
                        <div className={remissionsActive ? "d-block" : "d-none"}>
                            <RemissionsForm ref={remissionFormRef} initialData={initialRemissionData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
});