import React, { useEffect } from "react";
import { historyPreadmission } from "../../services/api";
import { SwalManager } from "../../services/alertManagerImported";

interface PreadmissionFormValues {
  weight: number;
  height: number;
  glucose: number;
  imc: number;
}

export const PreadmissionForm: React.FC<{
  initialValues: any;
  formId: string;
}> = ({ initialValues, formId }) => {
  useEffect(() => {
    fetchLastHistory();
  }, []);
  const [values, setValues] =
    React.useState<PreadmissionFormValues>(initialValues);

  const handleChange =
    (key: keyof PreadmissionFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = +event.target.value;
      const newValues = { ...values, [key]: newValue };

      if (key === "weight" || key === "height") {
        const weight = key === "weight" ? newValue : newValues.weight;
        const height = key === "height" ? newValue : newValues.height;
        if (weight > 0 && height > 0) {
          newValues.imc = weight / (height / 100) ** 2;
        }
      }

      setValues(newValues);
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestData = {
      weight: values.weight,
      size: values.height,
      glycemia: values.glucose,
      patient_id: initialValues.patientId,
      appointment_id: initialValues.id,
    };

    historyPreadmission
      .createHistoryPreadmission(requestData)
      .then((response) => {
        console.log(response);
        SwalManager.success();
        window.location.href = "citasControl";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchLastHistory = async () => {
    let data: any = {};
    try {
      data = await historyPreadmission.getHistoryPatient(
        initialValues.patientId
      );
      setValues({
        weight: data.weight,
        height: data.size,
        glucose: data.glycemia,
        imc: data.weight / (data.size / 100) ** 2,
      });
    } catch (error) {
      console.error("Error fetching last history:", error);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Peso (lb)</label>
        <input
          type="number"
          className="form-control m-1"
          value={values.weight}
          onChange={handleChange("weight")}
        />
      </div>
      <div className="form-group">
        <label>Talla (cm)</label>
        <input
          type="number"
          className="form-control m-1"
          value={values.height}
          onChange={handleChange("height")}
        />
      </div>
      <div className="form-group">
        <label>IMC(kg/m2)</label>
        <input
          type="number"
          className="form-control m-1"
          value={values.imc?.toFixed(2)}
          onChange={handleChange("imc")}
          readOnly
        />
      </div>
      <div className="form-group">
        <label>Glucemia (mg/dL)</label>
        <input
          type="number"
          className="form-control m-1"
          value={values.glucose}
          onChange={handleChange("glucose")}
        />
      </div>
    </form>
  );
};
