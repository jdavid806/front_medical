function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
export const OptometryPrescriptionForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    initialData
  } = props;
  const {
    control,
    handleSubmit,
    getValues
  } = useForm({
    defaultValues: initialData
  });
  const getFormData = () => {
    const data = {
      visionSencilla: getValues("visionSencilla"),
      visionSencillaV: getValues("visionSencillaV"),
      bifocalFLTTOP: getValues("bifocalFLTTOP"),
      bifocalFLTTOPH: getValues("bifocalFLTTOPH"),
      bifocalInvisible: getValues("bifocalInvisible"),
      bifocalInvisibleD: getValues("bifocalInvisibleD"),
      progresivo: getValues("progresivo"),
      progresivoP: getValues("progresivoP"),
      tratamiento: getValues("tratamiento"),
      montura: getValues("montura")
    };
    const camposQueratometria = ["queratometriaOjoDerecho", "esferaOjoDerecho", "cilindroOjoDerecho", "ejeOjoDerecho", "adicionOjoDerecho", "alturaOjoDerecho", "dpOjoDerecho", "queratometriaOjoIzquierdo", "esferaOjoIzquierdo", "cilindroOjoIzquierdo", "ejeOjoIzquierdo", "adicionOjoIzquierdo", "alturaOjoIzquierdo", "dpOjoIzquierdo"];
    camposQueratometria.forEach(campo => {
      const value = document.getElementById(campo)?.value;
      if (value) {
        data[campo] = value;
      }
    });
    return data;
  };
  useImperativeHandle(ref, () => ({
    getFormData
  }));
  return /*#__PURE__*/React.createElement("form", {
    id: "formRecetaOptometria"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-3"
  }, "Cristal recomendado"), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "visionSencilla",
    className: "form-label"
  }, "Visi\xF3n sencilla"), /*#__PURE__*/React.createElement(Controller, {
    name: "visionSencilla",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "visionSencilla"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "visionSencillaV",
    className: "form-label"
  }, "V"), /*#__PURE__*/React.createElement(Controller, {
    name: "visionSencillaV",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "visionSencillaV"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bifocalFLTTOP",
    className: "form-label"
  }, "Bifocal FLTTOP"), /*#__PURE__*/React.createElement(Controller, {
    name: "bifocalFLTTOP",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "bifocalFLTTOP"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bifocalFLTTOPH",
    className: "form-label"
  }, "H"), /*#__PURE__*/React.createElement(Controller, {
    name: "bifocalFLTTOPH",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "bifocalFLTTOPH"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bifocalInvisible",
    className: "form-label"
  }, "Bifocal Invisible"), /*#__PURE__*/React.createElement(Controller, {
    name: "bifocalInvisible",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "bifocalInvisible"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bifocalInvisibleD",
    className: "form-label"
  }, "D"), /*#__PURE__*/React.createElement(Controller, {
    name: "bifocalInvisibleD",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "bifocalInvisibleD"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "progresivo",
    className: "form-label"
  }, "Progresivo"), /*#__PURE__*/React.createElement(Controller, {
    name: "progresivo",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "progresivo"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "progresivoP",
    className: "form-label"
  }, "P"), /*#__PURE__*/React.createElement(Controller, {
    name: "progresivoP",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "progresivoP"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tratamiento",
    className: "form-label"
  }, "Tratamiento"), /*#__PURE__*/React.createElement(Controller, {
    name: "tratamiento",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "tratamiento"
    }, field, {
      className: "w-100",
      autoResize: true,
      rows: 3
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 d-flex flex-column gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "montura",
    className: "form-label"
  }, "Montura"), /*#__PURE__*/React.createElement(Controller, {
    name: "montura",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "montura"
    }, field, {
      className: "w-100",
      autoResize: true,
      rows: 3
    }))
  })))));
});