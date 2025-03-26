import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Nullable } from "primereact/ts-helpers";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Badge } from "primereact/badge";

interface InvoiceFormData {
  invoiceType: string | null;
  elaborationDate: Nullable<Date>;
  provider: string | null;
  contact: string | null;
  invoiceNumber: number;
  providerInvoiceType: string | null;
  providerInvoiceNumber: string | null;
  providerInvoiceSpecific: string;
  costCenter: string | null;
  options: {
    providerPerItem: boolean;
    taxIncluded: boolean;
    discountPercentage: boolean;
  };
}

interface InvoiceItem {
  id: number;
  type: string | null;
  product: string | null;
  description: string;
  quantity: number;
  unitValue: number;
  discount: number;
  additionalData: string | null;
  taxes: string | null;
  totalValue: number;
}

export const NewPurchaseInvoice: React.FC = () => {
  // Mock data para el formulario principal
  const invoiceTypes = [
    { label: "Factura de Compra", value: "purchase" },
    { label: "Factura de Servicio", value: "service" },
    { label: "Factura de Importación", value: "import" },
  ];

  const providers = [
    { label: "Proveedor A", value: "providerA" },
    { label: "Proveedor B", value: "providerB" },
    { label: "Proveedor C", value: "providerC" },
  ];

  const contacts = [
    { label: "Juan Pérez - juan@proveedor.com", value: "contact1" },
    { label: "María Gómez - maria@proveedor.com", value: "contact2" },
    { label: "Carlos Ruiz - carlos@proveedor.com", value: "contact3" },
  ];

  const providerInvoiceTypes = [
    { label: "FC", value: "FC" },
    { label: "FD", value: "FD" },
    { label: "FX", value: "FX" },
  ];

  const providerInvoiceNumberTypes = [
    { label: "Consecutivo", value: "consecutive" },
    { label: "Automático", value: "automatic" },
    { label: "Manual", value: "manual" },
  ];

  const costCenters = [
    { label: "Administración", value: "admin" },
    { label: "Ventas", value: "sales" },
    { label: "Producción", value: "production" },
    { label: "TI", value: "it" },
  ];

  // Mock data para la tabla de productos
  const productTypes = [
    { label: "Producto", value: "product" },
    { label: "Servicio", value: "service" },
    { label: "Material", value: "material" },
  ];

  const products = [
    { label: "Producto A", value: "productA" },
    { label: "Producto B", value: "productB" },
    { label: "Producto C", value: "productC" },
  ];

  const additionalDataOptions = [
    { label: "Ninguno", value: "none" },
    { label: "Garantía", value: "warranty" },
    { label: "Instalación", value: "installation" },
  ];

  const taxOptions = [
    { label: "IVA 19%", value: "iva19" },
    { label: "IVA 5%", value: "iva5" },
    { label: "Exento", value: "exempt" },
  ];

  // Form state
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceType: null,
    elaborationDate: new Date(),
    provider: null,
    contact: null,
    invoiceNumber: generateInvoiceNumber(),
    providerInvoiceType: null,
    providerInvoiceNumber: null,
    providerInvoiceSpecific: "",
    costCenter: null,
    options: {
      providerPerItem: false,
      taxIncluded: false,
      discountPercentage: false,
    },
  });

  // State para la tabla de productos
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      type: "product",
      product: "productA",
      description: "",
      quantity: 1,
      unitValue: 0,
      discount: 0,
      additionalData: "none",
      taxes: "iva19",
      totalValue: 0,
    },
  ]);

  // Generate a random invoice number (mock)
  function generateInvoiceNumber(): number {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  const handleInputChange = (field: keyof InvoiceFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (field: keyof InvoiceFormData["options"]) => {
    setFormData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [field]: !prev.options[field],
      },
    }));
  };

  // Handlers para la tabla de productos
  const handleItemChange = (
    id: number,
    field: keyof InvoiceItem,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Calcular valor total si cambian cantidad, valor unitario o descuento
          if (
            field === "quantity" ||
            field === "unitValue" ||
            field === "discount"
          ) {
            updatedItem.totalValue = Math.round(
              updatedItem.quantity * updatedItem.unitValue -
              (updatedItem.quantity *
                updatedItem.unitValue *
                updatedItem.discount) /
              100
            );
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const addNewItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    setItems([
      ...items,
      {
        id: newId,
        type: "product",
        product: "productA",
        description: "",
        quantity: 1,
        unitValue: 0,
        discount: 0,
        additionalData: "none",
        taxes: "iva19",
        totalValue: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", { ...formData, items });
    // Aquí iría la lógica para enviar el formulario
  };

  // Componentes personalizados para la tabla
  const typeEditor = (options: any) => {
    return (
      <Dropdown
        value={options.rowData.type}
        options={productTypes}
        onChange={(e) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex(
            (item) => item.id === options.rowData.id
          );
          updatedItems[index] = { ...updatedItems[index], type: e.value };
          setItems(updatedItems);
        }}
        placeholder="Seleccione tipo"
        className="w-100"
      />
    );
  };

  const productEditor = (options: any) => {
    return (
      <Dropdown
        value={options.rowData.product}
        options={products}
        onChange={(e) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex(
            (item) => item.id === options.rowData.id
          );
          updatedItems[index] = { ...updatedItems[index], product: e.value };
          setItems(updatedItems);
        }}
        placeholder="Seleccione producto"
        className="w-100"
      />
    );
  };

  const descriptionEditor = (options: any) => {
    return (
      <InputText
        value={options.rowData.description}
        onChange={(e) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex(
            (item) => item.id === options.rowData.id
          );
          updatedItems[index] = {
            ...updatedItems[index],
            description: e.target.value,
          };
          setItems(updatedItems);
        }}
        className="w-100"
      />
    );
  };

  const quantityEditor = (options: any) => {
    return (
      <InputNumber
        value={options.rowData.quantity}
        onValueChange={(e) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex(
            (item) => item.id === options.rowData.id
          );
          updatedItems[index] = {
            ...updatedItems[index],
            quantity: e.value || 0,
            totalValue: Math.round(
              (e.value || 0) * updatedItems[index].unitValue -
              ((e.value || 0) *
                updatedItems[index].unitValue *
                updatedItems[index].discount) /
              100
            ),
          };
          setItems(updatedItems);
        }}
        mode="decimal"
        min={0}
        max={1000}
        className="w-100"
      />
    );
  };

  const unitValueEditor = (options: any) => {
    return (
      <InputNumber
        value={options.rowData.unitValue}
        onValueChange={(e) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex(
            (item) => item.id === options.rowData.id
          );
          updatedItems[index] = {
            ...updatedItems[index],
            unitValue: e.value || 0,
            totalValue: Math.round(
              updatedItems[index].quantity * (e.value || 0) -
              (updatedItems[index].quantity *
                (e.value || 0) *
                updatedItems[index].discount) /
              100
            ),
          };
          setItems(updatedItems);
        }}
        mode="currency"
        currency="COP"
        locale="es-CO"
        min={0}
        className="w-100"
      />
    );
  };

  const discountEditor = (options: any) => {
    return (
      <InputNumber
        value={options.rowData.discount}
        onValueChange={(e) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex(
            (item) => item.id === options.rowData.id
          );
          updatedItems[index] = {
            ...updatedItems[index],
            discount: e.value || 0,
            totalValue: Math.round(
              updatedItems[index].quantity * updatedItems[index].unitValue -
              (updatedItems[index].quantity *
                updatedItems[index].unitValue *
                (e.value || 0)) /
              100
            ),
          };
          setItems(updatedItems);
        }}
        mode="decimal"
        min={0}
        max={100}
        suffix="%"
        className="w-100"
      />
    );
  };

  const additionalDataEditor = (options: any) => {
    return (
      <Dropdown
        value={options.rowData.additionalData}
        options={additionalDataOptions}
        onChange={(e) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex(
            (item) => item.id === options.rowData.id
          );
          updatedItems[index] = {
            ...updatedItems[index],
            additionalData: e.value,
          };
          setItems(updatedItems);
        }}
        placeholder="Seleccione"
        className="w-100"
      />
    );
  };

  const taxesEditor = (options: any) => {
    return (
      <Dropdown
        value={options.rowData.taxes}
        options={taxOptions}
        onChange={(e) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex(
            (item) => item.id === options.rowData.id
          );
          updatedItems[index] = { ...updatedItems[index], taxes: e.value };
          setItems(updatedItems);
        }}
        placeholder="Seleccione"
        className="w-100"
      />
    );
  };

  const totalValueBody = (rowData: InvoiceItem) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rowData.totalValue);
  };

  const actionBodyTemplate = (rowData: InvoiceItem) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-text"
        onClick={() => removeItem(rowData.id)}
      />
    );
  };

  // Componente de resumen de factura

  // Reemplaza el componente InvoiceSummary con este:
  const InvoiceSummary = () => {
    // Calcular totales (igual que antes)
    const grossTotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitValue,
      0
    );
    const totalDiscount = items.reduce(
      (sum, item) =>
        sum + (item.quantity * item.unitValue * item.discount) / 100,
      0
    );
    const subtotal = grossTotal - totalDiscount;
    const ivaRate = 0;
    const retefuenteRate = 0;
    const ivaAmount = subtotal * (ivaRate / 100);
    const retefuenteAmount = subtotal * (retefuenteRate / 100);
    const netTotal = subtotal + ivaAmount - retefuenteAmount;

    return (
      <div className="row g-3 mb-4 mt-4 border-top pt-3">
        <div className="col-12">
          <Accordion>
            <AccordionTab
              header={
                <div className="flex align-items-center">
                  <i className="pi pi-calculator mr-2"></i>
                  <span>Resumen de Factura</span>
                  <Badge
                    value={new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(netTotal)}
                    className="ml-auto"
                    severity="success"
                  />
                </div>
              }
            >
              <div className="grid">
                <div className="col-6 md:col-4 lg:col-3">
                  <div className="p-3 border-round border-1 surface-border">
                    <div className="text-sm font-medium text-500">
                      Total Bruto
                    </div>
                    <div className="text-xl font-medium">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(grossTotal)}
                    </div>
                  </div>
                </div>

                <div className="col-6 md:col-4 lg:col-3">
                  <div className="p-3 border-round border-1 surface-border">
                    <div className="text-sm font-medium text-500">
                      Descuento
                    </div>
                    <div className="text-xl font-medium text-red-500">
                      -{" "}
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(totalDiscount)}
                    </div>
                  </div>
                </div>

                <div className="col-6 md:col-4 lg:col-3">
                  <div className="p-3 border-round border-1 surface-border">
                    <div className="text-sm font-medium text-500">Subtotal</div>
                    <div className="text-xl font-medium">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(subtotal)}
                    </div>
                  </div>
                </div>

                <div className="col-6 md:col-4 lg:col-3">
                  <div className="p-3 border-round border-1 surface-border">
                    <div className="text-sm font-medium text-500">IVA 0%</div>
                    <div className="text-xl font-medium">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(ivaAmount)}
                    </div>
                  </div>
                </div>

                <div className="col-6 md:col-4 lg:col-3">
                  <div className="p-3 border-round border-1 surface-border">
                    <div className="text-sm font-medium text-500">
                      Retefuente 0%
                    </div>
                    <div className="text-xl font-medium text-red-500">
                      -{" "}
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(retefuenteAmount)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border-round">
                <div className="flex justify-content-between align-items-center">
                  <div className="text-2xl font-bold">Total Neto:</div>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(netTotal)}
                  </div>
                </div>
              </div>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="mb-4">Información básica</h1>

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Columna Izquierda */}
              <div className="col-md-6">
                <div className="row g-3 mb-4">
                  {/* Tipo de factura */}
                  <div className="col-12">
                    <label htmlFor="invoiceType" className="form-label">
                      Tipo
                    </label>
                    <Dropdown
                      id="invoiceType"
                      value={formData.invoiceType}
                      options={invoiceTypes}
                      onChange={(e) =>
                        handleInputChange("invoiceType", e.value)
                      }
                      placeholder="Seleccione el tipo"
                      className="w-100"
                      required
                    />
                  </div>

                  {/* Fecha de elaboración */}
                  <div className="col-12">
                    <label htmlFor="elaborationDate" className="form-label">
                      Fecha de elaboración
                    </label>
                    <Calendar
                      id="elaborationDate"
                      value={formData.elaborationDate}
                      onChange={(e) =>
                        handleInputChange("elaborationDate", e.value)
                      }
                      dateFormat="dd/mm/yy"
                      showIcon
                      className="w-100"
                      required
                    />
                  </div>

                  {/* Proveedor */}
                  <div className="col-12">
                    <label htmlFor="provider" className="form-label">
                      Proveedores
                    </label>
                    <Dropdown
                      id="provider"
                      value={formData.provider}
                      options={providers}
                      onChange={(e) => handleInputChange("provider", e.value)}
                      placeholder="Seleccione proveedor"
                      className="w-100"
                      required
                    />
                  </div>

                  {/* Contacto */}
                  <div className="col-12">
                    <label htmlFor="contact" className="form-label">
                      Contacto
                    </label>
                    <Dropdown
                      id="contact"
                      value={formData.contact}
                      options={contacts}
                      onChange={(e) => handleInputChange("contact", e.value)}
                      placeholder="Seleccione contacto"
                      className="w-100"
                    />
                  </div>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="col-md-6">
                <div className="row g-3 mb-4">
                  {/* Número de factura (automático) */}
                  <div className="col-12">
                    <label htmlFor="invoiceNumber" className="form-label">
                      Número(Númeración automática)
                    </label>
                    <InputNumber
                      id="invoiceNumber"
                      value={formData.invoiceNumber}
                      mode="decimal"
                      disabled
                      className="w-100"
                    />
                  </div>

                  {/* Tipo de factura del proveedor */}
                  <div className="col-md-6">
                    <label htmlFor="providerInvoiceType" className="form-label">
                      Numero de factura proveedor
                    </label>
                    <Dropdown
                      id="providerInvoiceType"
                      value={formData.providerInvoiceType}
                      options={providerInvoiceTypes}
                      onChange={(e) =>
                        handleInputChange("providerInvoiceType", e.value)
                      }
                      placeholder="FC/FD/FX"
                      className="w-100"
                    />
                  </div>

                  {/* Número de factura del proveedor */}
                  <div className="col-md-6">
                    <label
                      htmlFor="providerInvoiceType"
                      className="form-label"
                    ></label>
                    <Dropdown
                      id="providerInvoiceNumber"
                      value={formData.providerInvoiceNumber}
                      options={providerInvoiceNumberTypes}
                      onChange={(e) =>
                        handleInputChange("providerInvoiceNumber", e.value)
                      }
                      placeholder="Seleccione"
                      className="w-100"
                    />
                  </div>

                  {/* Centro de costos */}
                  <div className="col-12">
                    <label htmlFor="costCenter" className="form-label">
                      Centro de costos
                    </label>
                    <Dropdown
                      id="costCenter"
                      value={formData.costCenter}
                      options={costCenters}
                      onChange={(e) => handleInputChange("costCenter", e.value)}
                      placeholder="Seleccione centro de costos"
                      className="w-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones de checkbox */}
            <div className="row g-3 mb-4 mt-4 border-top pt-3">
              <div className="col-12">
                <div className="form-check">
                  <Checkbox
                    inputId="providerPerItem"
                    checked={formData.options.providerPerItem}
                    onChange={() => handleCheckboxChange("providerPerItem")}
                  />
                  <label
                    htmlFor="providerPerItem"
                    className="form-check-label ms-2"
                  >
                    Proveedor por ítem
                  </label>
                </div>

                <div className="form-check">
                  <Checkbox
                    inputId="taxIncluded"
                    checked={formData.options.taxIncluded}
                    onChange={() => handleCheckboxChange("taxIncluded")}
                  />
                  <label
                    htmlFor="taxIncluded"
                    className="form-check-label ms-2"
                  >
                    IVA/Impoconsumo incluido
                  </label>
                </div>

                <div className="form-check">
                  <Checkbox
                    inputId="discountPercentage"
                    checked={formData.options.discountPercentage}
                    onChange={() => handleCheckboxChange("discountPercentage")}
                  />
                  <label
                    htmlFor="discountPercentage"
                    className="form-check-label ms-2"
                  >
                    Descuento en porcentaje
                  </label>
                </div>
              </div>
            </div>

            {/* Información de facturación - Tabla de productos */}
            <div className="row g-3 mb-4 mt-4 border-top pt-3">
              <div className="col-12">
                <h5 className="mb-3">Información de facturación</h5>

                <div className="table-responsive">
                  <DataTable
                    value={items}
                    editMode="cell"
                    dataKey="id"
                    className="p-datatable-sm"
                    emptyMessage="No hay productos agregados"
                  >
                    <Column
                      field="type"
                      header="Tipo"
                      body={(rowData) =>
                        productTypes.find((t) => t.value === rowData.type)
                          ?.label || ""
                      }
                      editor={(options) => typeEditor(options)}
                    />
                    <Column
                      field="product"
                      header="Producto"
                      body={(rowData) =>
                        products.find((p) => p.value === rowData.product)
                          ?.label || ""
                      }
                      editor={(options) => productEditor(options)}
                    />
                    <Column
                      field="description"
                      header="Descripción"
                      editor={(options) => descriptionEditor(options)}
                    />
                    <Column
                      field="quantity"
                      header="Cantidad"
                      editor={(options) => quantityEditor(options)}
                    />
                    <Column
                      field="unitValue"
                      header="Valor Unitario"
                      body={(rowData) =>
                        new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                        }).format(rowData.unitValue)
                      }
                      editor={(options) => unitValueEditor(options)}
                    />
                    <Column
                      field="discount"
                      header="Descuento"
                      body={(rowData) => `${rowData.discount}%`}
                      editor={(options) => discountEditor(options)}
                    />
                    <Column
                      field="additionalData"
                      header="Datos complementarios"
                      body={(rowData) =>
                        additionalDataOptions.find(
                          (a) => a.value === rowData.additionalData
                        )?.label || ""
                      }
                      editor={(options) => additionalDataEditor(options)}
                    />
                    <Column
                      field="taxes"
                      header="Impuestos"
                      body={(rowData) =>
                        taxOptions.find((t) => t.value === rowData.taxes)
                          ?.label || ""
                      }
                      editor={(options) => taxesEditor(options)}
                    />
                    <Column
                      field="totalValue"
                      header="Valor Total"
                      body={totalValueBody}
                    />
                    <Column
                      body={actionBodyTemplate}
                      style={{ width: "4rem" }}
                    />
                  </DataTable>
                </div>

                <div className="mt-3">
                  <Button
                    icon="fa-solid fa-stethoscope"
                    label="Agregar producto"
                    className="p-button-sm"
                    onClick={addNewItem}
                  />
                </div>
              </div>
            </div>

            {/* Nuevo componente de resumen */}
            <InvoiceSummary />

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-outline-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-secondary">
                Guardar Factura
              </button>

              <button type="submit" className="btn btn-secondary">
                Guardar y Enviar por email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
