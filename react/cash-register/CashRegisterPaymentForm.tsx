import React, { forwardRef, Ref, useImperativeHandle, useState } from "react";
import { CashRegisterPaymentFormInputs, CashRegisterPaymentFormRef, CashRegisterPaymentMethodsFormRef, CashRegisterProduct } from "./interfaces";
import { Card } from "primereact/card";
import { Controller, useForm } from "react-hook-form";
import { CashRegisterPaymentMethodsForm } from "./CashRegisterPaymentMethodsForm";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";
import { CashRegisterPaymentProductsDetail } from "./CashRegisterPaymentProductsDetail";
import { CashRegisterProductHelper } from "./helpers/CashRegisterProductHelper";
import { Button } from "primereact/button";
import { TerceroFormData, ThirdPartyModal } from "../billing/third-parties/modals/ThridPartiesModal";
import { useThirdPartyCreate } from "../billing/third-parties/hooks/useThirdPartyCreate";
import { useSearchThirdParties } from "../billing/third-parties/hooks/useSearchThirdParties";

interface CashRegisterPaymentFormProps {
    products: CashRegisterProduct[];
}

export const CashRegisterPaymentForm = forwardRef((props: CashRegisterPaymentFormProps, ref: Ref<CashRegisterPaymentFormRef>) => {

    const { products } = props;

    const total = CashRegisterProductHelper.calculateTotal(products);

    const { searchThirdParties, thirdParties } = useSearchThirdParties();
    const { createThirdParty } = useThirdPartyCreate();

    const { control, setValue, formState: { errors }, trigger, getValues } = useForm<CashRegisterPaymentFormInputs>({
        defaultValues: {
            client: null,
            payments: [],
        }
    });

    const cashRegisterPaymentMethodsFormRef = React.useRef<CashRegisterPaymentMethodsFormRef>(null);

    const [showThirdPartyModal, setShowThirdPartyModal] = useState(false);

    const handlePaymentsChange = (payments: any[]) => {
        setValue("payments", payments);
    };

    const getFormErrorMessage = (name: keyof CashRegisterPaymentFormInputs) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        );
    };

    const handleSaveThirdParty = async (formData: TerceroFormData) => {
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
                date_of_birth: formData.contact.date_of_birth,
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
                    getValues: getValues(),
                };
            }
            const cashRegisterPaymentMethodsFormResult = await cashRegisterPaymentMethodsFormRef.current?.submit();
            const isValid = await trigger();
            return {
                isValid: cashRegisterPaymentMethodsFormResult.isValid && isValid,
                getValues: getValues(),
            }
        }
    }));

    return (<>
        <div className="mb-4">
            <Card
                title={<>
                    <i className="fas fa-shopping-cart mr-2"></i> Lista de Productos
                </>}
                className="mb-4 shadow-3"
            >
                <CashRegisterPaymentProductsDetail products={products} />
            </Card>

            <Card
                title={<><i className="fas fa-credit-card mr-2"></i> Métodos de Pago</>}
                className="mb-4 shadow-3"
            >
                <CashRegisterPaymentMethodsForm
                    ref={cashRegisterPaymentMethodsFormRef}
                    total={total}
                    onPaymentsChange={handlePaymentsChange}
                />
            </Card>

            <div className="mb-3">
                <Controller
                    name="client"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor={field.name} className="form-label">
                                Cliente *
                            </label>
                            <div className="d-flex w-100">
                                <div className="d-flex flex-grow-1">
                                    <div className="grid row p-fluid w-100">
                                        <div className="col-12">
                                            <AutoComplete
                                                inputId={field.name}
                                                placeholder={"Seleccione un cliente"}
                                                field="label"
                                                suggestions={thirdParties}
                                                completeMethod={(e) => searchThirdParties(e.query, "client")}
                                                virtualScrollerOptions={{ itemSize: 38 }}
                                                inputClassName="w-100"
                                                panelClassName="w-100"
                                                className={classNames("w-100", {
                                                    "p-invalid": errors.client,
                                                })}
                                                appendTo={"self"}
                                                {...field}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <Button
                                        type="button"
                                        className="p-button-primary"
                                        size="small"
                                        onClick={() => setShowThirdPartyModal(true)}
                                        icon={<i className="fas fa-plus" />}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                />
                {getFormErrorMessage("client")}
            </div>
        </div>

        <ThirdPartyModal
            visible={showThirdPartyModal}
            onHide={() => setShowThirdPartyModal(false)}
            onSubmit={handleSaveThirdParty}
        />
    </>)
})