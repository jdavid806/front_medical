import React, {
    useState,
    useEffect,
    useImperativeHandle,
    forwardRef,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { PrescriptionFormProps } from "../interfaces/PrescriptionInterfaces";
import { Medicine } from "../../models/models";
import { inventoryService } from "../../../services/api/index";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

export interface PrescriptionFormInputs {
    patient_id: number;
    user_id: number;
    is_active: boolean;
    medicines: Medicine[];
}

const initialMedicine: Medicine = {
    name: "",
    medication: "",
    concentration: "",
    duration: 0,
    frequency: "",
    medication_type: "",
    observations: "",
    quantity: 0,
    take_every_hours: 0,
    showQuantity: false,
    showTimeField: false,
};

const medicationTypeOptions = [
    { label: "Seleccione", value: "" },
    { label: "Crema", value: "crema" },
    { label: "Jarabe", value: "jarabe" },
    { label: "Inyección", value: "inyeccion" },
    { label: "Tabletas", value: "tabletas" },
];

const hoursOptions = [1, 2, 3, 4, 5, 6, 7, 8, 10, 9, 12, 24].map((h) => ({
    label: `${h} horas`,
    value: h,
}));

const frequencyOptions = [
    { label: "Diaria", value: "Diaria" },
    { label: "Semanal", value: "Semanal" },
    {
        label: "Mensual", value: "Mensual"
    },
];

const PrescriptionForm: React.FC<PrescriptionFormProps> = forwardRef(
    ({ formId, initialData }, ref) => {
        const { control, handleSubmit, reset, setValue, watch } = useForm();
        const [useGroup, setUseGroup] = useState(false);
        const [selectedGroupId, setSelectedGroupId] = useState("");
        const [formData, setFormData] = useState<Medicine[]>([
            { ...initialMedicine },
        ]);
        const [addedMedications, setAddedMedications] = useState<Medicine[]>([]);
        const [editIndex, setEditIndex] = useState<number | null>(null);
        const [medicines, setMedicines] = useState<Medicine[]>([]);
        const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
            null
        );
        const [manualEntry, setManualEntry] = useState(false);

        useImperativeHandle(ref, () => ({
            getFormData: () => {
                return addedMedications;
            },
            resetForm: () => {
                reset()
                setFormData([{ ...initialMedicine }])
                setSelectedMedicine(null)
                setManualEntry(false)
            }
        }));

        const medicationType = watch("medication_type");
        const showQuantity = !["tabletas", ""].includes(medicationType);
        const disableQuantity = ["tabletas"].includes(medicationType);
        const showTimeField = ["tabletas", "jarabe"].includes(medicationType);

        const handleGroupToggle = () => {
            setUseGroup(!useGroup);
            setSelectedGroupId("");
            setFormData([{ ...initialMedicine }]);
            setManualEntry(false);
            reset();
        };

        const calculateQuantity = (duration: number, takeEveryHours: number) => {
            return Math.ceil(duration * 24 / takeEveryHours);
        }

        const handleMedicationChange = (
            index: number,
            field: string,
            value: any
        ) => {
            const newFormData = [...formData];
            let newQuantity = formData[index].quantity;

            console.log("field", field);
            console.log("value", value);

            if (["duration", "take_every_hours", "medication_type"].includes(field) && (value == "tabletas" || formData[index].medication_type == "tabletas")) {

                const finalDuration = field == "duration" ? value : formData[index].duration;
                const finalTakeEveryHours = field == "take_every_hours" ? value : formData[index].take_every_hours;

                console.log("duration", finalDuration);
                console.log("take_every_hours", finalTakeEveryHours);

                newQuantity = calculateQuantity(finalDuration, finalTakeEveryHours);

                console.log("newQuantity", newQuantity);
            }

            newFormData[index] = {
                ...newFormData[index],
                [field]: value,
                showQuantity:
                    field === "medication_type"
                        ? !["tabletas", ""].includes(value)
                        : newFormData[index].showQuantity,
                showTimeField:
                    field === "medication_type"
                        ? ["tabletas", "jarabe"].includes(value)
                        : newFormData[index].showTimeField,
                quantity: newQuantity,
            };
            setFormData(newFormData);
        };

        const handleMedicineSelection = (e: { value: Medicine }) => {
            setSelectedMedicine(e.value);
            if (e.value) {
                setValue("medication", e.value.name);
                setValue("name", e.value.name); // Añadimos esta línea
                setValue("concentration", e.value.concentration);
                handleMedicationChange(0, "medication", e.value.name);
                handleMedicationChange(0, "name", e.value.name); // Añadimos esta línea
                handleMedicationChange(0, "concentration", e.value.concentration);
            }
        };

        const handleAddMedication = () => {
            const currentMedication = {
                ...formData[0],
                name:
                    selectedMedicine?.name || formData[0].medication || formData[0].name,
                medication:
                    selectedMedicine?.name || formData[0].medication || formData[0].name,
            };

            if (editIndex !== null) {
                const updatedMedications = addedMedications.map((med, index) =>
                    index === editIndex ? currentMedication : med
                );
                setAddedMedications(updatedMedications);
                setEditIndex(null);
            } else {
                setAddedMedications((prev) => [...prev, currentMedication]);
            }

            setFormData([{ ...initialMedicine }]);
            setSelectedMedicine(null);
            setManualEntry(false);
            reset();
        };

        const handleEditMedication = (index: number) => {
            const medicationToEdit = addedMedications[index];
            if (medicationToEdit.medication_type == "tabletas") {
                const quantity = calculateQuantity(medicationToEdit.duration, medicationToEdit.take_every_hours);
                medicationToEdit.quantity = quantity;
            }
            setFormData([{ ...medicationToEdit }]);
            setEditIndex(index);
            setManualEntry(true);

            // Actualizar los valores del formulario
            Object.entries(medicationToEdit).forEach(([key, value]) => {
                setValue(key, value);
            });
        };

        const handleDeleteMedication = (index: number) => {
            setAddedMedications((prev) => prev.filter((_, i) => i !== index));
        };

        async function loadProducts() {
            const medications = await inventoryService.getMedications();
            setMedicines(medications);
        }

        useEffect(() => {
            if (initialData?.medicines) {
                setAddedMedications([...initialData.medicines]);
            }
        }, [initialData]);

        useEffect(() => {
            loadProducts();
        }, []);

        const renderField = (fieldName: string, label: string, index = 0) => {
            const commonProps = {
                control,
                name: `${fieldName}${index > 0 ? `-${index}` : ""}`,
                defaultValue: formData[index]?.[fieldName as keyof Medicine] || "",
            };

            switch (fieldName) {
                case "medication":
                    return useGroup ? (
                        <div className="col-md-12 mb-3">
                            <label className="form-label">{label}</label>
                            <Dropdown
                                inputId="medicines"
                                filter
                                options={medicines}
                                optionLabel="name"
                                placeholder="Seleccione"
                                className="w-100"
                                appendTo="self"
                                value={selectedMedicine}
                                onChange={handleMedicineSelection}
                            />
                        </div>
                    ) : (
                        <div className="col-md-12">
                            <label className="form-label" htmlFor="medication">
                                {label}
                            </label>
                            <Controller
                                {...commonProps}
                                render={({ field }) => (
                                    <InputText
                                        id="medication"
                                        {...field}
                                        className="w-100"
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            handleMedicationChange(0, "medication", e.target.value);
                                            handleMedicationChange(0, "name", e.target.value); // Añadimos esta línea
                                        }}
                                    />
                                )}
                            />
                        </div>
                    );

                case "concentration":
                    return (
                        <div className="col-md-4">
                            <label className="form-label" htmlFor={`concentration-${index}`}>
                                {label}
                            </label>
                            <Controller
                                {...commonProps}
                                render={({ field }) => (
                                    <InputText
                                        id={`concentration-${index}`}
                                        {...field}
                                        className="w-100"
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            handleMedicationChange(
                                                index,
                                                "concentration",
                                                e.target.value
                                            );
                                        }}
                                    />
                                )}
                            />
                        </div>
                    );

                case "frequency":
                    return (
                        <div className="col-md-4">
                            <label className="form-label" htmlFor={`frequency-${index}`}>
                                {label}
                            </label>
                            <Controller
                                {...commonProps}
                                render={({ field }) => (
                                    <Dropdown
                                        id={`frequency-${index}`}
                                        {...field}
                                        options={frequencyOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Seleccione"
                                        className="w-100"
                                        appendTo={"self"}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleMedicationChange(index, "frequency", e.value);
                                        }}
                                        value={formData[index]?.frequency}
                                    />
                                )}
                            />
                        </div>
                    );

                case "duration":
                    return (
                        <div className="col-md-4">
                            <label className="form-label" htmlFor={`duration-${index}`}>
                                {label}
                            </label>
                            <Controller
                                {...commonProps}
                                render={({ field }) => (
                                    <InputNumber
                                        id={`duration-${index}`}
                                        {...field}
                                        min={1}
                                        className="w-100"
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleMedicationChange(index, "duration", e.value);
                                        }}
                                        value={formData[index]?.duration}
                                    />
                                )}
                            />
                        </div>
                    );

                case "medication_type":
                    return (
                        <div className="col-md-6">
                            <label
                                className="form-label"
                                htmlFor={`medication_type-${index}`}
                            >
                                {label}
                            </label>
                            <Controller
                                {...commonProps}
                                render={({ field }) => (
                                    <Dropdown
                                        id={`medication_type-${index}`}
                                        {...field}
                                        options={medicationTypeOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Seleccione"
                                        className="w-100"
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleMedicationChange(index, "medication_type", e.value);
                                        }}
                                        appendTo={"self"}
                                        value={formData[index]?.medication_type}
                                    />
                                )}
                            />
                        </div>
                    );

                case "take_every_hours":
                    return (
                        <div className="col-md-6">
                            <label
                                className="form-label"
                                htmlFor={`take_every_hours-${index}`}
                            >
                                {label}
                            </label>
                            <Controller
                                {...commonProps}
                                render={({ field }) => (
                                    <Dropdown
                                        id={`take_every_hours-${index}`}
                                        {...field}
                                        options={hoursOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Seleccione"
                                        className="w-100"
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleMedicationChange(
                                                index,
                                                "take_every_hours",
                                                e.value
                                            );
                                        }}
                                        value={formData[index]?.take_every_hours}
                                        appendTo={"self"}
                                    />
                                )}
                            />
                        </div>
                    );

                case "quantity":
                    return (
                        <div className="col-md-6">
                            <label className="form-label" htmlFor={`quantity-${index}`}>
                                {label}
                            </label>
                            <Controller
                                {...commonProps}
                                render={({ field }) => (
                                    <InputNumber
                                        id={`quantity-${index}`}
                                        {...field}
                                        min={1}
                                        className="w-100"
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            handleMedicationChange(index, "quantity", e.value);
                                        }}
                                        value={formData[index]?.quantity}
                                        disabled={disableQuantity}
                                    />
                                )}
                            />
                        </div>
                    );

                default:
                    return null;
            }
        };

        return (
            <>
                <form id={formId} className="row g-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title">Medicamentos</h5>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="useGroup"
                                        checked={useGroup}
                                        onChange={handleGroupToggle}
                                    />
                                    <label className="form-check-label" htmlFor="useGroup">
                                        Agregar medicamentos desde inventario
                                    </label>
                                </div>
                            </div>

                            <div className="row">
                                {renderField("medication", "Medicamento")}
                                {renderField("concentration", "Concentración")}
                                {renderField("frequency", "Frecuencia")}
                                {renderField("duration", "Duración (días)")}
                                {renderField("medication_type", "Tipo Medicamento")}
                                {showTimeField && renderField("take_every_hours", "Tomar cada")}
                                {renderField("quantity", "Cantidad")}

                                <div className="col-12">
                                    <label className="form-label" htmlFor="observations">
                                        Indicaciones
                                    </label>
                                    <Controller
                                        name="observations"
                                        control={control}
                                        defaultValue={formData[0]?.observations || ""}
                                        render={({ field }) => (
                                            <textarea
                                                className="form-control"
                                                id="observations"
                                                {...field}
                                                rows={3}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    handleMedicationChange(
                                                        0,
                                                        "observations",
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 text-end">
                        <button
                            className="btn btn-primary"
                            type="button"
                            id="addMedicineBtn"
                            onClick={handleAddMedication}
                        >
                            <i className="fa-solid fa-plus"></i>{" "}
                            {editIndex !== null
                                ? "Actualizar Medicamento"
                                : "Agregar Medicamento"}
                        </button>
                    </div>

                    {addedMedications.length > 0 && (
                        <div className="mt-4">
                            <h5>Medicamentos de la receta</h5>
                            {addedMedications.map((med, index) => (
                                <div className="card mb-3" key={index}>
                                    <div className="card-body">
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            {med.name || med.medication || "Sin nombre"}
                                        </h6>
                                        <p className="card-text">
                                            Concentración: {med.concentration || "No especificado"}
                                        </p>
                                        <p className="card-text">
                                            Frecuencia: {med.frequency || "No especificado"}
                                        </p>
                                        <p className="card-text">
                                            Duración (días): {med.duration || "No especificado"}
                                        </p>
                                        <p className="card-text">
                                            Tipo Medicamento:{" "}
                                            {med.medication_type || "No especificado"}
                                        </p>
                                        {med.showTimeField && (
                                            <p className="card-text">
                                                Tomar cada: {med.take_every_hours || "No especificado"}{" "}
                                                Horas
                                            </p>
                                        )}
                                        {med.showQuantity && (
                                            <p className="card-text">
                                                Cantidad: {med.quantity || "No especificado"}
                                            </p>
                                        )}
                                        <p className="card-text">
                                            Indicaciones: {med.observations || "No especificado"}
                                        </p>
                                        <button
                                            type="button"
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => handleEditMedication(index)}
                                        >
                                            <i className="fa-solid fa-edit"></i> Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteMedication(index)}
                                        >
                                            <i className="fa-solid fa-trash"></i> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </form>
            </>
        );
    }
);

export default PrescriptionForm;
