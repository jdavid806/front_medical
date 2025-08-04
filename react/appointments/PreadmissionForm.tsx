import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { historyPreadmission, userService } from "../../services/api";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { Nullable } from "primereact/ts-helpers";
import {
  AddParaclinicalForm,
  AddParaclinicalFormHandle,
} from "../clinical-records/AddParaclinicalForm";
import { validFile } from "../../services/utilidades";
import { useExamRecipeResultCreate } from "../exam-recipe-results/hooks/useExamRecipeResultCreate";
import { useExamRecipeResultUpdate } from "../exam-recipe-results/hooks/useExamRecipeResultUpdate";
import { SwalManager } from "../../services/alertManagerImported";
import { InputSwitch } from "primereact/inputswitch";

export interface ExamRecipeResultFormInputs {
  date: Nullable<Date>;
  exam_recipe_id: string | null;
  comment?: string;
  result_file?: File | null;
  result_file_url?: string | null;
}

export interface PreadmissionFormInputs {
  weight: number;
  height: number;
  glucose: number;
  imc: number;
  extra_data: {
    porcentajeGrasaCorporal: number | null;
    tensionDiastolica: number | null;
    tensionSistolica: number | null;
    tensionArterialMedia: number | null;
    saturacion: number | null;
    circunferenciaAbdominal: number | null;
    circunferenciaCintura: number | null;
    perimetroCefalico: number | null;
    frecuenciaRespiratoria: number | null;
    frecuenciaCardiaca: number | null;
    temperatura: number | null;
  };
}

export const PreadmissionForm: React.FC<{
  initialValues: any;
  formId: string;
}> = ({ initialValues, formId }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PreadmissionFormInputs>({
    defaultValues: {
      weight: initialValues.weight || 0,
      height: initialValues.height || 0,
      glucose: initialValues.glucose || 0,
      imc: initialValues.imc || 0,
      extra_data: {
        porcentajeGrasaCorporal: initialValues.porcentajeGrasaCorporal || 0,
        tensionDiastolica: initialValues.tensionDiastolica || 0,
        tensionSistolica: initialValues.tensionSistolica || 0,
        tensionArterialMedia: initialValues.tensionArterialMedia || 0,
        saturacion: initialValues.saturacion || 0,
        circunferenciaAbdominal: initialValues.circunferenciaAbdominal || 0,
        circunferenciaCintura: initialValues.circunferenciaCintura || 0,
        perimetroCefalico: initialValues.perimetroCefalico || 0,
        frecuenciaRespiratoria: initialValues.frecuenciaRespiratoria || 0,
        frecuenciaCardiaca: initialValues.frecuenciaCardiaca || 0,
        temperatura: initialValues.temperatura || 0,
      },
    },
  });

  const { createExamRecipeResult } = useExamRecipeResultCreate();
  const { updateExamRecipeResult } = useExamRecipeResultUpdate();

  const paraclinicalFormRef = useRef<AddParaclinicalFormHandle>(null);

  const [showCard2, setShowCard2] = useState(false);
  const [showCard3, setShowCard3] = useState(false);
  const [showCard4, setShowCard4] = useState(false);
  const [showCard5, setShowCard5] = useState(false);
  const [showParaclinical, setShowParaclinical] = useState(false);

  // Watch weight and height to calculate IMC
  const weight = watch("weight");
  const height = watch("height");
  const tensionSistolica = watch("extra_data.tensionSistolica");
  const tensionDiastolica = watch("extra_data.tensionDiastolica");

  useEffect(() => {
    if (weight && height) {
      const alturaPulgadas = height * 0.393701;
      const imcCalculado = (weight / (alturaPulgadas * alturaPulgadas)) * 703;
      setValue("imc", parseFloat(imcCalculado.toFixed(2)));
    }
  }, [weight, height, setValue]);

  useEffect(() => {
    if (tensionSistolica && tensionDiastolica) {
      const tensionMedia =
        (Number(tensionSistolica) + 2 * Number(tensionDiastolica)) / 3;

      setValue(
        "extra_data.tensionArterialMedia",
        parseFloat(tensionMedia.toFixed(2))
      );
    }
  }, [tensionSistolica, tensionDiastolica, setValue]);

  const onSubmit = async (data: PreadmissionFormInputs) => {
    const requestData = {
      weight: data.weight,
      size: data.height,
      glycemia: data.glucose,
      patient_id: initialValues.patientId,
      appointment_id: initialValues.id,
      extra_data: data.extra_data,
    };

    let paraclinicalValid = await paraclinicalFormRef.current?.trigger();


    if (paraclinicalValid || !showParaclinical) {
      const paraclinicalData = paraclinicalFormRef.current?.getValues();

      try {
        await historyPreadmission.createHistoryPreadmission(requestData);

        if (paraclinicalData) {
          await submitParaclinicalData(paraclinicalData);
        }
         window.location.href = "gestioncitas";
      } catch (error) {
        console.error(error);
        SwalManager.error();
      }
    }
  };

  const submitParaclinicalData = async (data: ExamRecipeResultFormInputs) => {
    const currentUser = await userService.getLoggedUser();

    const finalData: any = {
      exam_recipe_id: data.exam_recipe_id,
      date: data.date?.toISOString().split("T")[0],
      comment: data.comment,
      uploaded_by_user_id: currentUser.id,
    };

    try {
      const res = await createExamRecipeResult(finalData);

      if (validFile("addParaclinicalFormFile", false)) {
        //@ts-ignore
        let minioUrl = await guardarResultadoRecetaExamen(
          "addParaclinicalFormFile",
          res.id
        );

        await updateExamRecipeResult(res.id, {
          result_minio_url: minioUrl,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLastHistory = async () => {
    try {
      const data = await historyPreadmission.getHistoryPatient(
        initialValues.patientId
      );
      if (data) {
        setValue("weight", data.weight || 0);
        setValue("height", data.size || 0);
        setValue("glucose", data.glycemia || 0);
        setValue("imc", data.imc || 0);
        setValue("extra_data", data.extra_data || {});

        if (data.weight && data.size) {
          const imcValue = data.weight / (data.size / 100) ** 2;
          setValue("imc", parseFloat(imcValue.toFixed(2)));
        }
      }
    } catch (error) {
      console.error("Error fetching last history:", error);
    }
  };

  useEffect(() => {
    fetchLastHistory();
  }, []);

  const getFormErrorMessage = (name: keyof PreadmissionFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="p-grid">
        {/* Campos de Preadmisión */}
        <div className="p-col-12">
          {/* Card 1 */}
          <div className="mb-3">
            <label htmlFor="weight" className="form-label">
              Peso (lb)
            </label>
            <Controller
              name="weight"
              control={control}
              rules={{
                required: "El peso es requerido",
                min: { value: 0, message: "El peso debe ser positivo" },
              }}
              render={({ field, fieldState }) => (
                <InputNumber
                  id="weight"
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e)}
                  mode="decimal"
                  min={0}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
              )}
            />
            {getFormErrorMessage("weight")}
          </div>

          <div className="mb-3">
            <label htmlFor="height" className="form-label">
              Talla (cm)
            </label>
            <Controller
              name="height"
              control={control}
              rules={{
                required: "La talla es requerida",
                min: { value: 0, message: "La talla debe ser positiva" },
              }}
              render={({ field, fieldState }) => (
                <InputNumber
                  id="height"
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e)}
                  mode="decimal"
                  min={0}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
              )}
            />
            {getFormErrorMessage("height")}
          </div>

          <div className="mb-3">
            <label htmlFor="imc" className="form-label">
              IMC (kg/m²)
            </label>
            <Controller
              name="imc"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="imc"
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e)}
                  readOnly
                  inputClassName="readonly-input"
                />
              )}
            />
          </div>

          <div className="p-col-12 lg:p-col-4 mb-3">
            <Controller
              name="extra_data.porcentajeGrasaCorporal"
              control={control}
              render={({ field }) => (
                <>
                  <label className="form-label">% Grasa Corporal</label>
                  <InputNumber
                    inputId={field.name}
                    ref={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={(e) => field.onChange(e)}
                    min={0}
                    max={100}
                    suffix="%"
                    className="w-100"
                  />
                </>
              )}
            />
          </div>

          <Controller
            name="glucose"
            control={control}
            rules={{
              required: "La glucosa es requerida",
              min: { value: 0, message: "La glucosa debe ser positiva" },
            }}
            render={({ field, fieldState }) => (
              <div className="mb-3">
                <label className="form-label">Glucemia (mg/dL)</label>
                <InputNumber
                  inputId={field.name}
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onValueChange={(e) => field.onChange(e)}
                  mode="decimal"
                  min={0}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
                {fieldState.error && (
                  <small className="p-error">{fieldState.error.message}</small>
                )}
              </div>
            )}
          />

          {/* Switch y Card 2 - Presión Arterial */}
          <div className="p-col-12">
            <div className="d-flex align-items-center mb-3 gap-3">
              <InputSwitch
                inputId="showCard2"
                checked={showCard2}
                onChange={(e) => setShowCard2(e.value)}
                className="mr-2"
              />
              <label htmlFor="showCard2" className="font-bold">
                Presión Arterial
              </label>
            </div>

            {showCard2 && (
              <div className="card p-4 mb-4">
                <div className="p-grid">
                  <div className="p-col-12 lg:p-col-4">
                    <Controller
                      name="extra_data.tensionSistolica"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Presión Sistólica [mmHg]
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            className="w-100"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="extra_data.tensionDiastolica"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Presión Diastólica [mmHg]
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            className="w-100"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="extra_data.tensionArterialMedia"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Tensión Arterial Media
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            readOnly
                            className="w-100"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="extra_data.saturacion"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Saturación Oxígeno [%]
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            max={100}
                            suffix="%"
                            className="w-100"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Switch y Card 3 - Medidas Corporales */}
          <div className="p-col-12">
            <div className="d-flex align-items-center mb-3 gap-3">
              <InputSwitch
                inputId="showCard3"
                checked={showCard3}
                onChange={(e) => setShowCard3(e.value)}
                className="mr-2"
              />
              <label htmlFor="showCard3" className="font-bold">
                Medidas Corporales
              </label>
            </div>

            {showCard3 && (
              <div className="card p-4 mb-4">
                <div className="p-grid">
                  <div className="p-col-12 lg:p-col-4">
                    <Controller
                      name="extra_data.circunferenciaAbdominal"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Circunferencia Abdominal [cm]
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            className="w-100"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="extra_data.circunferenciaCintura"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Circunferencia de Cintura [cm]
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            className="w-100"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="extra_data.perimetroCefalico"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Perímetro Cefálico [cm]
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            className="w-100"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Switch y Card 4 - Signos Vitales */}
          <div className="p-col-12">
            <div className="d-flex align-items-center mb-3 gap-3">
              <InputSwitch
                inputId="showCard4"
                checked={showCard4}
                onChange={(e) => setShowCard4(e.value)}
                className="mr-2"
              />
              <label htmlFor="showCard4" className="font-bold">
                Signos Vitales
              </label>
            </div>

            {showCard4 && (
              <div className="card p-4 mb-4">
                <div className="p-grid">
                  <div className="p-col-12 lg:p-col-4">
                    <Controller
                      name="extra_data.frecuenciaRespiratoria"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Frecuencia Respiratoria [rpm]
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            className="w-100"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="extra_data.frecuenciaCardiaca"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">
                            Frecuencia Cardíaca [lpm]
                          </label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            className="w-100"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="extra_data.temperatura"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-3">
                          <label className="form-label">Temperatura [°C]</label>
                          <InputNumber
                            inputId={field.name}
                            ref={field.ref}
                            value={field.value}
                            onBlur={field.onBlur}
                            onValueChange={(e) => field.onChange(e)}
                            min={0}
                            max={45}
                            className="w-100"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Switch y Formulario Paraclínico */}
          <div className="p-col-12">
            <div className="d-flex align-items-center mb-3 gap-3">
              <InputSwitch
                inputId="showParaclinical"
                checked={showParaclinical}
                onChange={(e) => setShowParaclinical(e.value)}
                className="mr-2"
              />
              <label htmlFor="showParaclinical" className="font-bold">
                Cargar resultado exámenes
              </label>
            </div>

            {showParaclinical && (
              <div className="card p-4 mb-4">
                <AddParaclinicalForm
                  ref={paraclinicalFormRef}
                  patientId={initialValues.patientId}
                  formId={"paraclinical-form"}
                  onHandleSubmit={() => { }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
