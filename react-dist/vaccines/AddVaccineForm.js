function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import React, { forwardRef, useImperativeHandle } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useVaccines } from "./hooks/useVaccines.js";
import { Button } from "primereact/button";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { InputNumber } from "primereact/inputnumber";
export const AddVaccineForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    initialData
  } = props;
  const {
    control,
    resetField
  } = useForm({
    defaultValues: initialData || {
      fromInventory: false,
      vaccinesFromInventory: [],
      vaccineFromInventory: null,
      vaccineName: null
    }
  });
  const {
    append: appendVaccine,
    remove: removeVaccine,
    update: updateVaccine
  } = useFieldArray({
    control,
    name: "vaccinesFromInventory"
  });
  const {
    vaccines
  } = useVaccines();
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return {
        fromInventory,
        vaccineFromInventory,
        vaccinesFromInventory,
        vaccineName
      };
    }
  }));
  const fromInventory = useWatch({
    control,
    name: "fromInventory"
  });
  const vaccineFromInventory = useWatch({
    control,
    name: "vaccineFromInventory"
  });
  const vaccinesFromInventory = useWatch({
    control,
    name: "vaccinesFromInventory"
  });
  const vaccineName = useWatch({
    control,
    name: "vaccineName"
  });
  const handleRemoveVaccine = event => {
    removeVaccine(event.index);
  };
  const handleUpdateVaccine = (index, data) => {
    updateVaccine(index, data);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "fromInventory",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(InputSwitch, {
      checked: field.value,
      id: "fromInventory",
      name: "fromInventory",
      onChange: e => field.onChange(e.value)
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "fromInventory"
    }, "Traer vacunas desde el inventario"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1"
  }, fromInventory && /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-100"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "vaccineFromInventory",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "w-100 d-flex flex-column gap-2"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "vaccineFromInventory",
      className: "form-label"
    }, "Vacuna"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      options: vaccines,
      optionLabel: "label",
      className: "w-100",
      inputId: "vaccineFromInventory",
      placeholder: "Seleccione una vacuna",
      filter: true,
      showClear: true,
      emptyMessage: "No se encontraron vacunas"
    }, field)))
  })), !fromInventory && /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-100"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "vaccineName",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "w-100 d-flex flex-column gap-2"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "vaccineName",
      className: "form-label"
    }, "Nombre de la vacuna"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: "vaccineName"
    }, field, {
      className: "w-100",
      placeholder: "Nombre de la vacuna"
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus"
    }),
    disabled: fromInventory && !vaccineFromInventory || !fromInventory && !vaccineName,
    onClick: () => {
      if (fromInventory) {
        console.log(vaccineFromInventory);
        appendVaccine({
          uuid: Math.random().toString(36).substring(7),
          name: vaccineFromInventory.label,
          dose: 1,
          scheme: "",
          booster: ""
        });
      } else if (vaccineName) {
        appendVaccine({
          uuid: Math.random().toString(36).substring(7),
          name: vaccineName,
          dose: 1,
          scheme: "",
          booster: ""
        });
      }
      resetField("vaccineFromInventory");
      resetField("vaccineName");
    }
  }))), /*#__PURE__*/React.createElement(VaccinesTable, {
    vaccinesFromInventory: vaccinesFromInventory,
    onRemove: handleRemoveVaccine,
    updateVaccine: handleUpdateVaccine
  }));
});
export const VaccinesTable = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    vaccinesFromInventory,
    onRemove,
    updateVaccine
  } = props;
  const columns = [{
    field: "name",
    header: "Nombre",
    width: "200px"
  }, {
    field: "dose",
    header: "Dosis",
    width: "200px",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.dose,
      onChange: e => updateVaccine(vaccinesFromInventory.indexOf(rowData), {
        ...rowData,
        dose: e.value
      }, "dose", e.value),
      mode: "decimal",
      showButtons: true,
      incrementButtonClassName: "btn-primary",
      decrementButtonClassName: "btn-primary",
      incrementButtonIcon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-plus"
      }),
      decrementButtonIcon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-minus"
      }),
      inputMode: "numeric",
      min: 0,
      max: 999,
      className: "w-100",
      inputClassName: "w-100"
    }))
  }, {
    field: "scheme",
    header: "Esquema",
    width: "200px",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, {
      value: rowData.scheme,
      onChange: e => updateVaccine(vaccinesFromInventory.indexOf(rowData), {
        ...rowData,
        scheme: e.target.value
      }, "scheme", e.target.value),
      className: "w-100"
    }))
  }, {
    field: "booster",
    header: "Refuerzo",
    width: "200px",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, {
      value: rowData.booster,
      onChange: e => updateVaccine(vaccinesFromInventory.indexOf(rowData), {
        ...rowData,
        booster: e.target.value
      }, "booster", e.target.value),
      className: "w-100"
    }))
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-trash"
      }),
      rounded: true,
      text: true,
      severity: "danger",
      onClick: () => onRemove({
        data: rowData,
        index: vaccinesFromInventory.indexOf(rowData)
      })
    })
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: vaccinesFromInventory,
    disableReload: true,
    disableSearch: true,
    columns: columns
  }));
});