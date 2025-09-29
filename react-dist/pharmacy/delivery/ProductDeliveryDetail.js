import React, { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { formatDateDMY } from "../../../services/utilidades.js";
import { useProductDelivery } from "./hooks/useProductDelivery.js";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager.js";
import "../../extensions/number.extensions.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useLoggedUser } from "../../users/hooks/useLoggedUser.js";
import { Button } from "primereact/button";
import { ProductDeliveryDetailDialog } from "./ProductDeliveryDetailDialog.js";
import { useProductDeliveryDetailFormat } from "../../documents-generation/hooks/useProductDeliveryDetailFormat.js";
import { useVerifyAndSaveProductDelivery } from "./hooks/useVerifyAndSaveProductDelivery.js";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useInvoicePurchase } from "../../billing/purchase_billing/hooks/usePurchaseBilling.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const ProductDeliveryDetail = ({
  deliveryId
}) => {
  const {
    delivery,
    getDelivery
  } = useProductDelivery();
  const {
    loggedUser
  } = useLoggedUser();
  const {
    generateFormat
  } = useProductDeliveryDetailFormat();
  const {
    verifyAndSaveProductDelivery
  } = useVerifyAndSaveProductDelivery();
  const {
    control,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      productsDeposits: []
    }
  });
  const {
    fields,
    append: appendProductDeposit,
    remove: removeProductDeposit,
    update: updateProductDeposit
  } = useFieldArray({
    control,
    name: "productsDeposits",
    rules: {
      required: true,
      validate: value => {
        if (value.length === 0) {
          return "Debe seleccionar al menos un deposito";
        }
        if (value.some(productDeposit => productDeposit.deposit_id === null)) {
          return "Debe seleccionar un deposito para cada insumo";
        }
        return true;
      }
    }
  });
  const productsDeposits = useWatch({
    control,
    name: "productsDeposits"
  });
  const [deliveryManager, setDeliveryManager] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  useEffect(() => {
    getDelivery(deliveryId);
  }, [deliveryId]);
  useEffect(() => {
    if (delivery) {
      setDeliveryManager(new MedicalSupplyManager(delivery));
    }
  }, [delivery]);
  useEffect(() => {
    setValue("productsDeposits", []);
    if (deliveryManager && deliveryManager.products.length > 0) {
      appendProductDeposit(deliveryManager.products.map(product => ({
        product_id: product.product.id,
        product_name: product.product.name,
        quantity: product.quantity,
        deposit_id: null
      })));
    }
  }, [deliveryManager]);
  const handlePrint = () => {
    if (!delivery || !deliveryManager) return;
    generateFormat({
      delivery: delivery,
      deliveryManager: deliveryManager,
      type: 'Impresion'
    });
  };
  const handleVerifyAndSaveProductDelivery = async data => {
    if (!delivery || !deliveryManager) return;
    const productsDepositsFormated = data.productsDeposits.reduce((obj, product) => {
      obj[product.product_id] = product.deposit_id;
      return obj;
    }, {});
    try {
      const response = await verifyAndSaveProductDelivery(delivery.id.toString(), {
        productsDeposits: productsDepositsFormated
      });
      if (response) {
        const apiMessage = response.data?.original?.message || "Entrega validada exitosamente";
        SwalManager.success({
          title: 'Entrega validada',
          text: apiMessage
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message || errors[name].root?.message);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(handleVerifyAndSaveProductDelivery)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Solicitud #", delivery?.id), /*#__PURE__*/React.createElement(Tag, {
    value: deliveryManager?.statusLabel,
    severity: deliveryManager?.statusSeverity,
    className: "fs-6"
  })), /*#__PURE__*/React.createElement("p", null, "Creado: ", formatDateDMY(delivery?.created_at)), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-title"
  }, "Informaci\xF3n del solicitante"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Nombre: "), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.name || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Correo electr\xF3nico: "), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.email || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Tel\xE9fono: "), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.phone || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Direcci\xF3n: "), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.address || '--'))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-title"
  }, "Gestionado por"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Nombre: "), /*#__PURE__*/React.createElement("span", null, `${loggedUser?.first_name || ''} ${loggedUser?.middle_name || ''} ${loggedUser?.last_name || ''} ${loggedUser?.second_last_name || ''}`)), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Correo electr\xF3nico: "), /*#__PURE__*/React.createElement("span", null, loggedUser?.email)), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Tel\xE9fono: "), /*#__PURE__*/React.createElement("span", null, loggedUser?.phone)), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Direcci\xF3n: "), /*#__PURE__*/React.createElement("span", null, loggedUser?.address)))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    data: productsDeposits,
    columns: [{
      field: 'product_name',
      header: 'Insumos'
    }, {
      field: 'quantity',
      header: 'Cantidad'
    }, {
      field: 'deposit.name',
      header: 'Depósito',
      body: deposit => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SupplyDeliveryDepositColumn, {
        productsDeposits: productsDeposits,
        deposit: deposit,
        onUpdateProductDeposit: (index, deposit) => updateProductDeposit(index, deposit)
      }))
    }],
    disablePaginator: true,
    disableReload: true,
    disableSearch: true
  }), getFormErrorMessage("productsDeposits"), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-prescription text-primary me-2 fs-4"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fw-medium"
  }, "Solicitud #", delivery?.id), /*#__PURE__*/React.createElement("div", {
    className: "text-muted small"
  }, deliveryManager?.requestedBy?.name || '--', " - ", formatDateDMY(delivery?.created_at)))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-outline-primary me-2",
    onClick: () => setDialogVisible(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye me-1"
  }), " Ver solicitud"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-outline-secondary",
    onClick: handlePrint
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-print me-1"
  }), " Imprimir")))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check me-2"
    }),
    label: "Entregar Productos",
    className: "btn btn-sm btn-primary",
    type: "submit"
  }))), /*#__PURE__*/React.createElement(ProductDeliveryDetailDialog, {
    visible: dialogVisible,
    onHide: () => setDialogVisible(false),
    delivery: delivery
  })));
};
const SupplyDeliveryDepositColumn = props => {
  const {
    productsDeposits,
    deposit,
    onUpdateProductDeposit
  } = props;
  const {
    getAllDeposits
  } = useInvoicePurchase();
  const [formattedDeposits, setFormattedDeposits] = useState([]);
  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const depositsData = await getAllDeposits();
        console.log("depositsData", depositsData);
        const formatted = depositsData.map(deposit => ({
          id: deposit.id,
          name: deposit.attributes.name,
          originalData: deposit
        }));
        setFormattedDeposits(formatted);
      } catch (error) {
        console.error("Error loading deposits:", error);
      }
    };
    loadDeposits();
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", null, "Dep\xF3sito"), /*#__PURE__*/React.createElement(Dropdown, {
    value: deposit.deposit_id,
    options: formattedDeposits,
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Seleccione dep\xF3sito",
    className: "w-100",
    onChange: e => {
      onUpdateProductDeposit(productsDeposits.indexOf(deposit) || 0, {
        ...deposit,
        deposit_id: e.value
      });
    }
  }));
};