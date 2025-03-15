import React from "react";

interface PreadmissionFormValues {
  weight: number;
  height: number;
  glucose: number;
}

export const PreadmissionForm: React.FC<{ initialValues: any }> = ({
  initialValues,
}) => {
  console.log(initialValues);
  const [values, setValues] =
    React.useState<PreadmissionFormValues>(initialValues);

  const handleChange =
    (key: keyof PreadmissionFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [key]: +event.target.value });
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label>IMC</label>
        <input
          type="number"
          className="form-control m-1"
          value={values.height}
          onChange={handleChange("height")}
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
