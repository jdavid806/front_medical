import React, { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { formatDateDMY } from "../../../services/utilidades";
import { useProductDelivery } from "./hooks/useProductDelivery";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager";
import "../../extensions/number.extensions";
import { CustomPRTable } from "../../components/CustomPRTable";
import { useLoggedUser } from "../../users/hooks/useLoggedUser";
import { Button } from "primereact/button";
import { ProductDeliveryDetailDialog } from "./ProductDeliveryDetailDialog";
import { useProductDeliveryDetailFormat } from "../../documents-generation/hooks/useProductDeliveryDetailFormat";
import { useVerifyAndSaveProductDelivery } from "./hooks/useVerifyAndSaveProductDelivery";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useInvoicePurchase } from "../../billing/purchase_billing/hooks/usePurchaseBilling";
import { SwalManager } from "../../../services/alertManagerImported";

interface ProductDeposit {
    product_id: string;
    product_name: string;
    quantity: number;
    deposit_id: string | null;
}

interface ProductDeliveryDetailFormInputs {
    productsDeposits: ProductDeposit[];
}

export interface ProductDeliveryDetailFormData {
    productsDeposits: {
        [key: string]: string | null;
    };
}

interface ProductDeliveryDetailProps {
    deliveryId: string;
}

export const ProductDeliveryDetail = ({ deliveryId }: ProductDeliveryDetailProps) => {
    const { delivery, getDelivery } = useProductDelivery();
    const { loggedUser } = useLoggedUser();
    const { generateFormat } = useProductDeliveryDetailFormat();
    const { verifyAndSaveProductDelivery } = useVerifyAndSaveProductDelivery();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductDeliveryDetailFormInputs>({
        defaultValues: {
            productsDeposits: [],
        },
    });

    const { fields, append: appendProductDeposit, remove: removeProductDeposit, update: updateProductDeposit } = useFieldArray({
        control,
        name: "productsDeposits",
        rules: {
            required: true,
            validate: (value) => {
                if (value.length === 0) {
                    return "Debe seleccionar al menos un deposito";
                }
                if (value.some((productDeposit: ProductDeposit) => productDeposit.deposit_id === null)) {
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

    const [deliveryManager, setDeliveryManager] = useState<MedicalSupplyManager | null>(null);
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
            appendProductDeposit(deliveryManager.products.map((product) => ({
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

    const handleVerifyAndSaveProductDelivery = async (data: ProductDeliveryDetailFormInputs) => {
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
            console.error(error)
        }
    };

    const getFormErrorMessage = (name: keyof ProductDeliveryDetailFormInputs) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message || errors[name].root?.message}</small>
            )
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleVerifyAndSaveProductDelivery)}>

                <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                        <b>Solicitud #{delivery?.id}</b>
                        <Tag
                            value={deliveryManager?.statusLabel}
                            severity={deliveryManager?.statusSeverity}
                            className="fs-6"
                        />
                    </div>
                    <p>Creado: {formatDateDMY(delivery?.created_at)}</p>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Información del solicitante</h6>

                                    <div className="mb-2">
                                        <strong>Nombre: </strong>
                                        <span>{deliveryManager?.requestedBy?.name || '--'}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Correo electrónico: </strong>
                                        <span>{deliveryManager?.requestedBy?.email || '--'}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Teléfono: </strong>
                                        <span>{deliveryManager?.requestedBy?.phone || '--'}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Dirección: </strong>
                                        <span>{deliveryManager?.requestedBy?.address || '--'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Gestionado por</h6>

                                    <div className="mb-2">
                                        <strong>Nombre: </strong>
                                        <span>{`${loggedUser?.first_name || ''} ${loggedUser?.middle_name || ''} ${loggedUser?.last_name || ''} ${loggedUser?.second_last_name || ''}`}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Correo electrónico: </strong>
                                        <span>{loggedUser?.email}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Teléfono: </strong>
                                        <span>{loggedUser?.phone}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Dirección: </strong>
                                        <span>{loggedUser?.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CustomPRTable
                        data={productsDeposits}
                        columns={[
                            { field: 'product_name', header: 'Insumos' },
                            { field: 'quantity', header: 'Cantidad' },
                            {
                                field: 'deposit.name', header: 'Depósito', body: (deposit) => <>
                                    <SupplyDeliveryDepositColumn
                                        productsDeposits={productsDeposits}
                                        deposit={deposit}
                                        onUpdateProductDeposit={(index, deposit) => updateProductDeposit(index, deposit)}
                                    />
                                </>
                            },
                        ]}
                        disablePaginator
                        disableReload
                        disableSearch
                    />
                    {getFormErrorMessage("productsDeposits")}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-file-prescription text-primary me-2 fs-4"></i>
                                <div>
                                    <div className="fw-medium">Solicitud #{delivery?.id}</div>
                                    <div className="text-muted small">{deliveryManager?.requestedBy?.name || '--'} - {formatDateDMY(delivery?.created_at)}</div>
                                </div>
                            </div>
                            <div className="d-flex">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => setDialogVisible(true)}
                                >
                                    <i className="fas fa-eye me-1"></i> Ver solicitud
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={handlePrint}
                                >
                                    <i className="fas fa-print me-1"></i> Imprimir
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                        <Button
                            icon={<i className="fas fa-check me-2"></i>}
                            label="Entregar Productos"
                            className="btn btn-sm btn-primary"
                            type="submit"
                        />
                    </div>
                </div>

                <ProductDeliveryDetailDialog
                    visible={dialogVisible}
                    onHide={() => setDialogVisible(false)}
                    delivery={delivery}
                />

            </form>
        </>
    );
};

interface ProductDeliveryDepositColumnProps {
    productsDeposits: ProductDeposit[];
    deposit: ProductDeposit;
    onUpdateProductDeposit: (index: number, deposit: ProductDeposit) => void;
}

const SupplyDeliveryDepositColumn = (props: ProductDeliveryDepositColumnProps) => {

    const { productsDeposits, deposit, onUpdateProductDeposit } = props;

    const { getAllDeposits } = useInvoicePurchase();

    const [formattedDeposits, setFormattedDeposits] = useState<{
        id: string;
        name: string;
        originalData: any;
    }[]>([]);

    useEffect(() => {
        const loadDeposits = async () => {
            try {
                const depositsData = await getAllDeposits();
                console.log("depositsData", depositsData)
                const formatted = depositsData.map((deposit) => ({
                    id: deposit.id,
                    name: deposit.attributes.name,
                    originalData: deposit,
                }));
                setFormattedDeposits(formatted);
            } catch (error) {
                console.error("Error loading deposits:", error);
            }
        };

        loadDeposits();
    }, []);

    return (<>
        <label>Depósito</label>
        <Dropdown
            value={deposit.deposit_id}
            options={formattedDeposits}
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione depósito"
            className="w-100"
            onChange={(e: DropdownChangeEvent) => {
                onUpdateProductDeposit(productsDeposits.indexOf(deposit) || 0, { ...deposit, deposit_id: e.value })
            }}
        />
    </>);
};