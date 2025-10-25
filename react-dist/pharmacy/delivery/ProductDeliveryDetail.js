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
import { Dialog } from "primereact/dialog";
import { OTPModal } from "../../login/modal/OTPModal.js";
import { useAuth } from "../../login/hooks/useAuth.js";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
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
    verifyOtp,
    verifyOtpBasic,
    resendOtp,
    sendOtp,
    Toast: toastRef
  } = useAuth();
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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
        quantity: product.pending_quantity,
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
    setShowVerifyDialog(true);
    if (!deliveryManager.requestedBy?.external_id) return;
    await sendOtp(deliveryManager.requestedBy?.external_id);
  };
  const handleUserVerificationSuccess = async () => {
    setShowVerifyDialog(false);
    const data = getValues();
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
      getDelivery(deliveryId);
    } catch (error) {
      console.error(error);
    }
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message || errors[name].root?.message);
  };
  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6 && deliveryManager?.requestedBy?.email) {
      const result = await verifyOtpBasic(otpCode, deliveryManager?.requestedBy?.email, deliveryManager?.requestedBy?.phone);
      if (result.status === 200) {
        console.log("OTP verificado exitosamente");
        setOtp(['', '', '', '', '', '']); // Reset OTP
        handleUserVerificationSuccess();
      }
    }
  };
  const handleResendOtp = async () => {
    await resendOtp(deliveryManager?.requestedBy?.email);
  };
  const delivered = () => {
    return ["entregado"].includes(delivery?.status || '');
  };
  const hasProductDeliveries = () => {
    return delivery?.products?.some(product => product.delivery_details?.length > 0);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toastRef
  }), /*#__PURE__*/React.createElement("form", {
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
  }, /*#__PURE__*/React.createElement("strong", null, "Direcci\xF3n: "), /*#__PURE__*/React.createElement("span", null, loggedUser?.address)))))), hasProductDeliveries() && /*#__PURE__*/React.createElement(DeliveryDetailsTable, {
    data: delivery?.products
  }), !delivered() && /*#__PURE__*/React.createElement(CustomPRTable, {
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
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-grow-1"
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
  }), " Imprimir"))), delivered() && /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted small"
  }, "Observaciones: ", delivery?.observations || '--')))))), !delivered() && /*#__PURE__*/React.createElement("div", {
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
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: showVerifyDialog,
    onHide: () => setShowVerifyDialog(false),
    header: "Verificaci\xF3n de usuario",
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: "pi pi-times",
      className: "btn btn-sm btn-outline-secondary me-2",
      onClick: () => setShowVerifyDialog(false)
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Verificar",
      icon: "pi pi-check",
      className: "btn btn-sm btn-primary",
      onClick: handleVerifyOtp
    }))
  }, deliveryManager?.requestedBy?.email && deliveryManager?.requestedBy?.phone && /*#__PURE__*/React.createElement(OTPModal, {
    otp: otp,
    setOtp: setOtp,
    onResendOTP: handleResendOtp,
    email: deliveryManager?.requestedBy?.email,
    phone: deliveryManager?.requestedBy?.phone
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
const DeliveryDetailsTable = ({
  data
}) => {
  // Agrupar los datos por producto
  const groupedByProduct = data.reduce((acc, item) => {
    const productId = item.product_id;
    if (!acc[productId]) {
      acc[productId] = {
        product: item.product,
        deliveries: []
      };
    }
    acc[productId].deliveries.push(item);
    return acc;
  }, {});

  // Función para obtener la severidad según el estado
  const getStatusSeverity = status => {
    switch (status) {
      case 'entregado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'parcialmente_entregado':
        return 'warning';
      case 'cancelado':
        return 'danger';
      default:
        return 'info';
    }
  };
  const getStatusLabel = status => {
    switch (status) {
      case 'entregado':
        return 'Entregado';
      case 'pendiente':
        return 'Pendiente';
      case 'parcialmente_entregado':
        return 'Parcialmente entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Info';
    }
  };

  // Función para formatear la fecha
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Template para el estado
  const statusBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Tag, {
      value: getStatusLabel(rowData.status),
      severity: getStatusSeverity(rowData.status),
      className: "p-tag-rounded"
    });
  };

  // Template para cantidades con badges
  const quantityBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement(Badge, {
      value: rowData.quantity,
      className: "p-badge-primary"
    }));
  };

  // Template para cantidades entregadas
  const deliveredBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Badge, {
      value: rowData.delivered_quantity,
      severity: "success"
    });
  };

  // Template para cantidades pendientes
  const pendingBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Badge, {
      value: rowData.pending_quantity,
      severity: "warning"
    });
  };

  // Header del panel con información del producto
  const productPanelHeader = (product, deliveries) => {
    const totalQuantity = deliveries.reduce((sum, delivery) => sum + delivery.quantity, 0);
    const totalDelivered = deliveries.reduce((sum, delivery) => sum + delivery.delivered_quantity, 0);
    const totalPending = deliveries.reduce((sum, delivery) => sum + delivery.pending_quantity, 0);
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center w-100 gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", {
      className: "mb-0 text-primary"
    }, product.name), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, product.category_product?.name, " \u2022 ", product.product_type?.name)), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fw-bold"
    }, deliveries.length), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Entregas")), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fw-bold text-success"
    }, totalDelivered), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Entregado")), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "fw-bold text-warning"
    }, totalPending), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Pendiente"))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, Object.entries(groupedByProduct).map(([productId, {
    product,
    deliveries
  }]) => /*#__PURE__*/React.createElement(Panel, {
    key: productId,
    header: productPanelHeader(product, deliveries),
    className: "mb-4 shadow-sm",
    toggleable: true
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: deliveries,
    responsiveLayout: "scroll",
    className: "p-datatable-sm",
    stripedRows: true,
    showGridlines: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "ID Entrega",
    sortable: true,
    style: {
      width: '100px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "quantity",
    header: "Cantidad",
    body: quantityBodyTemplate,
    sortable: true,
    style: {
      width: '120px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "delivered_quantity",
    header: "Entregado",
    body: deliveredBodyTemplate,
    sortable: true,
    style: {
      width: '120px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "pending_quantity",
    header: "Pendiente",
    body: pendingBodyTemplate,
    sortable: true,
    style: {
      width: '120px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    body: statusBodyTemplate,
    sortable: true,
    style: {
      width: '130px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "created_at",
    header: "Fecha de entrega",
    body: rowData => formatDate(rowData.created_at),
    sortable: true,
    style: {
      width: '180px'
    }
  })))));
};