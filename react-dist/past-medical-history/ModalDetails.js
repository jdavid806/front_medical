import React, { useState, useEffect } from "react";
import { PrimeReactProvider } from "primereact/api";
import { clinicalRecordService } from "../../services/api/index.js";
const CAMPOS = [
// Paso 1 - Heredofamiliares
{
  id: "diabetes",
  label: "¿Tiene antecedentes de diabetes en su familia?",
  placeholder: "Ejemplo: Padre y abuela materna",
  step: 1
}, {
  id: "hipertension",
  label: "¿Quién en su familia ha tenido hipertensión?",
  placeholder: "Ejemplo: Madre y abuelo paterno",
  step: 1
}, {
  id: "cancer",
  label: "¿Algún familiar ha tenido cáncer?",
  placeholder: "Ejemplo: Tía materna (de mama)",
  step: 1
}, {
  id: "cardiovasculares",
  label: "¿Existen antecedentes de enfermedades cardiovasculares?",
  placeholder: "Ejemplo: Ninguna reportada",
  step: 1
},
// Paso 2 - Personales Patológicos
{
  id: "enfermedades_previas",
  label: "¿Ha tenido enfermedades previas?",
  placeholder: "Ejemplo: Hepatitis A (infancia)",
  step: 2
}, {
  id: "cirugias",
  label: "¿Se ha sometido a alguna cirugía?",
  placeholder: "Ejemplo: Apendicectomía (2015)",
  step: 2
}, {
  id: "hospitalizaciones",
  label: "¿Ha sido hospitalizado anteriormente?",
  placeholder: "Ejemplo: Ninguna adicional",
  step: 2
}, {
  id: "alergias",
  label: "¿Tiene alguna alergia?",
  placeholder: "Ejemplo: Penicilina",
  step: 2
}, {
  id: "medicamentos",
  label: "¿Está en algún tratamiento con medicamentos?",
  placeholder: "Ejemplo: Metformina (tratamiento actual)",
  step: 2
},
// Paso 3 - Personales No Patológicos
{
  id: "habitos",
  label: "¿Cuáles son sus hábitos?",
  placeholder: "Ejemplo: No fuma, consume alcohol ocasionalmente",
  step: 3
}, {
  id: "actividad_fisica",
  label: "¿Con qué frecuencia realiza actividad física?",
  placeholder: "Ejemplo: Realiza ejercicio 3 veces por semana",
  step: 3
}, {
  id: "vacunacion",
  label: "¿Está al día con su esquema de vacunación?",
  placeholder: "Ejemplo: Esquema completo hasta la última revisión",
  step: 3
}, {
  id: "dieta",
  label: "¿Sigue alguna dieta?",
  placeholder: "Ejemplo: Controlada en carbohidratos",
  step: 3
},
// Paso 4 - Gineco-Obstétrica
{
  id: "menarquia",
  label: "¿A qué edad tuvo su primera menstruación?",
  placeholder: "Ejemplo: 12 años",
  step: 4
}, {
  id: "ciclos_menstruales",
  label: "¿Cómo son sus ciclos menstruales?",
  placeholder: "Ejemplo: Regulares",
  step: 4
}, {
  id: "gestaciones",
  label: "¿Cuántas gestaciones ha tenido?",
  placeholder: "Ejemplo: 2 (1 parto vaginal, 1 cesárea)",
  step: 4
}, {
  id: "metodos_anticonceptivos",
  label: "¿Usa algún método anticonceptivo?",
  placeholder: "Ejemplo: DIU",
  step: 4
}];
export const ModalDetails = () => {
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState();
  useEffect(() => {
    fetchClinicalRecord();
  }, []);
  const fetchClinicalRecord = async () => {
    const id = new URLSearchParams(window.location.search).get("id");
    try {
      const data = await clinicalRecordService.ofParentByType("PAST_MEDICAL_HISTORY", id);
      console.log(data);
      if (data.length > 0) {
        setSelectedClinicalRecord(data[0]);
      }
    } catch (error) {
      console.error("Error fetching clinical record:", error);
    }
  };
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", null));
};