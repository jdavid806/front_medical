import React, { useState, useEffect } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Editor } from "primereact/editor";
import {
  clinicalRecordTypeService,
  clinicalRecordService,
  userService,
} from "../../services/api";

const CAMPOS = [
  // Paso 1 - Heredofamiliares
  {
    id: "diabetes",
    label: "¿Tiene antecedentes de diabetes en su familia?",
    placeholder: "Ejemplo: Padre y abuela materna",
    step: 1,
  },
  {
    id: "hipertension",
    label: "¿Quién en su familia ha tenido hipertensión?",
    placeholder: "Ejemplo: Madre y abuelo paterno",
    step: 1,
  },
  {
    id: "cancer",
    label: "¿Algún familiar ha tenido cáncer?",
    placeholder: "Ejemplo: Tía materna (de mama)",
    step: 1,
  },
  {
    id: "cardiovasculares",
    label: "¿Existen antecedentes de enfermedades cardiovasculares?",
    placeholder: "Ejemplo: Ninguna reportada",
    step: 1,
  },

  // Paso 2 - Personales Patológicos
  {
    id: "enfermedades_previas",
    label: "¿Ha tenido enfermedades previas?",
    placeholder: "Ejemplo: Hepatitis A (infancia)",
    step: 2,
  },
  {
    id: "enfermedades_cronicas",
    label: "¿Padece una enfermedad cronica?",
    placeholder: "Ejemplo: Diabetes",
    step: 2,
  },
  {
    id: "enfermedades_cronicas_tiempo",
    label: "¿Tiempo con enfermedad cronica?",
    placeholder: "Ejemplo: 20 años con tratamiento de Metformina",
    step: 2,
  },
  {
    id: "alergias_medicamentos",
    label: "¿Alergias a medicamentos?",
    placeholder: "Ejemplo: Salbutamol",
    step: 2,
  },
  {
    id: "alergias_alimenticias",
    label: "¿Alergias con alimentos?",
    placeholder: "Ejemplo: Cebolla",
    step: 2,
  },
  {
    id: "cirugias",
    label: "¿Se ha sometido a alguna cirugía?",
    placeholder: "Ejemplo: Apendicectomía (2015)",
    step: 2,
  },
  {
    id: "hospitalizaciones",
    label: "¿Ha sido hospitalizado anteriormente?",
    placeholder: "Ejemplo: Ninguna adicional",
    step: 2,
  },
  {
    id: "alergias",
    label: "¿Tiene alguna alergia?",
    placeholder: "Ejemplo: Penicilina",
    step: 2,
  },
  {
    id: "medicamentos",
    label: "¿Está en algún tratamiento con medicamentos?",
    placeholder: "Ejemplo: Metformina (tratamiento actual)",
    step: 2,
  },

  // Paso 3 - Personales No Patológicos
  {
    id: "habitos",
    label: "¿Cuáles son sus hábitos?",
    placeholder: "Ejemplo: No fuma, consume alcohol ocasionalmente",
    step: 3,
  },
  {
    id: "habitos_alcohol",
    label: "¿Consume alcohol?",
    placeholder: "Ejemplo: Si toma, consume alcohol ocasionalmente",
    step: 3,
  },
  {
    id: "tabaco",
    label: "¿Consume Tabaco?",
    placeholder: "Ejemplo: No fuma, fuma socialmente",
    step: 3,
  },
  {
    id: "cafeina",
    label: "¿Consume cafeina?",
    placeholder: "Ejemplo: Si, consume cafe diariamente",
    step: 3,
  },
  {
    id: "actividad_fisica",
    label: "¿Con qué frecuencia realiza actividad física?",
    placeholder: "Ejemplo: Realiza ejercicio 3 veces por semana",
    step: 3,
  },
  {
    id: "vacunacion",
    label: "¿Está al día con su esquema de vacunación?",
    placeholder: "Ejemplo: Esquema completo hasta la última revisión",
    step: 3,
  },
  {
    id: "dieta",
    label: "¿Sigue alguna dieta?",
    placeholder: "Ejemplo: Controlada en carbohidratos",
    step: 3,
  },

  // Paso 4 - Gineco-Obstétrica
  {
    id: "menarquia",
    label: "¿A qué edad tuvo su primera menstruación?",
    placeholder: "Ejemplo: 12 años",
    step: 4,
  },
  {
    id: "ciclos_menstruales",
    label: "¿Cómo son sus ciclos menstruales?",
    placeholder: "Ejemplo: Regulares",
    step: 4,
  },
  {
    id: "gestaciones",
    label: "¿Cuántas gestaciones ha tenido?",
    placeholder: "Ejemplo: 2 (1 parto vaginal, 1 cesárea)",
    step: 4,
  },
  {
    id: "metodos_anticonceptivos",
    label: "¿Usa algún método anticonceptivo?",
    placeholder: "Ejemplo: DIU",
    step: 4,
  },
];

export const PastMedicalHistoryForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [checkedFields, setCheckedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [selectedRecordType, setSelectedRecordType] = useState<any>();
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState<any>();
  const [patientId, setPatientId] = useState<any>();
  const stepsContainerRef = React.useRef<HTMLDivElement>(null);
  const totalSteps = false ? 4 : 3;

  const steps = [
    { number: 1, label: "Heredofamiliares" },
    { number: 2, label: "Personales Patológicos" },
    { number: 3, label: "Personales No Patológicos" },
    { number: 4, label: "Historia Gineco-Obstétrica" },
  ];
  useEffect(() => {
    scrollToCurrentStep();
    fetchClinicalRecordTypes();
    fetchClinicalRecord();
  }, []);

  useEffect(() => {
    if (selectedClinicalRecord?.data) {
      const initialChecked: Record<string, boolean> = {};
      const initialTexts: Record<string, string> = {};

      CAMPOS.forEach((campo) => {
        const apiValue = selectedClinicalRecord.data[campo.id];
        const hasValue = apiValue !== null && apiValue !== "";

        initialChecked[campo.id] = false;
        initialTexts[campo.id] = hasValue ? apiValue : "";
      });

      setCheckedFields(initialChecked);
      setTextValues(initialTexts);
    }
  }, [selectedClinicalRecord]);

  const handleCheckboxChange = (fieldId: string) => {
    setCheckedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));

    // Limpiar contenido si se desmarca
    if (checkedFields[fieldId]) {
      setTextValues((prev) => ({
        ...prev,
        [fieldId]: "",
      }));
    }
  };

  const handleTextChange = (fieldId: string, content: string) => {
    setTextValues((prev) => ({ ...prev, [fieldId]: content }));
  };

  const scrollToCurrentStep = () => {
    if (stepsContainerRef.current) {
      const stepElement = stepsContainerRef.current.querySelector(
        `[data-step="${currentStep}"]`
      );
      if (stepElement) {
        stepElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const groupByStep = (fields: typeof CAMPOS) =>
    fields.reduce((acc, campo) => {
      if (!acc[campo.step]) acc[campo.step] = [];
      acc[campo.step].push(campo);
      return acc;
    }, {} as Record<number, typeof CAMPOS>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = getFormData();
    const loggedUser = await userService.getLoggedUser();
    const requestData = {
      clinical_record_type_id: selectedRecordType.id,
      created_by_user_id: loggedUser.id,
      branch_id: 1,
      data: formData["data"],
    };

    if (selectedClinicalRecord) {
      clinicalRecordService
        .updateForParent(selectedClinicalRecord.id, requestData)
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      clinicalRecordService
        .createForParent(patientId, requestData)
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  const getFormData = () => {
    const formData: Record<string, string> = {};

    CAMPOS.forEach((campo) => {
      formData[campo.id] = checkedFields[campo.id]
        ? textValues[campo.id] || ""
        : "";
    });

    return { data: formData };
  };

  const handleNavigation = (direction: "prev" | "next") => {
    setCurrentStep((prev) => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < totalSteps) return prev + 1;
      return prev;
    });
  };
  const renderNavigationButtons = () => (
    <div className="d-flex gap-2 justify-content-end mt-3">
      {currentStep > 1 && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleNavigation("prev")}
        >
          Anterior
        </button>
      )}

      {currentStep < totalSteps && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleNavigation("next")}
        >
          Siguiente
        </button>
      )}

      {currentStep === totalSteps && (
        <button type="submit" className="btn btn-primary">
          Finalizar
        </button>
      )}
    </div>
  );

  const fetchClinicalRecordTypes = async () => {
    let data = await clinicalRecordTypeService.getAll();
    if (data.length) {
      data = data.filter((item: any) => item.key_ === "PAST_MEDICAL_HISTORY");
    }
    setSelectedRecordType(data[0]);
  };

  const fetchClinicalRecord = async () => {
    const id: any = new URLSearchParams(window.location.search).get(
      "patient_id"
    );
    setPatientId(id);

    try {
      const data = await clinicalRecordService.ofParentByType(
        "PAST_MEDICAL_HISTORY",
        id
      );

      if (data.length > 0) {
        setSelectedClinicalRecord(data[0]);
      }
    } catch (error) {
      console.error("Error fetching clinical record:", error);
    }
  };

  return (
    <PrimeReactProvider>
      <div className="steps-container mb-4" ref={stepsContainerRef}>
        <ul className="steps">
          {steps.map((step) => (
            <li
              key={step.number}
              className={`step cursor-pointer ${currentStep === step.number ? "active" : ""
                } ${step.hidden ? "d-none" : ""}`}
              data-step={step.number}
              onClick={() => setCurrentStep(step.number)}
            >
              <span className="step-number">{step.number}</span>
              <span className="step-label">{step.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <form id="antecedentesForm" onSubmit={handleSubmit}>
        <div className="wizard-content">
          {Object.entries(groupByStep(CAMPOS)).map(([stepNumber, campos]) => (
            <div
              key={stepNumber}
              className={`p-3 wizard-step ${currentStep === Number(stepNumber) ? "active" : ""
                }`}
              data-step={stepNumber}
            >
              {campos.map((campo) => (
                <div key={campo.id} className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`chk_${campo.id}`}
                    checked={!!checkedFields[campo.id]}
                    onChange={() => handleCheckboxChange(campo.id)}
                  />
                  <label htmlFor={`chk_${campo.id}`}>{campo.label}</label>

                  {checkedFields[campo.id] && (
                    <div>
                      <Editor
                        value={textValues[campo.id] || ""}
                        onTextChange={(e: any) =>
                          handleTextChange(campo.id, e.htmlValue)
                        }
                        style={{ height: "220px" }}
                        className="form-control rich-text"
                        placeholder={campo.placeholder}
                      />
                      <div className="d-flex justify-content-end py-2">
                        <a
                          href="#"
                          className="text-decoration-none open-template-modal"
                          data-bs-toggle="modal"
                          data-textarea-id={campo.id}
                        >
                          <i className="fa-solid fa-file-prescription"></i>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {renderNavigationButtons()}
            </div>
          ))}
        </div>
      </form>
    </PrimeReactProvider>
  );
};
