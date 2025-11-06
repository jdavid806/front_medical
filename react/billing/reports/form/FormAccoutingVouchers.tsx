import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import {
  accountingAccountsService,
  resourcesAdminService,
  accountingVouchersService,
} from "../../../../services/api/index.js";
import { getUserLogged } from "../../../../services/utilidades.js";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.jsx";

// Definición de tipos

type TransactionTypeOption = "debit" | "credit";
type ThirdPartyTypeOption = "provider" | "client";
type ThirdPartyOption = {
  id: number;
  name: string;
  type: "provider" | "client"; // Añadimos el tipo según la respuesta del servicio
};

export type Transaction = {
  id: string;
  account: string | null;
  type: TransactionTypeOption | null;
  thirdPartyType: ThirdPartyTypeOption | null;
  thirdParty: string | null;
  amount: number | null;
  description: string;
};

type FormAccountingVouchersProps = {
  voucherId?: string;
  initialData?: any | null;
  editTransactions?: Transaction[];
  onUpdate?: () => void;
};

export const FormAccoutingVouchers: React.FC<FormAccountingVouchersProps> = ({ voucherId = undefined, initialData = null, editTransactions = [], onUpdate }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const toast = useRef<Toast>(null);
  const [numberOfVoucher, setNumberOfVoucher] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const userLogged = getUserLogged();

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Opciones del tipo de transacción
  const transactionTypeOptions = [
    { label: "Débito", value: "debit" },
    { label: "Crédito", value: "credit" },
  ];

  // Opciones del tipo de tercero
  const thirdPartyTypeOptions = [
    { label: "Proveedor", value: "provider" },
    { label: "Cliente", value: "client" },
  ];

  async function loadLastAccountingEntry() {
    const data = await accountingVouchersService.getLastRow();
    setNumberOfVoucher(data.id || 0 + 1);
  }

  useEffect(() => {
    loadLastAccountingEntry();
  }, []);

  useEffect(() => {
    console.log("initialData: ", initialData);
    reset(
      initialData || {
        date: null
      }
    );
  }, [initialData, reset]);

  useEffect(() => {
    if (editTransactions.length > 0) {
      console.log("editTransactions: ", editTransactions);
      setTransactions(editTransactions);
    }
  }, [initialData, editTransactions]);

  // Funciones de cálculo
  const calculateTotalDebit = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "debit"
        ? total + (transaction.amount || 0)
        : total;
    }, 0);
  };

  const calculateTotalCredit = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "credit"
        ? total + (transaction.amount || 0)
        : total;
    }, 0);
  };

  const isBalanced = () => {
    return calculateTotalDebit() === calculateTotalCredit();
  };

  // Funciones para manejar transacciones
  const addTransaction = () => {
    setTransactions([
      ...transactions,
      {
        id: generateId(),
        account: null,
        type: null,
        thirdPartyType: null,
        thirdParty: null,
        amount: null,
        description: "",
      },
    ]);
  };

  const removeTransaction = (id: string) => {
    if (transactions.length > 1) {
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Debe tener al menos una transacción",
        life: 3000,
      });
    }
  };

  const handleTransactionChange = (
    id: string,
    field: keyof Transaction,
    value: any
  ) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, [field]: value } : transaction
      )
    );
  };
  const save = async (formData: any) => {
    if (!isBalanced()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El comprobante no está balanceado (Débitos ≠ Créditos)",
        life: 5000,
      });
      return;
    }

    let formattedData: any = {
      description: formData.observations || "Sin observaciones",
      seat_date: formData.date
        ? formatDate(formData.date)
        : formatDate(new Date()),
      seat_number: `AS-${formatDate(new Date())}${initialData?.id || numberOfVoucher}`,
      status: "approved",
      total_should_be: calculateTotalDebit(),
      total_is: calculateTotalCredit(),
      user_id: userLogged.id,
      details: transactions.map((transaction) => ({
        accounting_account_id: transaction.account || 0,
        amount: transaction.amount || 0,
        type: transaction.type?.toLowerCase() || "", // "DEBITO" -> "debit", "CREDITO" -> "credit"
        description: transaction.description || "",
        third_party_id: transaction.thirdParty || 0,
      })),
    }

    if (voucherId) {

      formattedData = {
        description: formData.observations || "Sin observaciones",
        seat_date: formData.date
          ? formatDate(formData.date)
          : formatDate(new Date()),
        total_should_be: calculateTotalDebit(),
        total_is: calculateTotalCredit(),
        user_id: userLogged.id,
        details: transactions.map((transaction) => ({
          accounting_account_id: transaction.account || 0,
          amount: transaction.amount || 0,
          type: transaction.type?.toLowerCase() || "", // "DEBITO" -> "debit", "CREDITO" -> "credit"
          description: transaction.description || "",
          third_party_id: transaction.thirdParty || 0,
        }))
      }

      await accountingVouchersService
        .updateAccountingVouchers(voucherId, formattedData)
        .then((response) => {
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Comprobante contable guardado correctamente",
            life: 3000,
          });
          onUpdate && onUpdate();
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Erro al guardar comprobante contable",
            life: 3000,
          });
        });
    } else {
      await accountingVouchersService
        .storeAccountingVouchers(formattedData)
        .then((response) => {
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Comprobante contable guardado correctamente",
            life: 3000,
          });
          setTimeout(() => {
            window.location.href = 'ComprobantesContables';
          }, 2000);
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Erro al guardar comprobante contable",
            life: 3000,
          });
        });
    }
  };

  // Función auxiliar para formatear fechas
  function formatDate(date: Date | string): string {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const saveAndSend = async (formData: any) => {
    const formattedData = {
      description: formData.observations || "Sin observaciones",
      seat_date: formData.date
        ? formatDate(formData.date)
        : formatDate(new Date()),
      seat_number: `AS-${formatDate(new Date())}${initialData?.id || numberOfVoucher}`,
      status: "approved",
      total_should_be: calculateTotalDebit(),
      total_is: calculateTotalCredit(),
      user_id: userLogged.id,
      details: transactions.map((transaction) => ({
        accounting_account_id: transaction.account || 0,
        amount: transaction.amount || 0,
        type: transaction.type?.toLowerCase() || "", // "DEBITO" -> "debit", "CREDITO" -> "credit"
        description: transaction.description || "",
        third_party_id: transaction.thirdParty || 0,
      })),
    };

    // Aquí iría la llamada al API para guardar y enviar
    await accountingVouchersService
      .storeAccountingVouchers(formattedData)
      .then((response) => {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Comprobante contable guardado correctamente",
          life: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Erro al guardar comprobante contable",
          life: 3000,
        });
      });
  };

  const cancel = () => {
    console.log("Cancelando creación de comprobante...");
  };

  // Columnas para la tabla de transacciones
  const transactionColumns = [
    {
      field: "account",
      header: "Cuenta Contable",
      body: (rowData: Transaction) => (
        <AccountingAccountField
          rowData={rowData}
          onChange={(value) => handleTransactionChange(rowData.id, "account", value)}
        />
      ),
    },
    {
      field: "type",
      width: "300px",
      header: "Tipo",
      body: (rowData: Transaction) => (
        <Dropdown
          value={rowData.type}
          options={transactionTypeOptions}
          placeholder="Seleccione tipo"
          className="w-100 dropdown-accounting-voucher"
          style={{ width: "100vw" }}
          onChange={(e) => handleTransactionChange(rowData.id, "type", e.value)}
        />
      ),
    },
    {
      field: "thirdPartyType",
      header: "Tipo de Tercero",
      body: (rowData: Transaction) => (
        <Dropdown
          value={rowData.thirdPartyType}
          options={thirdPartyTypeOptions}
          placeholder="Seleccione tipo"
          className="w-100 dropdown-accounting-voucher"
          style={{ width: "100vw" }}
          onChange={(e) => {
            handleTransactionChange(rowData.id, "thirdPartyType", e.value);
          }}
        />
      ),
    },
    {
      field: "thirdParty",
      header: "Terceros",
      body: (rowData: Transaction) => (
        <ThirdPartyField
          rowData={rowData}
          onChange={(value) => handleTransactionChange(rowData.id, "thirdParty", value)}
        />
      ),
    },
    {
      field: "amount",
      header: "Monto",
      body: (rowData: Transaction) => (
        <InputNumber
          value={rowData.amount}
          placeholder="0.00"
          className="w-full"
          mode="currency"
          currency="DOP"
          locale="es-DO"
          onValueChange={(e) =>
            handleTransactionChange(rowData.id, "amount", e.value)
          }
        />
      ),
    },
    {
      field: "description",
      header: "Descripción",
      body: (rowData: Transaction) => (
        <InputText
          value={rowData.description}
          placeholder="Ingrese descripción"
          className="w-full"
          onChange={(e) =>
            handleTransactionChange(rowData.id, "description", e.target.value)
          }
        />
      ),
    },
    {
      field: "actions",
      header: "Acciones",
      body: (rowData: Transaction) => (
        <Button
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => removeTransaction(rowData.id)}
          tooltip="Eliminar transacción"
          tooltipOptions={{ position: "top" }}
          type="button"
        >
          <i className="fa-solid fa-trash"></i>
        </Button>
      ),
    },
  ];

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit(save)}>
            {/* Sección de Información Básica */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h2 className="h5 mb-0">
                  <i className="pi pi-info-circle me-2 text-primary"></i>
                  Información básica
                </h2>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Número de comprobante *
                      </label>
                      <Controller
                        name="invoiceNumber"
                        control={control}
                        render={({ field }) => (
                          <InputText
                            {...field}
                            value={initialData?.id || "#" + numberOfVoucher}
                            placeholder="Generado automáticamente"
                            className="w-100"
                            readOnly
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Fecha *</label>
                      <Controller
                        name="date"
                        control={control}
                        rules={{ required: "Campo obligatorio" }}
                        render={({ field, fieldState }) => (
                          <>
                            <Calendar
                              {...field}
                              placeholder="Seleccione fecha"
                              className={classNames("w-100", {
                                "p-invalid": fieldState.error,
                              })}
                              showIcon
                              dateFormat="dd/mm/yy"
                            />
                            {fieldState.error && (
                              <small className="p-error">
                                {fieldState.error.message}
                              </small>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Transacciones */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">
                  <i className="pi pi-credit-card me-2 text-primary"></i>
                  Transacciones contables
                </h2>
                <Button
                  icon="pi pi-plus"
                  label="Agregar transacción"
                  className="btn btn-primary"
                  type="button"
                  onClick={addTransaction}
                />
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                  <DataTable
                    value={transactions}
                    responsiveLayout="scroll"
                    emptyMessage="Por favor agrega transacciones"
                    className="p-datatable-sm"
                    showGridlines
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                    style={{ minWidth: '100%', width: '100%' }}
                  >
                    {transactionColumns.map((col, i) => (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        style={{ minWidth: "200px !important" }}
                      />
                    ))}
                  </DataTable>
                </div>

                <div className="row mt-3 p-3">
                  <div className="col-md-6">
                    <div
                      className="alert alert-info"
                      style={{
                        background: "rgb(194 194 194 / 85%)",
                        border: "none",
                        color: "black",
                      }}
                    >
                      <strong>Total débitos:</strong>
                      <InputNumber
                        value={calculateTotalDebit()}
                        className="ms-2"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="alert alert-info"
                      style={{
                        background: "rgb(194 194 194 / 85%)",
                        border: "none",
                        color: "black",
                      }}
                    >
                      <strong>Total créditos:</strong>
                      <InputNumber
                        value={calculateTotalCredit()}
                        className="ms-2"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                      {!isBalanced() && (
                        <span className="text-danger ms-2">
                          <i className="pi pi-exclamation-triangle"></i> El
                          comprobante no está balanceado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Observaciones */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h2 className="h5 mb-0">
                  <i className="pi pi-comment me-2 text-primary"></i>
                  Observaciones
                </h2>
              </div>
              <div className="card-body">
                <Controller
                  name="observations"
                  control={control}
                  render={({ field }) => (
                    <InputTextarea
                      {...field}
                      rows={5}
                      className="w-100"
                      placeholder="Ingrese observaciones relevantes"
                    />
                  )}
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="d-flex justify-content-end gap-3 mb-4">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={cancel}
              />
              <Button
                label="Guardar"
                icon="pi pi-check"
                className="btn-info"
                type="submit"
                disabled={!isBalanced()}
              />
              {/* <Button
                label="Guardar y Enviar"
                icon="pi pi-send"
                className="btn-info"
                onClick={handleSubmit(saveAndSend)}
                disabled={!isBalanced()}
              /> */}
            </div>
          </form>
        </div>
      </div>

      <Toast ref={toast} />
    </div>
  );
};

const AccountingAccountField = ({
  rowData,
  onChange
}: {
  rowData: Transaction;
  onChange: (value: string) => void;
}) => {
  const { accounts, isLoading, error } = useAccountingAccounts();

  /*
const [accountingAccounts, setAccountingAccounts] = useState<any[]>([]);

const loadAccountingAcounts = async () => {


  const response = await accountingAccountsService.getAllAccounts();
  console.log("Accounts: ", response.data);

  setAccountingAccounts(response.data);
};

useEffect(() => {
  loadAccountingAcounts();
}, []);
*/
  return <>
    <Dropdown
      value={rowData.account}
      options={accounts}
      optionLabel="account_label"
      optionValue="id"
      placeholder="Seleccione cuenta"
      onChange={(e) => onChange(e.value)}
      filter
      showClear
      className="w-100"
      style={{ width: "100vw" }}
      appendTo={document.body}
    />
  </>
}

const ThirdPartyField = ({
  rowData,
  onChange
}: {
  rowData: Transaction;
  onChange: (value: string) => void;
}) => {

  const [allThirdParties, setAllThirdParties] = useState<ThirdPartyOption[]>([]); // Todos los terceros
  const toast = useRef<Toast>(null);

  const loadThirdParties = async () => {
    try {
      const response = await resourcesAdminService.getThirdParties();
      console.log("Terceros: ", response.data);

      setAllThirdParties(response.data); // Guardamos todos los terceros
    } catch (error) {
      console.error("Error cargando terceros:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los terceros",
        life: 3000,
      });
    }
  }

  const getFilteredThirdParties = (
    thirdPartyType: ThirdPartyTypeOption | null
  ) => {
    if (!thirdPartyType) return [];

    return allThirdParties.filter((thirdParty) => {
      if (thirdPartyType === "provider") {
        return thirdParty.type === "provider";
      } else if (thirdPartyType === "client") {
        return thirdParty.type === "client";
      }
      return false;
    });
  };

  useEffect(() => {
    loadThirdParties();
  }, []);

  return <>
    <Dropdown
      value={rowData.thirdParty}
      options={getFilteredThirdParties(rowData.thirdPartyType)}
      optionLabel="name"
      optionValue="id"
      placeholder="Seleccione tercero"
      onChange={(e) => onChange(e.value)}
      filter
      showClear
      className="w-100 dropdown-accounting-voucher"
      appendTo={document.body}
    />
  </>
}