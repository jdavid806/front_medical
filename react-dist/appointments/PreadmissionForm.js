import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { historyPreadmission, userService } from "../../services/api/index.js";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { AddParaclinicalForm } from "../clinical-records/AddParaclinicalForm.js";
import { validFile } from "../../services/utilidades.js";
import { useExamRecipeResultCreate } from "../exam-recipe-results/hooks/useExamRecipeResultCreate.js";
import { useExamRecipeResultUpdate } from "../exam-recipe-results/hooks/useExamRecipeResultUpdate.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { InputSwitch } from "primereact/inputswitch";
export const PreadmissionForm = ({
  initialValues,
  formId
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm({
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
        temperatura: initialValues.temperatura || 0
      }
    }
  });
  const {
    createExamRecipeResult
  } = useExamRecipeResultCreate();
  const {
    updateExamRecipeResult
  } = useExamRecipeResultUpdate();
  const paraclinicalFormRef = useRef(null);
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
      const imcCalculado = weight / (alturaPulgadas * alturaPulgadas) * 703;
      setValue("imc", parseFloat(imcCalculado.toFixed(2)));
    }
  }, [weight, height, setValue]);
  useEffect(() => {
    if (tensionSistolica && tensionDiastolica) {
      const tensionMedia = (Number(tensionSistolica) + 2 * Number(tensionDiastolica)) / 3;
      setValue("extra_data.tensionArterialMedia", parseFloat(tensionMedia.toFixed(2)));
    }
  }, [tensionSistolica, tensionDiastolica, setValue]);
  const onSubmit = async data => {
    const requestData = {
      weight: data.weight,
      size: data.height,
      glycemia: data.glucose,
      patient_id: initialValues.patientId,
      appointment_id: initialValues.id,
      extra_data: data.extra_data
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
  const submitParaclinicalData = async data => {
    const currentUser = await userService.getLoggedUser();
    const finalData = {
      exam_recipe_id: data.exam_recipe_id,
      date: data.date?.toISOString().split("T")[0],
      comment: data.comment,
      uploaded_by_user_id: currentUser.id
    };
    try {
      const res = await createExamRecipeResult(finalData);
      if (validFile("addParaclinicalFormFile", false)) {
        //@ts-ignore
        let minioUrl = await guardarResultadoRecetaExamen("addParaclinicalFormFile", res.id);
        await updateExamRecipeResult(res.id, {
          result_minio_url: minioUrl
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLastHistory = async () => {
    try {
      const data = await historyPreadmission.getHistoryPatient(initialValues.patientId);
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
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "weight",
    className: "form-label"
  }, "Peso (lb)"), /*#__PURE__*/React.createElement(Controller, {
    name: "weight",
    control: control,
    rules: {
      required: "El peso es requerido",
      min: {
        value: 0,
        message: "El peso debe ser positivo"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: "weight",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      mode: "decimal",
      min: 0,
      className: classNames({
        "p-invalid": fieldState.error
      })
    })
  }), getFormErrorMessage("weight")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "height",
    className: "form-label"
  }, "Talla (cm)"), /*#__PURE__*/React.createElement(Controller, {
    name: "height",
    control: control,
    rules: {
      required: "La talla es requerida",
      min: {
        value: 0,
        message: "La talla debe ser positiva"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: "height",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      mode: "decimal",
      min: 0,
      className: classNames({
        "p-invalid": fieldState.error
      })
    })
  }), getFormErrorMessage("height")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "imc",
    className: "form-label"
  }, "IMC (kg/m\xB2)"), /*#__PURE__*/React.createElement(Controller, {
    name: "imc",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: "imc",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      readOnly: true,
      inputClassName: "readonly-input"
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-col-12 lg:p-col-4 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.porcentajeGrasaCorporal",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "% Grasa Corporal"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      max: 100,
      suffix: "%",
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement(Controller, {
    name: "glucose",
    control: control,
    rules: {
      required: "La glucosa es requerida",
      min: {
        value: 0,
        message: "La glucosa debe ser positiva"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Glucemia (mg/dL)"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      mode: "decimal",
      min: 0,
      className: classNames({
        "p-invalid": fieldState.error
      })
    }), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  }), /*#__PURE__*/React.createElement("div", {
    className: "p-col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3 gap-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    inputId: "showCard2",
    checked: showCard2,
    onChange: e => setShowCard2(e.value),
    className: "mr-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "showCard2",
    className: "font-bold"
  }, "Presi\xF3n Arterial")), showCard2 && /*#__PURE__*/React.createElement("div", {
    className: "card p-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-col-12 lg:p-col-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.tensionSistolica",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Presi\xF3n Sist\xF3lica [mmHg]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      className: "w-100"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.tensionDiastolica",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Presi\xF3n Diast\xF3lica [mmHg]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      className: "w-100"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.tensionArterialMedia",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Tensi\xF3n Arterial Media"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      readOnly: true,
      className: "w-100"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.saturacion",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Saturaci\xF3n Ox\xEDgeno [%]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      max: 100,
      suffix: "%",
      className: "w-100"
    }))
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "p-col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3 gap-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    inputId: "showCard3",
    checked: showCard3,
    onChange: e => setShowCard3(e.value),
    className: "mr-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "showCard3",
    className: "font-bold"
  }, "Medidas Corporales")), showCard3 && /*#__PURE__*/React.createElement("div", {
    className: "card p-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-col-12 lg:p-col-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.circunferenciaAbdominal",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Circunferencia Abdominal [cm]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      className: "w-100"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.circunferenciaCintura",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Circunferencia de Cintura [cm]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      className: "w-100"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.perimetroCefalico",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Per\xEDmetro Cef\xE1lico [cm]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      className: "w-100"
    }))
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "p-col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3 gap-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    inputId: "showCard4",
    checked: showCard4,
    onChange: e => setShowCard4(e.value),
    className: "mr-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "showCard4",
    className: "font-bold"
  }, "Signos Vitales")), showCard4 && /*#__PURE__*/React.createElement("div", {
    className: "card p-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-col-12 lg:p-col-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.frecuenciaRespiratoria",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Frecuencia Respiratoria [rpm]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      className: "w-100"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.frecuenciaCardiaca",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Frecuencia Card\xEDaca [lpm]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      className: "w-100"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "extra_data.temperatura",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Temperatura [\xB0C]"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      min: 0,
      max: 45,
      className: "w-100"
    }))
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "p-col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3 gap-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    inputId: "showParaclinical",
    checked: showParaclinical,
    onChange: e => setShowParaclinical(e.value),
    className: "mr-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "showParaclinical",
    className: "font-bold"
  }, "Cargar resultado ex\xE1menes")), showParaclinical && /*#__PURE__*/React.createElement("div", {
    className: "card p-4 mb-4"
  }, /*#__PURE__*/React.createElement(AddParaclinicalForm, {
    ref: paraclinicalFormRef,
    patientId: initialValues.patientId,
    formId: "paraclinical-form",
    onHandleSubmit: () => {}
  }))))));
};