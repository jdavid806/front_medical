import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
    Ref,
} from "react";
import { Button } from "primereact/button";
import { ExamForm } from "../exams/components/ExamForm";
import { DisabilityForm, DisabilityFormInputs } from "../disabilities/form/DisabilityForm";
import { Remission, remissionsForm as RemissionsForm } from "../remissions/RemissionsForm";
import PrescriptionForm, { PrescriptionFormInputs } from "../prescriptions/components/PrescriptionForm";
import { LeavingConsultationGenerateTicket } from "../tickets/LeavingConsultationGenerateTicket";
import {
    LeavingConsultationAppointmentForm,
    LeavingConsultationAppointmentFormRef,
} from "../appointments/LeavingConsultationAppointmentForm";
import { Divider } from "primereact/divider";
import { AddVaccineForm } from "../vaccines/form/AddVaccineForm";
import { Card } from "primereact/card";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty";
import {
    AutoComplete,
    AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { CustomPRTable } from "../components/CustomPRTable";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useMassMessaging } from "../hooks/useMassMessaging";
import { addDaysToDate, daysBetweenDates, stringToDate } from "../../services/utilidades";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages.js";
import { InputSwitch } from "primereact/inputswitch";
import { useLastPatientPrescription } from "../prescriptions/hooks/useLastPatientPrescription.js";
import { OptometryPrescriptionForm, OptometryPrescriptionFormRef } from "../prescriptions/components/OptometryPrescriptionForm.js";
import { Dropdown } from "primereact/dropdown";
import { useClinicalRecord } from "./hooks/useClinicalRecord.js";
import { appointmentService, clinicalRecordTypeService, userService } from "../../services/api/index.js";

interface FinishClinicalRecordFormProps {
    clinicalRecordType?: string;
    appointmentId?: string;
    patientId?: string;
    clinicalRecordId?: string;
    specialtyName?: string;
    ref?: any;
}

interface FinishClinicalRecordFormInputs {
    diagnosis: string | null;
    diagnoses: any[];
    treatment_plan: string | null;
}

export interface FinishClinicalRecordFormRef {
    getFormState: () => {
        exams: any;
        disability: any;
        prescriptions: any;
        optometry: any;
        remission: any;
        appointment: any;
        currentUser: any;
        currentAppointment: any;
        diagnoses: any[];
        treatmentPlan: string | null;
        clinicalRecordTypeId: string;
        examsActive: boolean;
        disabilitiesActive: boolean;
        prescriptionsActive: boolean;
        optometryActive: boolean;
        remissionsActive: boolean;
        appointmentActive: boolean;
        specialtyName: string;
        patientId: string;
        appointmentId: string;
    };
}

const diagnosisTypeOptions = [
    {
        value: 'definitivo',
        label: 'Definitivo'
    },
    {
        value: 'presuntivo',
        label: 'Presuntivo'
    },
    {
        value: 'diferencial',
        label: 'Diferencial'
    }
];

export const FinishClinicalRecordForm: React.FC<FinishClinicalRecordFormProps> =
    forwardRef((props, ref: Ref<FinishClinicalRecordFormRef>) => {
        const toast = useRef<Toast>(null);

        const {
            appointmentId = new URLSearchParams(window.location.search).get(
                "appointment_id"
            ) || "",
            clinicalRecordType = new URLSearchParams(window.location.search).get(
                "tipo_historia"
            ) || "",
            patientId = new URLSearchParams(window.location.search).get(
                "patient_id"
            ) ||
            new URLSearchParams(window.location.search).get("id") ||
            "",
            clinicalRecordId = new URLSearchParams(window.location.search).get(
                "clinical_record_id"
            ) || "",
            specialtyName = new URLSearchParams(window.location.search).get(
                "especialidad"
            ) || "medicina_general"
        } = props;

        const [finalClinicalRecordType, setFinalClinicalRecordType] = useState<string>(clinicalRecordType);
        const [finalPatientId, setFinalPatientId] = useState<string>(patientId);
        const [finalAppointmentId, setFinalAppointmentId] = useState<string>(appointmentId);
        const [finalSpecialtyName, setFinalSpecialtyName] = useState<string>(specialtyName);

        const { control, setValue, getValues } = useForm<FinishClinicalRecordFormInputs>({
            defaultValues: {
                diagnosis: null,
                diagnoses: [],
                treatment_plan: null,
            },
        });

        const { append: appendDiagnosis, remove: removeDiagnosis, update: updateDiagnosis } = useFieldArray({
            control,
            name: "diagnoses",
        });

        const diagnoses = useWatch({
            control,
            name: "diagnoses",
        });

        const { cie11Codes, loadCie11Codes, cie11Code, setCie11Code } = useSpecialty();
        const { getClinicalRecord, clinicalRecord: clinicalRecordForUpdate } = useClinicalRecord();
        const { clinicalPackages } = useClinicalPackages()

        const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

        const [initialSelectedExamTypes, setInitialSelectedExamTypes] = useState<string[]>([]);
        const [initialDisabilityFormData, setInitialDisabilityFormData] = useState<DisabilityFormInputs | undefined>(undefined);
        const [initialRemissionData, setInitialRemissionData] = useState<Remission | undefined>(undefined);
        const [initialPrescriptionData, setInitialPrescriptionData] = useState<PrescriptionFormInputs | undefined>(undefined);
        const [loadLastPrescriptionCheck, setLoadLastPrescriptionCheck] = useState<boolean>(false);

        const [clinicalRecordTypeId, setClinicalRecordTypeId] =
            useState<string>("");
        const [currentUser, setCurrentUser] = useState<any | null>(null);
        const [currentAppointment, setCurrentAppointment] = useState<any | null>(
            null
        );

        const [activeTab, setActiveTab] = useState<string | null>(null);
        const [examsActive, setExamsActive] = useState<boolean>(false);
        const [disabilitiesActive, setDisabilitiesActive] =
            useState<boolean>(false);
        const [prescriptionsActive, setPrescriptionsActive] =
            useState<boolean>(false);
        const [optometryActive, setOptometryActive] =
            useState<boolean>(false);
        const [vaccinationsActive, setVaccinationsActive] =
            useState<boolean>(false);
        const [remissionsActive, setRemissionsActive] = useState<boolean>(false);
        const [appointmentActive, setAppointmentActive] = useState<boolean>(false);
        const [turnsActive, setTurnsActive] = useState<boolean>(false);

        const examFormRef = useRef<any>(null);
        const disabilityFormRef = useRef<any>(null);
        const prescriptionFormRef = useRef<any>(null);
        const optometryFormRef = useRef<OptometryPrescriptionFormRef>(null);
        const vaccineFormRef = useRef<any>(null);
        const remissionFormRef = useRef<any>(null);
        const appointmentFormRef = useRef<LeavingConsultationAppointmentFormRef>(null);

        const showSuccessToast = ({
            title,
            message,
        }: {
            title?: string;
            message?: string;
        }) => {
            toast.current?.show({
                severity: "success",
                summary: title || "Éxito",
                detail: message || "Operación exitosa",
            });
        };

        const getRecipeTab = () => {
            if (["historiaOptometria", "historiaOptometriaD"].map((item) => item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()).includes(clinicalRecordType.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
                return {
                    key: "optometry",
                    label: "Receta de Optometría",
                };
            }

            return {
                key: "prescriptions",
                label: "Recetas Médicas",
            }
        };

        const tabs = [
            {
                key: "examinations",
                label: "Exámenes Clínicos",
            },
            {
                key: "incapacities",
                label: "Incapacidades Clínicas",
            },
            getRecipeTab(),
            {
                key: "referral",
                label: "Remisión",
            },
            {
                key: "appointment",
                label: "Cita",
            },
            {
                key: "turns",
                label: "Turnos",
            },
        ];

        const {
            sendMessage: sendMessageWpp,
        } = useMassMessaging();
        const { lastPatientPrescription, loadLastPatientPrescription } = useLastPatientPrescription();

        const sendMessageWppRef = useRef(sendMessageWpp);

        useEffect(() => {
            sendMessageWppRef.current = sendMessageWpp;
        }, [sendMessageWpp]);

        useImperativeHandle(ref, () => ({
            getFormState: () => {
                return {
                    clinicalRecordTypeId: clinicalRecordTypeId,
                    examsActive: examsActive,
                    disabilitiesActive: disabilitiesActive,
                    prescriptionsActive: prescriptionsActive,
                    optometryActive: optometryActive,
                    remissionsActive: remissionsActive,
                    appointmentActive: appointmentActive,
                    currentUser: currentUser,
                    currentAppointment: currentAppointment,
                    clinicalRecordId: clinicalRecordId,
                    diagnoses: diagnoses,
                    treatmentPlan: getValues("treatment_plan"),
                    exams: examFormRef.current?.getFormData(),
                    disability: disabilityFormRef.current?.getFormData(),
                    prescriptions: prescriptionFormRef.current?.getFormData(),
                    optometry: optometryFormRef.current?.getFormData(),
                    remission: remissionFormRef.current?.getFormData(),
                    appointment: appointmentFormRef.current?.mapAppointmentToServer(),
                    specialtyName: finalSpecialtyName,
                    patientId: finalPatientId,
                    appointmentId: finalAppointmentId
                };
            },
        }));

        const onPackageChange = (pkg: any) => {
            setSelectedPackage(pkg);

            setExamsActive(false)
            setDisabilitiesActive(false)
            setRemissionsActive(false)
            setPrescriptionsActive(false)

            setInitialSelectedExamTypes([])
            setInitialDisabilityFormData(undefined)
            setInitialRemissionData(undefined)
            setInitialPrescriptionData(undefined)

            const packageExamTypes = pkg.package_items.filter((item: any) => item.item_type == "App\\Models\\Examen")
            const packageExamTypeIds = packageExamTypes.map((item: any) => `${item.item_id}`)

            if (packageExamTypeIds.length > 0) {
                setExamsActive(true)
                setInitialSelectedExamTypes(packageExamTypeIds)
            }

            const packageDisability = pkg.package_items.find((item: any) => item.item_type == "App\\Models\\Incapacidad")
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

            const packageRemission = pkg.package_items.find((item: any) => item.item_type == "App\\Models\\Remision")
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

            const packagePrescriptions = pkg.package_items.filter((item: any) => item.item_type == "App\\Models\\medicamento")
            if (packagePrescriptions.length > 0) {
                setPrescriptionsActive(true)
                setInitialPrescriptionData({
                    user_id: 0,
                    patient_id: 0,
                    is_active: true,
                    medicines: [...packagePrescriptions.map((item: any) => ({
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
                    })), ...(lastPatientPrescription?.recipe_items || [])]
                })
            }
        };

        useEffect(() => {
            if (clinicalRecordId) {
                getClinicalRecord(+clinicalRecordId);
            }
        }, [clinicalRecordId]);

        useEffect(() => {
            if (clinicalRecordForUpdate) {
                setFinalClinicalRecordType(clinicalRecordForUpdate.clinical_record_type.key_)
                setFinalSpecialtyName(clinicalRecordForUpdate.created_by_user.specialty.name)
                setFinalPatientId(clinicalRecordForUpdate.patient_id)
                setFinalAppointmentId(clinicalRecordForUpdate.appointment_id)

                console.log("clinicalRecordForUpdate", clinicalRecordForUpdate);

                setValue('treatment_plan', clinicalRecordForUpdate.description);

                setValue('diagnoses', clinicalRecordForUpdate.clinical_record_diagnoses.map((diagnosis: any) => {
                    return {
                        codigo: diagnosis.diagnosis_code,
                        diagnosis_type: diagnosis.diagnosis_type,
                        description: diagnosis.diagnosis.descripcion,
                        label: `${diagnosis.diagnosis_code} - ${diagnosis.diagnosis.descripcion}`,
                    }
                }));

                const examRecipesDetails = clinicalRecordForUpdate.exam_recipes.map((examRecipe: any) =>
                    examRecipe.details.map((detail: any) => `${detail.exam_type_id}`)
                ).flat();

                if (examRecipesDetails.length > 0) {
                    setExamsActive(true)
                    setInitialSelectedExamTypes(examRecipesDetails)
                }

                if (clinicalRecordForUpdate.patient_disabilities.length > 0) {
                    const disability = clinicalRecordForUpdate.patient_disabilities[0]
                    setDisabilitiesActive(true)
                    setInitialDisabilityFormData({
                        user_id: 0,
                        days_disability: daysBetweenDates(stringToDate(disability.start_date), stringToDate(disability.end_date)),
                        start_date: stringToDate(disability.start_date),
                        end_date: stringToDate(disability.end_date),
                        reason: disability.reason,
                        id: 0,
                        isEditing: false
                    })
                }

                const prescriptionDetails = clinicalRecordForUpdate.recipes[0].recipe_items

                if (prescriptionDetails.length > 0) {
                    const prescription = clinicalRecordForUpdate.recipes[0]
                    setPrescriptionsActive(true)
                    setInitialPrescriptionData({
                        user_id: 0,
                        patient_id: prescription.patient_id,
                        is_active: true,
                        medicines: [...prescriptionDetails.map((item: any) => ({
                            medication: item.medication,
                            concentration: item.concentration,
                            duration: item.duration,
                            frequency: item.frequency,
                            medication_type: item.medication_type,
                            observations: item.observations,
                            quantity: item.quantity,
                            take_every_hours: +(item.take_every_hours),
                            showQuantity: false,
                            showTimeField: false,
                        }))]
                    })
                }

                const remission = clinicalRecordForUpdate.remissions[0]

                if (remission) {
                    setRemissionsActive(true)
                    setInitialRemissionData({
                        receiver_user_id: remission.receiver_user_id,
                        remitter_user_id: remission.remitter_user_id,
                        clinical_record_id: 0,
                        receiver_user_specialty_id: remission.receiver_user_specialty_id,
                        note: remission.note,
                    })
                }
            }
        }, [clinicalRecordForUpdate]);

        const handleLoadLastPrescriptionChange = async (e: boolean) => {
            setLoadLastPrescriptionCheck(e)
            if (e && selectedPackage) {
                const lastPrescription = await loadLastPatientPrescription(patientId);
                const newMedicines = [...(initialPrescriptionData?.medicines || []), ...lastPrescription.recipe_items];
                setInitialPrescriptionData({
                    user_id: 0,
                    patient_id: 0,
                    is_active: true,
                    medicines: newMedicines
                });
            } else if (e && !selectedPackage) {
                loadLastPrescription();
            } else if (!e && selectedPackage) {
                setPrescriptionsActive(true)
                setInitialPrescriptionData({
                    user_id: 0,
                    patient_id: 0,
                    is_active: true,
                    medicines: selectedPackage.package_items.filter((item: any) => item.item_type == "App\\Models\\medicamento").map((item: any) => ({
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
                    }))
                })
            } else {
                setInitialPrescriptionData({
                    user_id: 0,
                    patient_id: 0,
                    is_active: true,
                    medicines: []
                })
            }
        }

        const loadLastPrescription = async () => {
            const lastRecipe = await loadLastPatientPrescription(patientId);
            setInitialPrescriptionDataFromLastPatientPrescription(lastRecipe)
        }

        const setInitialPrescriptionDataFromLastPatientPrescription = (lastPatientPrescription: any) => {
            setInitialPrescriptionData({
                user_id: 0,
                patient_id: 0,
                is_active: true,
                medicines: lastPatientPrescription.recipe_items
            })
        }

        const shouldShowCIE11PackageButton = (cie11Code: any) => {
            return clinicalPackages.some(pkg => pkg.cie11 === cie11Code)
        }

        const getCIE11Package = (cie11Code: any) => {
            return clinicalPackages.find(pkg => pkg.cie11 === cie11Code)
        }

        const onCIE11PackageClick = (cie11Code: any) => {
            const pkg = getCIE11Package(cie11Code)
            if (pkg) {
                onPackageChange(pkg)
            }
            showSuccessToast({
                title: "Paquete seleccionado",
                message: `Se ha seleccionado el paquete ${pkg.label}`,
            })
        }

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
                case "optometry":
                    return optometryActive;
                default:
                    return false;
            }
        }

        useEffect(() => {
            const fetchClinicalRecordType = async () => {
                const clinicalRecordTypes = await clinicalRecordTypeService.getAll();
                const currentClinicalRecordType = clinicalRecordTypes.find(
                    (type: any) => type.key_ === finalClinicalRecordType
                );

                if (currentClinicalRecordType) {
                    setClinicalRecordTypeId(currentClinicalRecordType.id);
                }
            };

            fetchClinicalRecordType();
        }, [finalClinicalRecordType]);

        useEffect(() => {
            const fetchUser = async () => {
                const user = await userService.getLoggedUser();
                setCurrentUser(user);
            };

            fetchUser();
        }, []);

        useEffect(() => {
            const fetchAppointment = async () => {
                const appointment = await appointmentService.get(finalAppointmentId);
                setCurrentAppointment(appointment);
            };

            fetchAppointment();
        }, [finalAppointmentId]);

        return (
            <div>
                <Toast ref={toast} />

                <Card header={<h3 className="px-3 pt-3">Diagnósticos</h3>}>
                    <div className="d-flex gap-2">
                        <div className="d-flex flex-grow-1">
                            <div className="w-100 mb-3">
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
                                    appendTo={"self"}
                                    value={cie11Code}
                                    onChange={(e) => setCie11Code(e.value)}
                                    forceSelection={false}
                                    showEmptyMessage={true}
                                    emptyMessage="No se encontraron códigos CIE-11"
                                    delay={1000}
                                    minLength={3}
                                    panelStyle={{
                                        zIndex: 100000,
                                        width: "auto",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <Button
                                label="Agregar"
                                icon={<i className="fa fa-plus" />}
                                disabled={!cie11Code || !cie11Code.label}
                                onClick={() => {
                                    console.log("cie11Code", cie11Code);
                                    if (cie11Code && cie11Code.label) {
                                        appendDiagnosis(cie11Code);
                                        setCie11Code(null);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <CustomPRTable
                            data={diagnoses}
                            columns={[
                                {
                                    field: "label",
                                    header: "Diagnóstico"
                                },
                                {
                                    field: "",
                                    header: "Tipo de Diagnóstico",
                                    width: "200px",
                                    body: (rowData: any) => (<>
                                        <Dropdown
                                            id="diagnosis_type"
                                            value={rowData.diagnosis_type}
                                            onChange={(e) => updateDiagnosis(diagnoses.indexOf(rowData), { ...rowData, diagnosis_type: e.value })}
                                            options={diagnosisTypeOptions}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Seleccione un tipo de diagnóstico"
                                            className="w-100"
                                            showClear
                                        />
                                    </>)
                                },
                                {
                                    field: "actions",
                                    header: "Acciones",
                                    width: "100px",
                                    body: (row) => (
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            {shouldShowCIE11PackageButton(row.codigo) && (
                                                <Button
                                                    icon={<i className="fa fa-gift" />}
                                                    rounded
                                                    text
                                                    severity="success"
                                                    tooltip="Utilizar paquete configurado para CIE-11"
                                                    tooltipOptions={{
                                                        position: "top",
                                                    }}
                                                    onClick={() => onCIE11PackageClick(row.codigo)}
                                                />
                                            )}

                                            <Button
                                                icon={<i className="fa fa-trash" />}
                                                rounded
                                                text
                                                severity="danger"
                                                onClick={() => removeDiagnosis(diagnoses.indexOf(row))}
                                            />
                                        </div>
                                    ),
                                },
                            ]}
                            disableSearch
                            disableReload
                        />
                    </div>
                    <div className="mb-3">
                        <Controller
                            name="treatment_plan"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor="treatment-plan" className="form-label">
                                        Plan de Tratamiento
                                    </label>
                                    <Editor
                                        id="treatment-plan"
                                        value={field.value || ""}
                                        onTextChange={(e: EditorTextChangeEvent) =>
                                            field.onChange(e.htmlValue)
                                        }
                                        style={{ height: "320px" }}
                                        className={classNames({
                                            "p-invalid": fieldState.error,
                                        })}
                                    />
                                </>
                            )}
                        />
                    </div>
                </Card>
                <Divider />
                <div className="d-flex">
                    <div
                        className="p-3 border-right d-flex flex-column gap-2"
                        style={{ width: "300px", minWidth: "300px" }}
                    >
                        {tabs.map((tab) => (
                            <>
                                <Tab
                                    key={tab.key}
                                    tab={tab}
                                    activeTab={activeTab}
                                    onActiveTabChange={(activeTab) => setActiveTab(activeTab)}
                                    showCheckIcon={shouldShowCheckIcon(tab.key)}
                                />
                            </>
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
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <InputSwitch
                                        checked={loadLastPrescriptionCheck}
                                        onChange={e => handleLoadLastPrescriptionChange(e.value)}
                                    />
                                    <label htmlFor="loadLastPrescriptionCheck">Cargar Última Receta</label>
                                </div>

                                <PrescriptionForm
                                    ref={prescriptionFormRef}
                                    initialData={initialPrescriptionData}
                                />
                            </div>
                        </div>
                        <div
                            className={activeTab === "optometry" ? "d-block" : "d-none"}
                        >
                            <div className="d-flex justify-content-between">
                                <h2>Receta de Optometría</h2>
                                {!optometryActive && (
                                    <Button
                                        label="Agregar Receta de Optometría"
                                        className="btn btn-primary"
                                        onClick={() => setOptometryActive(true)}
                                    />
                                )}
                                {optometryActive && (
                                    <Button
                                        label="Cancelar"
                                        className="btn btn-danger"
                                        onClick={() => setOptometryActive(false)}
                                    />
                                )}
                            </div>
                            <Divider />
                            <div className={optometryActive ? "d-block" : "d-none"}>
                                <OptometryPrescriptionForm
                                    ref={optometryFormRef}
                                />
                            </div>
                        </div>
                        <div
                            className={activeTab === "vaccinations" ? "d-block" : "d-none"}
                        >
                            <div className="d-flex justify-content-between">
                                <h2>Vacunas</h2>
                                {!vaccinationsActive && (
                                    <Button
                                        label="Agregar Vacunas"
                                        className="btn btn-primary"
                                        onClick={() => setVaccinationsActive(true)}
                                    />
                                )}
                                {vaccinationsActive && (
                                    <Button
                                        label="Cancelar"
                                        className="btn btn-danger"
                                        onClick={() => setVaccinationsActive(false)}
                                    />
                                )}
                            </div>
                            <Divider />
                            <div className={vaccinationsActive ? "d-block" : "d-none"}>
                                <AddVaccineForm ref={vaccineFormRef} />
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
                        <div
                            className={activeTab === "appointment" ? "d-block" : "d-none"}
                        >
                            <div className="d-flex justify-content-between">
                                <h2>Cita</h2>
                                {!appointmentActive && (
                                    <Button
                                        label="Agregar Cita"
                                        className="btn btn-primary"
                                        onClick={() => setAppointmentActive(true)}
                                    />
                                )}
                                {appointmentActive && (
                                    <Button
                                        label="Cancelar"
                                        className="btn btn-danger"
                                        onClick={() => setAppointmentActive(false)}
                                    />
                                )}
                            </div>
                            <Divider />
                            <div className={appointmentActive ? "d-block" : "d-none"}>
                                <LeavingConsultationAppointmentForm
                                    patientId={patientId}
                                    userSpecialtyId={"1"}
                                    ref={appointmentFormRef}
                                />
                            </div>
                        </div>
                        <div className={activeTab === "turns" ? "d-block" : "d-none"}>
                            <div className="d-flex justify-content-between">
                                <h2>Turnos</h2>
                                {!turnsActive && (
                                    <Button
                                        label="Generar Turnos"
                                        className="btn btn-primary"
                                        onClick={() => setTurnsActive(true)}
                                    />
                                )}
                                {turnsActive && (
                                    <Button
                                        label="Cancelar"
                                        className="btn btn-danger"
                                        onClick={() => setTurnsActive(false)}
                                    />
                                )}
                            </div>
                            <Divider />
                            <div className={turnsActive ? "d-block" : "d-none"}>
                                <LeavingConsultationGenerateTicket patientId={patientId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

interface TabProps {
    tab: { key: string; label: string };
    activeTab: string | null;
    onActiveTabChange: ((activeTab: string | null) => void) | undefined;
    showCheckIcon: boolean;
}

const Tab: React.FC<TabProps> = ({ tab, activeTab, onActiveTabChange, showCheckIcon }) => {
    return (
        <>
            <Button
                className={`w-100 p-3 p-button-primary ${activeTab === tab.key ? "p-button-primary text-white" : ""
                    } btn-sm`}
                onClick={() => {
                    if (activeTab === tab.key) {
                        onActiveTabChange?.(null);
                        return;
                    }
                    onActiveTabChange?.(tab.key);
                }}
            >
                <div className="d-flex align-items-center gap-2">
                    <div className={showCheckIcon ? "d-block" : "d-none"}>
                        <i
                            className={`fas fa-check-circle`}
                            style={{ width: "20px", height: "20px" }}
                        />
                    </div>
                    {tab.label}
                </div>
            </Button>
        </>
    );
};
