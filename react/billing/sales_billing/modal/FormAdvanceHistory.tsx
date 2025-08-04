import React, { useRef, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InventoryService } from "../../../../services/api/classes/inventoryServices";
import { Toast } from "primereact/toast";

interface AdvancePayment {
  id: string;
  date: string;
  amount: number;
  available_amount: number;
  payment_method: string;
  reference: string;
  amount_to_use?: number;
}

interface AdvanceHistoryFormProps {
  customerId: number | null;
  invoiceTotal: number;
  onSelectAdvances: (selectedAdvances: AdvancePayment[]) => void;
}

const AdvanceHistoryForm: React.FC<AdvanceHistoryFormProps> = ({
  customerId,
  invoiceTotal,
  onSelectAdvances,
}) => {
  const [selectedAdvances, setSelectedAdvances] = useState<AdvancePayment[]>(
    []
  );
  const [remainingAmount, setRemainingAmount] = useState(invoiceTotal);
  const toastRef = useRef<Toast>(null);
  const [advances, setAdvances] = useState<AdvancePayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Fetch customer advances

  useEffect(() => {
    const fetchAdvances = async () => {
      if (!customerId) return;
      setIsLoading(true);
      const invoiceService = new InventoryService();
      const response = await invoiceService.getById(customerId);
      setAdvances(response.data);
      setIsLoading(false);
    };
    fetchAdvances();
  }, [customerId]);
  useEffect(() => {
    setRemainingAmount(invoiceTotal);
    setSelectedAdvances([]);
  }, [invoiceTotal, customerId]);

  const handleSelectAdvance = (advance: AdvancePayment) => {
    const alreadySelected = selectedAdvances.some((a) => a.id === advance.id);

    if (alreadySelected) {
      setSelectedAdvances((prev) => prev.filter((a) => a.id !== advance.id));
      setRemainingAmount(
        (prev) => prev + (advance.amount_to_use || advance.available_amount)
      );
    } else {
      if (remainingAmount <= 0) {
        toastRef.current?.show({
          severity: "warn",
          summary: "Advertencia",
          detail: "El total de la factura ya ha sido cubierto",
          life: 3000,
        });
        return;
      }

      const amountToUse = Math.min(remainingAmount, advance.available_amount);
      const adjustedAdvance = {
        ...advance,
        amount_to_use: amountToUse,
      };

      setSelectedAdvances((prev) => [...prev, adjustedAdvance]);
      setRemainingAmount((prev) => prev - amountToUse);
    }
  };

  const handleAmountChange = (advanceId: string, value: number) => {
    setSelectedAdvances((prev) =>
      prev.map((advance) =>
        advance.id === advanceId
          ? { ...advance, amount_to_use: value }
          : advance
      )
    );

    // Recalculate remaining amount
    const totalSelected = selectedAdvances.reduce((sum, a) => {
      return sum + (a.id === advanceId ? value : a.amount_to_use || 0);
    }, 0);

    setRemainingAmount(invoiceTotal - totalSelected);
  };

  const confirmSelection = () => {
    onSelectAdvances(selectedAdvances);
  };

  const amountBodyTemplate = (rowData: AdvancePayment) => {
    if (selectedAdvances.some((a) => a.id === rowData.id)) {
      const selectedAdv = selectedAdvances.find((a) => a.id === rowData.id);
      const maxAmount = Math.min(
        rowData.available_amount,
        remainingAmount + (selectedAdv?.amount_to_use || 0)
      );

      return (
        <InputNumber
          value={selectedAdv?.amount_to_use}
          onValueChange={(e) => handleAmountChange(rowData.id, e.value || 0)}
          mode="currency"
          currency="DOP"
          min={0}
          max={maxAmount}
        />
      );
    }
    return (
      <span>
        {rowData.amount.toLocaleString("es-DO", {
          style: "currency",
          currency: "DOP",
        })}
      </span>
    );
  };

  const availableAmountBodyTemplate = (rowData: AdvancePayment) => {
    return (
      <span>
        {rowData.available_amount.toLocaleString("es-DO", {
          style: "currency",
          currency: "DOP",
        })}
      </span>
    );
  };

  const dateBodyTemplate = (rowData: AdvancePayment) => {
    return new Date(rowData.date).toLocaleDateString("es-DO");
  };

  const actionBodyTemplate = (rowData: AdvancePayment) => {
    const isSelected = selectedAdvances.some((a) => a.id === rowData.id);

    return (
      <Button
        icon={isSelected ? "pi pi-check" : "pi pi-plus"}
        className={`p-button-sm ${
          isSelected ? "p-button-success" : "p-button-primary"
        }`}
        onClick={() => handleSelectAdvance(rowData)}
        disabled={rowData.available_amount <= 0 && !isSelected}
        tooltip={rowData.available_amount <= 0 ? "Anticipo ya utilizado" : ""}
      />
    );
  };

  return (
    <>
      <Toast ref={toastRef} />
      <div className="p-fluid">
        <div
          className="mb-4 p-4 border-round"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="grid">
            <div className="col-6">
              <h4 className="m-0">
                Total factura:{" "}
                {invoiceTotal.toLocaleString("es-DO", {
                  style: "currency",
                  currency: "DOP",
                })}
              </h4>
            </div>
            <div className="col-6">
              <h4 className="m-0">
                Restante:
                <span
                  className={
                    remainingAmount > 0 ? "text-danger" : "text-success"
                  }
                >
                  {" "}
                  {remainingAmount.toLocaleString("es-DO", {
                    style: "currency",
                    currency: "DOP",
                  })}
                </span>
              </h4>
            </div>
          </div>
        </div>

        <DataTable
          value={advances || []}
          loading={isLoading}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
          emptyMessage="No se encontraron anticipos para este cliente"
          selectionMode="single"
          selection={selectedAdvances[0]}
          onSelectionChange={(e) => setSelectedAdvances([e.value])}
          dataKey="id"
        >
          <Column
            field="date"
            header="Fecha"
            body={dateBodyTemplate}
            sortable
          />
          <Column
            field="amount"
            header="Monto Total"
            body={amountBodyTemplate}
            sortable
          />
          <Column
            field="available_amount"
            header="Disponible"
            body={availableAmountBodyTemplate}
            sortable
          />
          <Column field="payment_method" header="Método de Pago" sortable />
          <Column field="reference" header="Referencia" sortable />
          <Column body={actionBodyTemplate} style={{ width: "6rem" }} />
        </DataTable>
      </div>
    </>
  );
};

export default AdvanceHistoryForm;
