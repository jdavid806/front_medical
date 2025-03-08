import React, { useState, useEffect } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  clinicalRecordTypeService,
  clinicalRecordService,
} from "../../services/api";
import { usePatient } from "../patients/hooks/usePatient";

const heredofamiliares = [
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
];

// Paso 2 - Personales Patológicos
const personalesPatologicos = [
  {
    id: "enfermedades_previas",
    label: "¿Ha tenido enfermedades previas?",
    placeholder: "Ejemplo: Hepatitis A (infancia)",
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
];

const personalesNoPatologicos = [
  // Paso 3 - Personales No Patológicos
  {
    id: "habitos",
    label: "¿Cuáles son sus hábitos?",
    placeholder: "Ejemplo: No fuma, consume alcohol ocasionalmente",
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
];

const ginecoObtestrica = [
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

export const PastMedicalHistoryDetail: React.FC = () => {
  const [selectedRecordType, setSelectedRecordType] = useState<any>();
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState<any>();
  const [patientId, setPatientId] = useState<any>();

  const { patient } = usePatient(patientId);

  useEffect(() => {
    fetchClinicalRecordTypes();
    fetchClinicalRecord();
  }, []);

  const fetchClinicalRecordTypes = async () => {
    let data = await clinicalRecordTypeService.getAll();
    if (data.length) {
      data = data.filter((item: any) => item.key_ === "PAST_MEDICAL_HISTORY");
    }
    setSelectedRecordType(data[0]);
  };

  const fetchClinicalRecord = async () => {
    const patientId: any = new URLSearchParams(window.location.search).get(
      "patient_id"
    );

    const id: any = new URLSearchParams(window.location.search).get("id");

    let idValidation = patientId || id;
    setPatientId(idValidation);

    try {
      const data = await clinicalRecordService.ofParentByType(
        "PAST_MEDICAL_HISTORY",
        idValidation
      );

      console.log(data);

      if (data.length > 0) {
        setSelectedClinicalRecord(data[0]);
      }
    } catch (error) {
      console.error("Error fetching clinical record:", error);
    }
  };

  return (
    <PrimeReactProvider>
      <div className="wizard-content">
        {selectedClinicalRecord && (
          <>
            <h3 className="fw-bold mb-3">
              <i className="fa-solid fa-users fa-lg"></i>&nbsp; Antecedentes
              Heredofamiliares
            </h3>
            <div className="row">
              {heredofamiliares.map((campo) => (
                <div key={campo.id} className="col-md-6 mt-2">
                  <p>
                    <span className="fw-bold">{campo.label}:</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: selectedClinicalRecord.data[campo.id] || "",
                      }}
                    ></span>
                  </p>
                </div>
              ))}
            </div>
            <hr />
            <h3 className="fw-bold mb-3">
              <i className="fa-solid fa-heart-pulse fa-lg"></i>&nbsp;
              Antecedentes Personales Patológicos
            </h3>
            <div className="row">
              {personalesPatologicos.map((campo) => (
                <div key={campo.id} className="col-md-6 mt-2">
                  <p>
                    <span className="fw-bold">{campo.label}:</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: selectedClinicalRecord.data[campo.id] || "",
                      }}
                    ></span>
                  </p>
                </div>
              ))}
            </div>
            <hr />
            <h3 className="fw-bold mb-3">
              <i className="fa-solid fa-person-walking fa-lg"></i>&nbsp;
              Antecedentes Personales No Patológicos
            </h3>
            <div className="row">
              {personalesNoPatologicos.map((campo) => (
                <div key={campo.id} className="col-md-6 mt-2">
                  <p>
                    <span className="fw-bold">{campo.label}:</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: selectedClinicalRecord.data[campo.id] || "",
                      }}
                    ></span>
                  </p>
                </div>
              ))}
            </div>

            {patient && patient.gender == "FEMALE" && (
              <>
                <hr />
                <h3 className="fw-bold mb-3">
                  <i className="fa-solid fa-baby fa-lg"></i>&nbsp; Historia
                  Gineco-Obstétrica
                </h3>
                <div className="row">
                  {ginecoObtestrica.map((campo) => (
                    <div key={campo.id} className="col-md-6 mt-2">
                      <p>
                        <span className="fw-bold">{campo.label}:</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: selectedClinicalRecord.data[campo.id] || "",
                          }}
                        ></span>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </PrimeReactProvider>
  );
};
