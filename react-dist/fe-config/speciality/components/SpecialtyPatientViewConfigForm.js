function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from "react";
import { Controller, useForm, useWatch } from 'react-hook-form';
import { classNames } from "primereact/utils";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import { PreviewSpecialtyPatientViewCards } from "./PreviewSpecialtyPatientViewCards.js";
import { useLoggedUser } from "../../../users/hooks/useLoggedUser.js";
export const SpecialtyPatientViewConfigForm = props => {
  const {
    specialty,
    formId
  } = props;
  const {
    loggedUser
  } = useLoggedUser();
  const {
    handleSubmit,
    control,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      visible_cards: []
    }
  });
  const [showPreview, setShowPreview] = useState(false);
  const onSubmit = data => {
    console.log(data);
  };
  const visibleCards = useWatch({
    name: "visible_cards",
    control: control
  });
  const getFormErrorMessage = name => {
    return errors[name] && errors[name].type !== "required" && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const cards = [{
    value: 'consulta',
    label: "Consultas medicas"
  }, {
    value: 'citas',
    label: "Citas"
  }, {
    value: 'llamar-paciente',
    label: "Llamar al paciente"
  }, {
    value: 'ordenes-medicas',
    label: "Ordenes médicas"
  }, {
    value: 'ordenes-laboratorio',
    label: "Laboratorio"
  }, {
    value: 'recetas',
    label: "Recetas médicas"
  }, {
    value: 'recetas-optometria',
    label: "Recetas Optometría"
  }, {
    value: 'incapacidades',
    label: "Incapacidades clínicas"
  }, {
    value: 'antecedentes',
    label: "Antecedentes personales"
  }, {
    value: 'consentimientos',
    label: "Consentimientos"
  }, {
    value: 'presupuestos',
    label: "Presupuestos"
  }, {
    value: 'esquema-vacunacion',
    label: "Esquema de vacunación"
  }, {
    value: 'notas-enfermeria',
    label: "Notas de Enfermeria"
  }, {
    value: 'evoluciones',
    label: "Evoluciones"
  }, {
    value: 'remisiones',
    label: "Remisiones"
  }, {
    value: 'preadmisiones',
    label: "Preadmisiones"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column w-100"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "visible_cards",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Cards visibles *"), /*#__PURE__*/React.createElement(MultiSelect, _extends({
      inputId: field.name,
      options: cards,
      optionLabel: "label",
      filter: true,
      showClear: true,
      maxSelectedLabels: 2,
      placeholder: "Seleccione uno o m\xE1s items",
      className: classNames("w-100", {
        "p-invalid": errors.visible_cards
      }),
      appendTo: document.body
    }, field)), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Seleccione las cards que estar\xE1n visibles en la vista del paciente"))
  }), getFormErrorMessage("visible_cards"))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary me-2",
    onClick: () => setShowPreview(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-eye"
  }), " Previsualizar"))))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Previsualizaci\xF3n de cards",
    visible: showPreview,
    onHide: () => setShowPreview(false),
    style: {
      width: "80vw"
    }
  }, /*#__PURE__*/React.createElement(PreviewSpecialtyPatientViewCards, {
    disableRedirects: true,
    availableCardsIds: visibleCards,
    userId: loggedUser?.id
  })));
};