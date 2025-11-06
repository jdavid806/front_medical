import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

export interface TaxItem {
  id: string;
  tax: any;
  percentage: number;
  value: number;
}

export interface TaxesSectionProps {
  subtotal: number;
  totalDiscount: number;
  taxes: TaxItem[];
  onTaxesChange: (taxes: TaxItem[]) => void;
  productsArray: any[];
  taxOptions: any[];
}

export const CustomTaxes: React.FC<TaxesSectionProps> = ({
  subtotal,
  totalDiscount,
  taxes,
  onTaxesChange,
  productsArray,
  taxOptions,
}) => {

  const calculateBaseAmount = () => {
    return (subtotal || 0) - (totalDiscount || 0);
  };

  const calculateTaxValue = (taxItem: TaxItem) => {
    const base = calculateBaseAmount();

    if (taxItem.tax && taxItem.tax.specificLogic) {
      const productsFiltered = productsArray
        .filter((item: any) => item.taxChargeId === taxItem.tax.id)
        .reduce((total, product: any) => {
          const productSubtotal = product.quantity * product.price;

          let discount = 0;
          if (product.discountType === "percentage") {
            discount = productSubtotal * (product.discount / 100);
          } else {
            discount = product.discount;
          }

          const subtotalAfterDiscount = productSubtotal - discount;
          return total + subtotalAfterDiscount;
        }, 0);

      return (productsFiltered * (taxItem.percentage || 0)) / 100;
    }

    return (base * (taxItem.percentage || 0)) / 100;
  };

  const handleAddTax = () => {
    const newTax: TaxItem = {
      id: generateId(),
      tax: null,
      percentage: 0,
      value: 0,
    };
    onTaxesChange([...taxes, newTax]);
  };

  const handleRemoveTax = (id: string) => {
    onTaxesChange(taxes.filter((t) => t.id !== id));
  };

  const handleTaxChange = (id: string, field: string, value: any) => {
    const updatedTaxes = taxes.map((taxItem) => {
      if (taxItem.id === id) {
        const updatedTax = {
          ...taxItem,
          [field]: value,
        };

        if (field === "tax" && value) {
          updatedTax.percentage = value.percentage;
          updatedTax.value = calculateTaxValue({ ...updatedTax, percentage: value.percentage });
        }

        if (field === "percentage") {
          updatedTax.value = calculateTaxValue(updatedTax);
        }

        return updatedTax;
      }
      return taxItem;
    });

    onTaxesChange(updatedTaxes);
  };

  useEffect(() => {
    const updatedTaxes = taxes.map((taxItem) => ({
      ...taxItem,
      value: calculateTaxValue(taxItem),
    }));
    onTaxesChange(updatedTaxes);
  }, [subtotal, totalDiscount]);

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">
          <i className="pi pi-chart-line me-2 text-primary"></i>
          Impuestos Adicionales (DOP)
        </h2>
        <Button
          type="button"
          label="Agregar impuesto"
          className="p-btn-primary"
          onClick={handleAddTax}
        >
          <i className="fas fa-donate" style={{ marginLeft: "10px" }}></i>

        </Button>
      </div>
      <div className="card-body">
        <div className="taxes-section">
          <div className="mb-3">
            <strong>Base para impuestos:</strong>{" "}
            <InputNumber
              value={calculateBaseAmount()}
              mode="currency"
              currency="DOP"
              locale="es-DO"
              readOnly
              className="ml-2"
            />
            <small className="d-block text-muted mt-1">
              (Subtotal: {subtotal.toFixed(2)} - Descuentos:{" "}
              {totalDiscount.toFixed(2)})
            </small>
          </div>

          {taxes.map((taxItem) => (
            <div
              key={taxItem.id}
              className="tax-row mb-3 p-3 border rounded"
            >
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label">Impuesto</label>
                  <Dropdown
                    value={taxItem.tax}
                    options={taxOptions} // Usa las opciones que vienen del padre
                    optionLabel="name"
                    placeholder="Seleccione impuesto"
                    className="w-100"
                    onChange={(e: DropdownChangeEvent) =>
                      handleTaxChange(taxItem.id, "tax", e.value)
                    }
                    appendTo={"self"}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Porcentaje %</label>
                  <InputNumber
                    value={taxItem.percentage}
                    mode="decimal"
                    min={0}
                    max={100}
                    suffix="%"
                    locale="es-DO"
                    className="w-100"
                    onValueChange={(e) =>
                      handleTaxChange(taxItem.id, "percentage", e.value)
                    }
                    readOnly
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Valor</label>
                  <InputNumber
                    value={taxItem.value}
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    className="w-100"
                    readOnly
                  />
                </div>

                <div className="col-md-1 d-flex align-items-end">
                  <Button
                    type="button"
                    className="p-button-danger"
                    onClick={() => handleRemoveTax(taxItem.id)}
                    tooltip="Eliminar impuesto"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="tax-total mt-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Total impuestos adicionales:</h5>
              <InputNumber
                value={taxes.reduce((sum, t) => sum + t.value, 0)}
                mode="currency"
                currency="DOP"
                locale="es-DO"
                className="font-weight-bold"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate unique IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}