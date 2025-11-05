function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card } from "primereact/card";
import { Controller, useForm } from "react-hook-form";
import { CashRegisterPaymentMethodsForm } from "./CashRegisterPaymentMethodsForm.js";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { CashRegisterPaymentProductsDetail } from "./CashRegisterPaymentProductsDetail.js";
import { CashRegisterProductHelper } from "./helpers/CashRegisterProductHelper.js";
import { Button } from "primereact/button";
import { ThirdPartyModal } from "../billing/third-parties/modals/ThridPartiesModal.js";
import { useThirdPartyCreate } from "../billing/third-parties/hooks/useThirdPartyCreate.js";
import { useSearchThirdParties } from "../billing/third-parties/hooks/useSearchThirdParties.js";
export const CashRegisterPaymentForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    products
  } = props;
  const total = CashRegisterProductHelper.calculateTotal(products);
  const {
    searchThirdParties,
    thirdParties
  } = useSearchThirdParties();
  const {
    createThirdParty
  } = useThirdPartyCreate();
  const {
    control,
    setValue,
    formState: {
      errors
    },
    trigger,
    getValues
  } = useForm({
    defaultValues: {
      client: null,
      payments: []
    }
  });
  const cashRegisterPaymentMethodsFormRef = React.useRef(null);
  const [showThirdPartyModal, setShowThirdPartyModal] = useState(false);
  const handlePaymentsChange = payments => {
    setValue("payments", payments);
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const handleSaveThirdParty = async formData => {
    try {
      await createThirdParty({
        name: formData.contact.name,
        type: formData.type,
        document_type: formData.contact.document_type,
        document_number: formData.contact.document_number,
        email: formData.contact.email,
        phone: formData.contact.phone,
        address: formData.contact.address,
        first_name: formData.contact.first_name,
        middle_name: formData.contact.middle_name,
        last_name: formData.contact.last_name,
        second_last_name: formData.contact.second_last_name,
        date_of_birth: formData.contact.date_of_birth
      });
      setShowThirdPartyModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  useImperativeHandle(ref, () => ({
    submit: async () => {
      if (!cashRegisterPaymentMethodsFormRef.current) {
        return {
          isValid: false,
          getValues: getValues()
        };
      }
      const cashRegisterPaymentMethodsFormResult = await cashRegisterPaymentMethodsFormRef.current?.submit();
      const isValid = await trigger();
      return {
        isValid: cashRegisterPaymentMethodsFormResult.isValid && isValid,
        getValues: getValues()
      };
    }
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-shopping-cart mr-2"
    }), " Lista de Productos"),
    className: "mb-4 shadow-3"
  }, /*#__PURE__*/React.createElement(CashRegisterPaymentProductsDetail, {
    products: products
  })), /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-credit-card mr-2"
    }), " M\xE9todos de Pago"),
    className: "mb-4 shadow-3"
  }, /*#__PURE__*/React.createElement(CashRegisterPaymentMethodsForm, {
    ref: cashRegisterPaymentMethodsFormRef,
    total: total,
    onPaymentsChange: handlePaymentsChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "client",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Cliente *"), /*#__PURE__*/React.createElement("div", {
      className: "d-flex w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-grow-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid row p-fluid w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement(AutoComplete, _extends({
      inputId: field.name,
      placeholder: "Seleccione un cliente",
      field: "label",
      suggestions: thirdParties,
      completeMethod: e => searchThirdParties(e.query, "client"),
      virtualScrollerOptions: {
        itemSize: 38
      },
      inputClassName: "w-100",
      panelClassName: "w-100",
      className: classNames("w-100", {
        "p-invalid": errors.client
      }),
      appendTo: "self"
    }, field))))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "button",
      className: "p-button-primary",
      size: "small",
      onClick: () => setShowThirdPartyModal(true),
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-plus"
      })
    }))))
  }), getFormErrorMessage("client"))), /*#__PURE__*/React.createElement(ThirdPartyModal, {
    visible: showThirdPartyModal,
    onHide: () => setShowThirdPartyModal(false),
    onSubmit: handleSaveThirdParty
  }));
});