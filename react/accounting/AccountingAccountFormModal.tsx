import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AccountingAccountNode } from "./hooks/useAccountingAccountsTree";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputSwitch } from "primereact/inputswitch";
import { getNextLevel } from "./utils/AccountingAccountUtils";
import { classNames } from "primereact/utils";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";

interface AccountingAccountFormModalProps {
  visible: boolean;
  onHide: () => void;
  handleCreateAccount: (data: AccountingAccountFormModalData) => void;
  selectedAccount: AccountingAccountNode | null;
  ref: React.RefObject<AccountingAccountFormModalRef | null>;
}

interface AccountingAccountFormModalInputs {
  account_code: string;
  account_name: string;
  initial_balance: number;
  fiscal_difference: boolean;
  active: boolean;
  sub_account_code: string;
  category: string;
}

export interface AccountingAccountFormModalData {
  account_code: string;
  status: string;
  account_name: string;
  category: string;
  initial_balance: number;
  account_type: string;
  account: string | null;
  sub_account: string | null;
  auxiliary: string | null;
  sub_auxiliary: string | null;
}

export interface AccountingAccountFormModalRef {
  resetForm: () => void;
}

export const AccountingAccountFormModal: React.FC<AccountingAccountFormModalProps> =
  forwardRef((props, ref) => {
    const [showInputs, setShowInputs] = useState(false);
    const { visible, onHide, handleCreateAccount, selectedAccount } = props;
    const {
      control,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
    } = useForm<AccountingAccountFormModalInputs>({
      defaultValues: {
        account_code: "",
        account_name: "",
        initial_balance: 0,
        fiscal_difference: false,
        active: true,
        sub_account_code: "",
      },
    });

    const subAccountCode = useWatch({
      control,
      name: "sub_account_code",
    });

    useEffect(() => {
      if (selectedAccount) {
        setValue("account_code", selectedAccount.account_code);
        if (selectedAccount.account_code.startsWith("1")) {
          setShowInputs(true);
        }
      }
    }, [selectedAccount]);

    const getFormErrorMessage = (
      name: keyof AccountingAccountFormModalInputs
    ) => {
      return (
        errors[name] && (
          <small className="p-error">{errors[name].message}</small>
        )
      );
    };

    const categoryOptions = [
      { label: "Medicamentos", value: "medications" },
      { label: "Vacunas", value: "vaccines" },
      { label: "Inventariables", value: "inventariables" },
      { label: "Insumos", value: "supplies" },
    ];

    const onSubmit = (data: AccountingAccountFormModalInputs) => {
      const accountData: AccountingAccountFormModalData = {
        account_code: data.account_code,
        account_name: data.account_name,
        category: data.category,
        initial_balance: data.initial_balance,
        status: data.active ? "active" : "inactive",
        account_type: selectedAccount?.account_type || "",
        account: selectedAccount?.account || subAccountCode || null,
        sub_account:
          selectedAccount?.sub_account ||
          (subAccountCode && selectedAccount?.account
            ? subAccountCode
            : null) ||
          null,
        auxiliary:
          selectedAccount?.auxiliary ||
          (subAccountCode &&
            selectedAccount?.account &&
            selectedAccount?.sub_account
            ? subAccountCode
            : null) ||
          null,
        sub_auxiliary:
          selectedAccount?.sub_auxiliary ||
          (subAccountCode &&
            selectedAccount?.account &&
            selectedAccount?.sub_account &&
            selectedAccount?.auxiliary
            ? subAccountCode
            : null) ||
          null,
      };
      handleCreateAccount(accountData);
    };

    useImperativeHandle(ref, () => ({
      resetForm: () => {
        reset();
        setValue("account_code", selectedAccount?.account_code || "");
      },
    }));

    return (
      <>
        <Dialog
          header="Crear Nueva Cuenta"
          visible={visible}
          style={{ width: "90vw", maxWidth: "600px" }}
          onHide={onHide}
          modal
        >
          <form
            className="needs-validation row"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="p-fluid grid formgrid">
              <div className="field col-12 mb-3">
                <small className="text-muted">
                  Creando una subcuenta de nivel{" "}
                  {selectedAccount ? getNextLevel(selectedAccount.level) : ""}{" "}
                  para la cuenta {selectedAccount?.account_name}
                </small>
              </div>

              <div className="field col-12 mb-3">
                <label htmlFor="accountCode">Código *</label>
                <Controller
                  name="account_code"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    const parentCode = selectedAccount?.account_code || "";

                    return (
                      <InputText
                        id="accountCode"
                        {...field}
                        value={field.value || parentCode}
                        onChange={(e) => {
                          const inputValue = e.target.value;

                          if (!inputValue.startsWith(parentCode)) {
                            field.onChange(parentCode);
                          } else {
                            const subAccountPart = inputValue.substring(
                              parentCode.length
                            );
                            setValue("sub_account_code", subAccountPart);
                            field.onChange(inputValue);
                          }
                        }}
                        required
                      />
                    );
                  }}
                />
                <small className="text-muted">
                  Código padre: {selectedAccount?.account_code}
                </small>
                {getFormErrorMessage("account_code")}
              </div>

              <div className="field col-12 mb-3">
                <label htmlFor="accountName">Nombre *</label>
                <Controller
                  name="account_name"
                  control={control}
                  rules={{
                    required: "Este campo es requerido",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres",
                    },
                  }}
                  render={({ field }) => (
                    <InputText id="accountName" {...field} />
                  )}
                />
                {getFormErrorMessage("account_name")}
              </div>

              <div className="field col-12 mb-3">
                <label htmlFor="initialBalance">Saldo Inicial</label>
                <Controller
                  name="initial_balance"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      inputId={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onValueChange={(e) => field.onChange(e)}
                      className="w-100"
                      inputClassName={classNames("w-100", {
                        "p-invalid": errors.initial_balance,
                      })}
                      mode="currency"
                      currency="DOP"
                      locale="es-DO"
                    />
                  )}
                />
              </div>

              <div
                className="field col-12 mb-3"
                style={{ display: showInputs ? "block" : "none" }}
              >
                <label htmlFor="accountName">Categoría *</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      className="w-100"
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={categoryOptions}
                      placeholder="Seleccionar..."
                    />
                  )}
                />
              </div>

              <div className="field-checkbox col-12 mb-3">
                <Controller
                  name="fiscal_difference"
                  control={control}
                  render={({ field }) => (
                    <div className="d-flex align-items-center gap-2">
                      <InputSwitch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <label className="form-check-label">
                        Cuenta de diferencia fiscal
                      </label>
                    </div>
                  )}
                />
              </div>

              <div className="field-checkbox col-12 mb-3">
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <div className="d-flex align-items-center gap-2">
                      <InputSwitch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <label className="form-check-label">Cuenta activa</label>
                    </div>
                  )}
                />
              </div>
            </div>

            <Divider />

            <div className="d-flex justify-content-center gap-2">
              <Button
                type="button"
                label="Cancelar"
                className="p-button-primary"
                onClick={() => {
                  onHide();
                }}
              ><i className="fa fa-times me-2" style={{ marginLeft: "10px" }}></i></Button>
              <Button
                label="Guardar"
                type="submit"
                className="p-button-primary"
              ><i className="fa fa-save me-2" style={{ marginLeft: "10px" }}></i></Button>
            </div>
          </form>
        </Dialog>
      </>
    );
  });
