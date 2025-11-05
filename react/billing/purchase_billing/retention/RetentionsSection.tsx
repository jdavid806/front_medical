import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { retentionsService } from "../../../../services/api";

export interface RetentionItem {
  id: string;
  percentage: number;
  value: number;
}

interface RetentionOption {
  id: number;
  name: string;
  percentage: string;
  // other fields from your API response
}

export interface RetentionsSectionProps {
  subtotal: number;
  totalDiscount: number;
  retentions: RetentionItem[];
  onRetentionsChange: (retentions: RetentionItem[]) => void;
  productsArray: any[];
}

export const RetentionsSection: React.FC<RetentionsSectionProps> = ({
  subtotal,
  totalDiscount,
  retentions,
  onRetentionsChange,
  productsArray,
}) => {
  const [retentionOptions, setRetentionOptions] = useState<RetentionOption[]>(
    []
  );

  useEffect(() => {
    loadRetentions();
  }, []);

  async function loadRetentions() {
    try {
      const response = await retentionsService.getRetentions();
      setRetentionOptions(response.data); // Assuming the API returns the array directly
    } catch (error) {
      console.error("Error loading retentions:", error);
    }
  }

  const calculateBaseAmount = () => {
    return (subtotal || 0) - (totalDiscount || 0);
  };

  const calculateRetentionValue = (retention: any) => {
    const base = calculateBaseAmount();

    let productsFiltered: any = productsArray?.filter(
      (item: any) => item?.taxChargeId == retention?.tax?.id
    ) || [];

    if (productsFiltered.length && retention?.tax_id !== null) {
      productsFiltered = productsFiltered.reduce((total: any, product: any) => {
        let actualQuantity = 0;

        if (["medications", "vaccines"].includes(product?.typeProduct)) {
          const lotInfo = product?.lotInfo || [];
          actualQuantity = Array.isArray(lotInfo)
            ? lotInfo.reduce((sum: number, lot: any) => sum + (Number(lot?.quantity) || 0), 0)
            : Number(product?.quantity) || 0;
        } else {
          actualQuantity = Number(product?.quantity) || 0;
        }

        const subtotal = actualQuantity * (Number(product?.price) || 0);

        let discount = 0;

        if (product?.discountType === "percentage") {
          discount = subtotal * ((Number(product?.discount) || 0) / 100);
        } else {
          discount = Number(product?.discount) || 0;
        }

        const subtotalAfterDiscount = subtotal - discount;

        const taxValue = subtotalAfterDiscount * ((Number(product?.tax) || Number(product?.iva) || 0) / 100);

        return total + taxValue;
      }, 0);

      return (productsFiltered * (Number(retention?.percentage) || 0)) / 100;
    } else {
      return (base * (Number(retention?.percentage) || 0)) / 100;
    }
  };

  const handleAddRetention = () => {
    const newRetention: RetentionItem = {
      id: generateId(),
      percentage: 0,
      value: 0,
    };
    onRetentionsChange([...retentions, newRetention]);
  };

  const handleRemoveRetention = (id: string) => {
    onRetentionsChange(retentions.filter((r) => r.id !== id));
  };

  const handleRetentionChange = (id: string, field: string, value: any) => {
    const updatedRetentions = retentions.map((retention) => {
      if (retention.id === id) {
        const updatedRetention = {
          ...retention,
          [field]: value,
        };

        if (field === "percentage") {
          updatedRetention.value = calculateRetentionValue({ percentage: value });
        }

        return updatedRetention;
      }
      return retention;
    });

    onRetentionsChange(updatedRetentions);
  };

  useEffect(() => {
    const updatedRetentions = retentions.map((retention) => ({
      ...retention,
      value: calculateRetentionValue(retention),
    }));
    onRetentionsChange(updatedRetentions);
  }, [subtotal, totalDiscount, productsArray]);

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">
          <i className="pi pi-percentage me-2 text-primary"></i>
          Retenciones (DOP)
        </h2>
        <Button
          type="button"
          label="Agregar retención"
          className="p-button-primary"
          onClick={handleAddRetention}
        >
          <i className="fas fa-hand-holding-usd me-2" style={{ marginLeft: "10px" }}></i>
        </Button>
      </div>
      <div className="card-body">
        <div className="retentions-section">
          <div className="mb-3">
            <strong>Base para retenciones:</strong>{" "}
            <InputNumber
              value={calculateBaseAmount()}
              mode="currency"
              currency="DOP"
              locale="es-DO"
              readOnly
              className="ml-2"
            />
            <small className="d-block text-muted mt-1">
              (Subtotal: {(subtotal || 0).toFixed(2)} - Descuentos:{" "}
              {(totalDiscount || 0).toFixed(2)})
            </small>
          </div>

          {retentions.map((retention) => (
            <div
              key={retention.id}
              className="retention-row mb-3 p-3 border rounded"
            >
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label">Porcentaje retención</label>
                  <Dropdown
                    value={retention.percentage}
                    options={retentionOptions}
                    optionLabel="name"
                    placeholder="Seleccione porcentaje"
                    className="w-100 dropdown-billing-retention"
                    onChange={(e: DropdownChangeEvent) =>
                      handleRetentionChange(retention.id, "percentage", e.value)
                    }
                    appendTo="self"
                    filter
                    showClear
                    filterBy="name"
                  />
                </div>

                <div className="col-md-5">
                  <label className="form-label">Valor</label>
                  <InputNumber
                    value={retention.value || 0}
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    className="w-100"
                    readOnly
                  />
                </div>

                <div className="col-md-2 d-flex align-items-end">
                  <Button
                    type="button"
                    className="p-button-danger"
                    onClick={() => handleRemoveRetention(retention.id)}
                    tooltip="Eliminar retención"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="retention-total mt-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Total retenciones:</h5>
              <InputNumber
                value={retentions.reduce((sum, r) => sum + (r.value || 0), 0)}
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