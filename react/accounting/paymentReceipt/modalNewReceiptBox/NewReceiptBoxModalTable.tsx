import React, { useEffect, useState } from "react";
import {
  MetodoPago,
  DropdownOption,
} from "../../interface/interfaceCashRecipe";
import { useCreateCashRecipeWithInvoice } from "../../hooks/useCashReceipts";
import { usePaymentMethods } from "../../../payment-methods/hooks/usePaymentMethods";
import { useThirdParties } from "../../../billing/third-parties/hooks/useThirdParties";
import { ThirdParty } from "../../interface/interfaceCashRecipe";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { useCentresCosts } from "../../../centres-cost/hooks/useCentresCosts";
import {
  NewReceiptBoxModalProps,
  FormData,
} from "./interfaces/NewReceiptBoxModalTable";

const mapFormDataToPayload = (formData: FormData) => {
  const getUserIdFromLocalStorage = () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData.id;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener userId:", error);
      return null;
    }
  };

  const userId = getUserIdFromLocalStorage();
  return {
    type: formData.tipo.toLowerCase(),
    action: formData.realizarUn,
    status: "pagado",
    subtotal: formData.valorPagado,
    discount: 0,
    iva: 0,
    total_amount: formData.valorPagado,
    observations: formData.observaciones,
    due_date: formData.fechaElaboracion?.toISOString().split("T")[0],
    paid_amount: formData.valorPagado,
    remaining_amount: 0,
    quantity_total: 1,
    third_party_id: parseInt(formData.clientes),
    user_id: userId,
    advance_role: formData.tipo== "Ingreso" ? "customer" : "provider",
    details: [
      {
        product_id: 1,
        quantity: 1,
        unit_price: formData.valorPagado,
        amount: formData.valorPagado,
        discount: 0,
        subtotal: formData.valorPagado,
      },
    ],
    payments: [
      {
        payment_method_id: parseInt(formData.metodoPagoId),
        payment_date: formData.fechaElaboracion?.toISOString().split("T")[0],
        amount: formData.valorPagado,
        credit_card_or_bank: formData.origenDinero,
        credit_card_or_check_number: "",
        account_number: "",
        notes: "",
      },
    ],
    invoices: [
      {
        invoice_id: parseInt(formData.numeroFactura),
        applied_amount: formData.valorPagado,
      },
    ],
  };
};

export const NewReceiptBoxModalTable: React.FC<NewReceiptBoxModalProps> = ({
  visible,
  onHide,
  onSubmit,
  onSave,
  onSaveAndDownload,
  initialData,
}) => {
  // Función para determinar el tipo de recibo basado en initialData

  const [formData, setFormData] = useState<any>({
    idFactura: 0,
    cliente: "",
    tipo: "",
    clientes: "",
    realizarUn: "",
    metodoPagoId: "",
    origenDinero: "",
    numeroRecibo: "",
    numeroFactura: initialData?.numeroFactura || "",
    fechaElaboracion: null,
    centroCosto: initialData?.centreCost?.id?.toString() || "",
    valorPagado: 0,
    observaciones: "",
    archivo: null,
  });

  const { createCashRecipeWithInvoice, isLoading, error, success } =
    useCreateCashRecipeWithInvoice();
  const { paymentMethods, loading: loadingPaymentMethods } =
    usePaymentMethods();
  const { thirdParties, loading: loadingThirdParties } = useThirdParties();
  const { centresCosts, loading: loadingCostCenters } = useCentresCosts();

  useEffect(() => {
    if (visible) {
      setFormData((prev) => ({
        ...prev,
        numeroFactura: initialData?.numeroFactura || prev.numeroFactura,
        fechaElaboracion:
          initialData?.fechaElaboracion || prev.fechaElaboracion,
        valorPagado: initialData?.valorPagado || prev.valorPagado,
        centroCosto:
          initialData?.centreCost?.id?.toString() || prev.centroCosto,
        clientes: initialData?.cliente || prev.clientes,
        tipo: "",
      }));
    }
  }, [visible, initialData]);

  // Generar número de recibo automáticamente al abrir el modal
  useEffect(() => {
    if (visible) {
      const generarNumeroRecibo = () => {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const numero = Math.floor(1000 + Math.random() * 9000);
        return `RC-${año}-${numero}`;
      };

      setFormData((prev) => ({
        ...prev,
        numeroRecibo: initialData?.numeroRecibo || generarNumeroRecibo(),
      }));
    }
  }, [visible, initialData]);

  // Opciones para los dropdowns
  const tipoOptions: DropdownOption[] = [
    { label: "Ingreso", value: "Ingreso" },
    { label: "Egreso", value: "Egreso" },
  ];

  const clientesOptions: DropdownOption[] = thirdParties.map(
    (cliente: ThirdParty) => ({
      label: cliente.name,
      value: String(cliente.id),
    })
  );

  const realizarUnOptions: DropdownOption[] = [
    { label: "Anticipo", value: "advance_payment" },
  ];

  const metodoPagoOptions: DropdownOption[] = paymentMethods
    .filter((metodo) => metodo.category === "transactional")
    .map((metodo) => ({
      label: metodo.method,
      value: metodo.id,
    }));

  const centroCostoOptions: DropdownOption[] = centresCosts.map((centro) => ({
    label: centro.name,
    value: centro.id.toString(),
  }));

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDropdownChange = (e: { value: string }, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: e.value }));
  };

  const onDateChange = (e: { value: Date | Date[] | null }) => {
    if (e.value && !Array.isArray(e.value)) {
      setFormData((prev) => ({ ...prev, fechaElaboracion: e.value as Date }));
    }
  };

  const onNumberChange = (e: { value: number }, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: e.value }));
  };

  const onFileUpload = (e: { files: File[] }) => {
    setFormData((prev) => ({ ...prev, archivo: e.files[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSave = async () => {
    const payload = mapFormDataToPayload(formData);
    try {
      await createCashRecipeWithInvoice(payload);
      onHide();
    } catch (err) {
      console.error("Error al guardar el recibo:", err);
    }
  };

  const handleSaveAndDownload = async () => {
    const payload = mapFormDataToPayload(formData);
    try {
      await createCashRecipeWithInvoice(payload);
      onHide();
    } catch (err) {
      console.error("Error al guardar el recibo:", err);
    }
  };

  return (
    <Dialog
      header="Recibo de Caja"
      visible={visible}
      style={{ width: "80vw" }}
      onHide={onHide}
      maximizable
      modal
      className="p-fluid"
    >
      <form onSubmit={handleSubmit}>
        <div className="row mb-4">
          {/* Columna izquierda */}
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="tipo" className="form-label">
                Tipo
              </label>
              <Dropdown
                id="tipo"
                value={formData.tipo}
                options={tipoOptions}
                onChange={(e) => onDropdownChange(e, "tipo")}
                placeholder="Seleccione..."
                className="w-100"
                appendTo={"self"}
                filter
                showClear
              />
            </div>

            <div className="mb-3">
              <label htmlFor="clientes" className="form-label">
                Clientes
              </label>
              <Dropdown
                id="clientes"
                value={formData.clientes}
                options={clientesOptions}
                onChange={(e) => onDropdownChange(e, "clientes")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
                appendTo={"self"}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="realizarUn" className="form-label">
                Realizar un
              </label>
              <Dropdown
                id="realizarUn"
                value={formData.realizarUn}
                options={realizarUnOptions}
                onChange={(e) => onDropdownChange(e, "realizarUn")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
                appendTo={"self"}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="metodoPagoId" className="form-label">
                Método de pago
              </label>
              <Dropdown
                id="metodoPagoId"
                value={formData.metodoPagoId}
                options={metodoPagoOptions}
                onChange={(e) => onDropdownChange(e, "metodoPagoId")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
                appendTo={"self"}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="valorPagado" className="form-label">
                Valor pagado
              </label>
              <InputNumber
                id="valorPagado"
                value={formData.valorPagado}
                onValueChange={(e) =>
                  onNumberChange({ value: e.value ?? 0 }, "valorPagado")
                }
                mode="currency"
                currency="USD"
                locale="en-US"
                className="w-100"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="numeroRecibo" className="form-label">
                Número de recibo (Automático)
              </label>
              <InputText
                id="numeroRecibo"
                value={formData.numeroRecibo}
                className="w-100"
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fechaElaboracion" className="form-label">
                Fecha de elaboración
              </label>
              <Calendar
                id="fechaElaboracion"
                value={formData.fechaElaboracion}
                onChange={(e: any) => onDateChange(e)}
                dateFormat="dd/mm/yy"
                className="w-100"
                showIcon
                placeholder="Seleccione la fecha"
                appendTo={"self"}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="centroCosto" className="form-label">
                Centro de costo
              </label>
              <Dropdown
                id="centroCosto"
                value={formData.centroCosto}
                options={centroCostoOptions}
                onChange={(e) => onDropdownChange(e, "centroCosto")}
                placeholder="Seleccione..."
                className="w-100"
                filter
                showClear
                appendTo={"self"}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Agregar archivo</label>
              <FileUpload
                mode="basic"
                name="archivo"
                accept="image/*,.pdf,.doc,.docx"
                maxFileSize={1000000}
                chooseLabel="Seleccionar archivo"
                className="w-50"
                onUpload={onFileUpload}
              />
            </div>
          </div>
        </div>

        {/* Observaciones y archivo */}
        <div className="row mb-4">
          <div className="col-12">
            <label htmlFor="observaciones" className="form-label">
              Observaciones
            </label>
            <InputTextarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={onInputChange}
              rows={3}
              className="w-100"
              placeholder="Detalles adicionales..."
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="d-flex justify-content-center gap-3">
          <Button
            label="Guardar"
            style={{ width: "200px", padding: "0.5rem 1rem" }}
            className="btn btn-phoenix-secondary"
            onClick={handleSave}
          >
            <i className="fas fa-plus"></i>
          </Button>

          <Button
            label="Guardar y Descargar"
            className="btn btn-primary"
            style={{ width: "300px", padding: "0.5rem 1rem" }}
            onClick={handleSaveAndDownload}
          >
            <i className="fas fa-download"></i>
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
