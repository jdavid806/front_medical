import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tag } from "primereact/tag";
import { formatDate, formatDateDMY, formatWhatsAppMessage, generateUUID, getIndicativeByCountry, getJWTPayload } from "../../../services/utilidades";
import "../../extensions/number.extensions";
import { CustomPRTable } from "../../components/CustomPRTable";
import { Button } from "primereact/button";
import { MedicationDeliveryDetailDialog } from "./MedicationDeliveryDetailDialog";
import { useMedicationDeliveryDetailFormat } from "../../documents-generation/hooks/useMedicationDeliveryDetailFormat";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { usePrescription } from "../../prescriptions/hooks/usePrescription";
import { MedicationPrescriptionManager } from "./helpers/MedicationPrescriptionManager";
import { MedicationVerification, MedicationVerificationStatus, useVerifyMedicationsBulk } from "./hooks/useVerifyMedicationsBulk";
import { Dropdown } from "primereact/dropdown";
import { useProductsWithAvailableStock } from "../../products/hooks/useProductsWithAvailableStock";
import { ProductDto } from "../../models/models";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import { farmaciaService } from "../../../Farmacia/js/services/api.service";
import { usePaymentMethods } from "../../payment-methods/hooks/usePaymentMethods";
import { usePRToast } from "../../hooks/usePRToast";
import { Toast } from "primereact/toast";
import { useConvenioRecipe } from "../../convenios/hooks/useConvenioRecipe";
import { thirdPartyService, userService } from "../../../services/api";
import { Dialog } from "primereact/dialog";
import { useTemplate } from "../../hooks/useTemplate";
import { useMassMessaging } from "../../hooks/useMassMessaging";
import { SwalManager } from "../../../services/alertManagerImported";

interface MedicationDelivery {
    product: ProductDto | null;
    product_id: string | null;
    product_name: string;
    product_name_concentration: string;
    quantity: number;
    quantity_to_deliver?: number;
    sale_price: number | null;
    concentration: string;
    identifier: string;
    verification_status?: MedicationVerificationStatus;
    verification_description?: string;
    available_stock?: number;
    unit_price?: number;
}

interface MedicationDeliveryDetailFormInputs {
    medications: MedicationDelivery[];
}

export interface MedicationDeliveryDetailFormData {
    medications: {
        [key: string]: string | null;
    };
}

interface MedicationDeliveryDetailProps {
    deliveryId: string;
    selectedConvenio?: any;
}

interface PaymentMethod {
    id: number;
    name: string;
}

export const MedicationDeliveryDetail = ({ deliveryId, selectedConvenio }: MedicationDeliveryDetailProps) => {

    const [finalPrescription, setFinalPrescription] = useState<any | null>(null);
    const [finalPaymentMethods, setFinalPaymentMethods] = useState<any[]>([]);
    const [finishDialogVisible, setFinishDialogVisible] = useState(false);
    const [responseInvoice, setResponseInvoice] = useState<any>(null);
    const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

    const { prescription, fetchPrescription } = usePrescription();
    const { recipe: convenioRecipe, fetchConvenioRecipe } = useConvenioRecipe();
    const { paymentMethods } = usePaymentMethods();
    const { generateFormat } = useMedicationDeliveryDetailFormat();
    const { result: verifyMedicationsBulkResult, verifyMedicationsBulk } = useVerifyMedicationsBulk();
    const { productsWithAvailableStock, fetchProductsWithAvailableStock } = useProductsWithAvailableStock();
    const { toast, showSuccessToast, showServerErrorsToast, showErrorToast } = usePRToast();

    const tenant = window.location.hostname.split(".")[0];
    const templateData = {
        tenantId: tenant,
        belongsTo: "facturacion-creacion",
        type: "whatsapp",
    };

    const { template, fetchTemplate } = useTemplate(templateData);
    const { sendMessage: sendMessageHook, loading: loadingMessage } =
        useMassMessaging();

    const sendMessage = useRef(sendMessageHook);
    useEffect(() => {
        sendMessage.current = sendMessageHook;
    }, [sendMessageHook]);

    const handleSendWhatsApp = async () => {
        setSendingWhatsApp(true);
        try {
            await sendMessageWhatsapp(responseInvoice);
        } catch (error) {
            console.error("Error enviando WhatsApp:", error);
        } finally {
            setSendingWhatsApp(false);
        }
    };

    async function generatePdfFile(admissionData: any) {
        //@ts-ignore - Esta función debería existir en tu entorno
        await generarFormato(
            "Factura",
            admissionData,
            "Impresion",
            "admissionInput"
        );
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let fileInput: any = document.getElementById(
                    "pdf-input-hidden-to-admissionInput"
                );
                let file = fileInput?.files[0];

                if (!file) {
                    resolve(null);
                    return;
                }

                let formData = new FormData();
                formData.append("file", file);
                formData.append("model_type", "App\\Models\\Admission");
                formData.append("model_id", admissionData.admission_data.id);
                //@ts-ignore - Esta función debería existir en tu entorno
                guardarArchivo(formData, true)
                    .then((response: any) => {
                        resolve(response.file);
                    })
                    .catch(reject);
            }, 1000);
        });
    }

    const sendMessageWhatsapp = useCallback(
        async (admissionData: any) => {
            try {
                // Generar el PDF primero
                // @ts-ignore
                const dataToFile: any = await generatePdfFile(admissionData.invoice);
                //@ts-ignore - Esta función debería existir en tu entorno
                const urlPDF = getUrlImage(
                    dataToFile.file_url.replaceAll("\\", "/"),
                    true
                );

                if (!template) {
                    await fetchTemplate();
                }

                const replacements = {
                    NOMBRE_PACIENTE: `${finalPrescription.patient.first_name ?? ""
                        } ${finalPrescription.patient.middle_name ?? ""} ${finalPrescription.patient.last_name ?? ""
                        } ${finalPrescription.patient.second_last_name ?? ""}`,
                    NUMERO_FACTURA:
                        admissionData.invoice.invoice_code ||
                        admissionData.invoice.invoice_reminder,
                    FECHA_FACTURA: formatDate(
                        admissionData.invoice.created_at
                    ),
                    MONTO_FACTURADO:
                        "$" + admissionData.invoice.total_amount.toFixed(2),
                    "ENLACE DOCUMENTO": "",
                };

                const templateFormatted = formatWhatsAppMessage(
                    template?.template || "",
                    replacements
                );

                const dataMessage = {
                    channel: "whatsapp",
                    recipients: [
                        getIndicativeByCountry(finalPrescription.patient.country) +
                        finalPrescription.patient.whatsapp,
                    ],
                    message_type: "media",
                    message: templateFormatted,
                    attachment_url: urlPDF,
                    attachment_type: "document",
                    minio_model_type: dataToFile?.model_type,
                    minio_model_id: dataToFile?.model_id,
                    minio_id: dataToFile?.id,
                    webhook_url: "https://example.com/webhook",
                };

                await sendMessage.current(dataMessage);

                SwalManager.success({
                    text: "Mensaje enviado correctamente",
                    title: "Éxito",
                });
            } catch (error) {
                console.error("Error enviando mensaje por WhatsApp:", error);
                SwalManager.error({
                    text: "Error al enviar el mensaje por WhatsApp",
                    title: "Error",
                });
            }
        },
        [template, responseInvoice, finalPrescription, sendMessage]
    );

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<MedicationDeliveryDetailFormInputs>({
        defaultValues: {
            medications: [],
        },
    });

    const { fields, append: appendMedication, remove: removeMedication, update: updateMedication } = useFieldArray({
        control,
        name: "medications",
        rules: {
            required: true,
            validate: (value) => {
                if (value.length === 0) {
                    return "Debe seleccionar al menos un deposito";
                }
                return true;
            }
        }
    });

    const medications = useWatch({
        control,
        name: "medications"
    });

    const [medicationPrescriptionManager, setMedicationPrescriptionManager] = useState<MedicationPrescriptionManager | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    console.log("medications", medications)

    // Calcular productos verificados para entrega
    const verifiedProductsForDelivery = medications.filter(med =>
        med.quantity_to_deliver && med.quantity_to_deliver > 0 && med.product_id && med.sale_price
    );

    // Calcular total
    const totalAmount = verifiedProductsForDelivery.reduce((total, med) => {
        return total + (med.sale_price || 0) * (med.quantity_to_deliver || 0);
    }, 0);

    useEffect(() => {
        fetchProductsWithAvailableStock("Medicamentos", "pharmacy");
    }, []);

    useEffect(() => {
        if (paymentMethods.length > 0) {
            const paymentMethodsMapped = paymentMethods.filter((paymentMethod: any) => paymentMethod.category === "transactional" && paymentMethod.payment_type === "sale");
            setFinalPaymentMethods(paymentMethodsMapped);
        }
    }, [paymentMethods]);

    useEffect(() => {
        console.log("selectedConvenio", selectedConvenio)
        if (selectedConvenio) {
            fetchConvenioRecipe(deliveryId, {
                tenantId: selectedConvenio.tenant_b_id,
                apiKey: selectedConvenio.api_keys.find((apiKey: any) => apiKey.module === "farmacia").key,
                module: "farmacia"
            });
            return
        }
        fetchPrescription(deliveryId);
    }, [deliveryId, selectedConvenio]);

    useEffect(() => {
        if (selectedConvenio) {
            setFinalPrescription(convenioRecipe);
            return
        }
        setFinalPrescription(prescription);
    }, [prescription, convenioRecipe]);

    useEffect(() => {
        if (finalPrescription) {
            setMedicationPrescriptionManager(new MedicationPrescriptionManager(finalPrescription));
        }
    }, [finalPrescription]);

    useEffect(() => {
        setValue("medications", []);
        if (medicationPrescriptionManager && medicationPrescriptionManager.products.length > 0) {
            appendMedication(medicationPrescriptionManager.products.map((product) => ({
                product: null,
                identifier: generateUUID(),
                product_id: product.id.toString(),
                product_name: product.medication,
                product_name_concentration: product.medication + " " + product.concentration,
                quantity: product.quantity,
                sale_price: null,
                concentration: product.concentration,
                verified: false
            })));
        }
    }, [medicationPrescriptionManager]);

    useEffect(() => {
        if (medicationPrescriptionManager && medicationPrescriptionManager.products.length > 0) {
            const initialMedications = medicationPrescriptionManager.products.map((product) => ({
                product: null,
                identifier: generateUUID(),
                product_id: product.id.toString(),
                product_name: product.medication,
                product_name_concentration: product.medication + " " + product.concentration,
                quantity: product.quantity,
                sale_price: null,
                concentration: product.concentration,
                verified: false
            }));

            setValue("medications", initialMedications);

            if (initialMedications.length > 0) {
                verifyMedicationsBulk(initialMedications.map((medication) => ({
                    identifier: medication.identifier,
                    name: medication.product_name,
                    concentration: medication.concentration,
                    quantity_to_verify: medication.quantity
                })));
            }
        }
    }, [medicationPrescriptionManager]);

    useEffect(() => {
        if (verifyMedicationsBulkResult) {
            console.log(verifyMedicationsBulkResult);
            medications.forEach((medication) => {
                const productResult = verifyMedicationsBulkResult[medication.identifier];
                updateMedication(medications.indexOf(medication) || 0, {
                    ...medication,
                    product_id: productResult.product?.id || null,
                    sale_price: productResult.product?.sale_price || 0,
                    verification_description: getVerificationDescription(productResult),
                    verification_status: productResult.status,
                    available_stock: productResult.available_stock,
                    quantity_to_deliver: Math.min(productResult.available_stock, medication.quantity)
                });
            });
        }
    }, [verifyMedicationsBulkResult]);

    const getVerificationDescription = (medicationVerification: MedicationVerification) => {
        switch (medicationVerification.status) {
            case 'PRODUCT_NOT_FOUND':
                return 'No ha sido posible identificar el medicamento. Por favor verifique el producto manualmente.';
            case 'STOCK_NOT_ENOUGH':
                return 'No hay stock suficiente para la cantidad solicitada. Solo hay ' + medicationVerification.available_stock + ' unidades disponibles. Si desea hacer una entrega parcial, por favor ingrese la cantidad a entregar.';
            default:
                return medicationVerification.message;
        }
    };

    const handlePrint = () => {
        if (!finalPrescription || !medicationPrescriptionManager) return;
        generateFormat({
            prescription: finalPrescription,
            prescriptionManager: medicationPrescriptionManager,
            type: 'Impresion'
        });
    };

    const getFormErrorMessage = (name: keyof MedicationDeliveryDetailFormInputs) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message || errors[name].root?.message}</small>
            )
        );
    };

    const handleReload = () => {
        if (medications.length > 0) {
            verifyMedicationsBulk(medications.map((medication) => ({
                identifier: medication.identifier,
                name: medication.product_name,
                concentration: medication.concentration,
                quantity_to_verify: medication.quantity
            })));
        }
    };

    const handleSubmitDelivery = async () => {
        try {
            setProcessing(true);

            if (!verifiedProductsForDelivery || verifiedProductsForDelivery.length === 0) {
                showServerErrorsToast({
                    title: "Advertencia",
                    errors: {
                        message: "No hay productos verificados para entregar. Por favor, verifique las cantidades a entregar."
                    }
                });
                return;
            }

            if (!finalPrescription) {
                showErrorToast({
                    title: "Advertencia",
                    message: "No se ha seleccionado una receta."
                });
                return;
            }

            if (!selectedPaymentMethod) {
                showErrorToast({
                    title: "Advertencia",
                    message: "Debe seleccionar un método de pago."
                });
                return;
            }

            // 1. Preparar productos a entregar
            const productPayload = verifiedProductsForDelivery.map(prod => ({
                id: parseInt(prod.product_id!),
                quantity: prod.quantity_to_deliver || 0
            }));

            const payload = {
                recipe_id: finalPrescription.id,
                products: productPayload,
            };

            // 2. Enviar solicitud de entrega
            const deliveryResult = await farmaciaService.completeDelivery(payload);

            if (deliveryResult.status == "DELIVERED") {
                await farmaciaService.changeStatus("DELIVERED", finalPrescription.id);
            }

            if (deliveryResult.status !== "DELIVERED" && deliveryResult.status !== "PARTIALLY_DELIVERED") {
                showErrorToast({
                    title: "Advertencia",
                    message: "No se pudo completar la entrega."
                });
                return;
            }

            // 3. Mostrar advertencias si hubo productos sin stock
            let outOfStockIds: number[] = [];
            if (Array.isArray(deliveryResult.products) && deliveryResult.products.length > 0) {
                const outOfStockMessages = deliveryResult.products
                    .filter((p: any) => p.status === "OUT_OF_STOCK")
                    .map((p: any) => {
                        outOfStockIds.push(parseInt(p.id));
                        return p.message;
                    })
                    .join("<br>");

                if (outOfStockMessages) {
                    showErrorToast({
                        title: "Entrega parcial",
                        message: `Algunos productos no fueron entregados: ${outOfStockMessages}`
                    });
                }
            }

            // 4. Construir invoice_detail solo con productos entregados
            const invoice_detail = verifiedProductsForDelivery
                .filter(prod => !outOfStockIds.includes(parseInt(prod.product_id!)))
                .map(prod => ({
                    product_id: parseInt(prod.product_id!),
                    deposit_id: 1,
                    quantity: prod.quantity_to_deliver || 1,
                    unit_price: prod.sale_price || 0,
                    discount: 0,
                    type_product: "medications",
                }));

            // Si no quedó ningún producto para facturar
            if (invoice_detail.length === 0) {
                showErrorToast({
                    title: "Sin factura",
                    message: "Ningún producto fue entregado, no se generó la factura."
                });
                return;
            }

            // 5. Construir invoice
            const { data: billing } = await farmaciaService.getBillingByType("consumer");

            const thirdParty = await thirdPartyService.verifyAndStore({
                type: 'client',
                name: `${finalPrescription.patient.first_name || ''} ${finalPrescription.patient.middle_name || ''} ${finalPrescription.patient.last_name || ''} ${finalPrescription.patient.second_last_name || ''}`,
                external_id: finalPrescription.patient.id.toString(),
                document_type: finalPrescription.patient.document_type,
                document_number: finalPrescription.patient.document_number,
                email: finalPrescription.patient.email,
                phone: finalPrescription.patient.whatsapp,
                address: finalPrescription.patient.address,
                first_name: finalPrescription.patient.first_name,
                middle_name: finalPrescription.patient.middle_name,
                last_name: finalPrescription.patient.last_name,
                second_last_name: finalPrescription.patient.second_last_name,
                date_of_birth: finalPrescription.patient.date_of_birth,
                tax_type: null,
                agreement_id: selectedConvenio?.destination_name,
            })

            const invoice = {
                type: "sale",
                user_id: getJWTPayload().sub,
                due_date: new Date().toISOString(),
                observations: `Factura de compra ${finalPrescription.id}`,
                payment_method_id: selectedPaymentMethod,
                sub_type: "pharmacy",
                third_party_id: thirdParty.id,
                billing: billing,
                agreement_patient_id: finalPrescription.patient.id,
                agreement_id: selectedConvenio?.destination_name,
            };

            // 6. Construir payments
            const payments = [
                {
                    payment_method_id: selectedPaymentMethod,
                    payment_date: new Date().toISOString(),
                    amount: totalAmount,
                    notes: `Pago de receta ${finalPrescription.id}`,
                },
            ];

            // 7. Enviar factura
            const facturaPayload = {
                invoice,
                invoice_detail,
                payments,
            };

            const facturaResult = await farmaciaService.createInvoice(facturaPayload);

            setResponseInvoice(facturaResult);
            await sendMessageWhatsapp(facturaResult);
            setFinishDialogVisible(true);

            // 8. Mensaje final
            const finalMessage =
                deliveryResult.status === "PARTIALLY_DELIVERED"
                    ? "Entrega parcial registrada. Se facturaron los productos disponibles."
                    : "La entrega y factura fueron registradas correctamente.";

            showSuccessToast({
                title: "Éxito",
                message: finalMessage
            });

            // Limpiar estado
            setSelectedPaymentMethod(null);
            setDeliveryNotes('');
            fetchProductsWithAvailableStock("Medicamentos", "pharmacy");
            fetchPrescription(finalPrescription?.id);

        } catch (error) {
            console.error("Error al entregar pedido:", error);
            showServerErrorsToast(error);
        } finally {
            setProcessing(false);
        }
    };

    const onSubmit = (data: MedicationDeliveryDetailFormInputs) => {
        // Verificar que haya productos para entregar
        const hasProductsToDeliver = medications.some(med =>
            med.quantity_to_deliver && med.quantity_to_deliver > 0
        );

        if (!hasProductsToDeliver) {
            showErrorToast({
                title: "Advertencia",
                message: "No hay productos verificados para entregar. Por favor, verifique las cantidades a entregar."
            });
            return;
        }

        handleSubmitDelivery();
    };

    const getDeliveryStatusBadges = (deposit: MedicationDelivery) => {
        const quantityToDeliver = deposit.quantity_to_deliver ?? 0;

        if (quantityToDeliver === 0) {
            return <span className="badge text-bg-danger">No se puede entregar</span>;
        }

        if (quantityToDeliver === deposit.quantity) {
            return <span className="badge text-bg-primary">Entrega completa. Se entregara: {quantityToDeliver} unidades</span>;
        }

        if (quantityToDeliver > 0 && quantityToDeliver < deposit.quantity) {
            return <span className="badge text-bg-warning">Entrega Parcial. Se entregara: {quantityToDeliver} unidades</span>;
        }

        return null;
    };

    const delivered = () => {
        return ["DELIVERED"].includes(finalPrescription?.status || '')
    }

    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                        <b>Receta #{finalPrescription?.id}</b>
                        <Tag
                            value={medicationPrescriptionManager?.statusLabel}
                            severity={medicationPrescriptionManager?.statusSeverity}
                            className="fs-6"
                        />
                    </div>
                    <p>Creado: {formatDateDMY(finalPrescription?.created_at)}</p>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Información del paciente</h6>

                                    <div className="mb-2">
                                        <strong>Nombre: </strong>
                                        <span>{medicationPrescriptionManager?.patient?.name || '--'}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Correo electrónico: </strong>
                                        <span>{medicationPrescriptionManager?.patient?.email || '--'}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Teléfono: </strong>
                                        <span>{medicationPrescriptionManager?.patient?.phone || '--'}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Dirección: </strong>
                                        <span>{medicationPrescriptionManager?.patient?.address || '--'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Médico Prescriptor</h6>

                                    <div className="mb-2">
                                        <strong>Nombre: </strong>
                                        <span>{`${medicationPrescriptionManager?.prescriber?.name || '--'}`}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Correo electrónico: </strong>
                                        <span>{medicationPrescriptionManager?.prescriber?.email || '--'}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Teléfono: </strong>
                                        <span>{medicationPrescriptionManager?.prescriber?.phone || '--'}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Dirección: </strong>
                                        <span>{medicationPrescriptionManager?.prescriber?.address || '--'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!delivered() && (
                        <CustomPRTable
                            data={medications}
                            columns={[
                                { field: 'product_name_concentration', header: 'Medicamentos' },
                                { field: 'quantity', header: 'Cantidad' },
                                {
                                    field: 'sale_price', header: 'Precio', body: (deposit: MedicationDelivery) => deposit.sale_price?.currency()
                                },
                                {
                                    field: 'status', header: 'Estado', body: (deposit: MedicationDelivery) => <>
                                        <div className="mb-2">
                                            {getDeliveryStatusBadges(deposit)}
                                        </div>
                                        <div className="mb-3">
                                            {deposit.verification_description || "--"}
                                        </div>
                                        {deposit.verification_status === 'STOCK_NOT_ENOUGH' && <>
                                            <div className="d-flex flex-column gap-2">
                                                <label htmlFor="quantity" className="form-label">Cantidad a entregar</label>
                                                <InputNumber
                                                    value={deposit.quantity_to_deliver}
                                                    max={deposit.available_stock}
                                                    min={1}
                                                    onValueChange={(e) => {
                                                        console.log(e.value, deposit.available_stock)
                                                        if (e.value && deposit.available_stock && e.value > deposit.available_stock) {
                                                            updateMedication(medications.indexOf(deposit) || 0, { ...deposit, quantity_to_deliver: deposit.available_stock });
                                                        } else {
                                                            updateMedication(medications.indexOf(deposit) || 0, { ...deposit, quantity_to_deliver: e.value || 0 });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </>}
                                        {deposit.verification_status === 'PRODUCT_NOT_FOUND' && <>
                                            <Dropdown
                                                options={productsWithAvailableStock}
                                                optionLabel="name"
                                                value={deposit.product}
                                                onChange={(e) => {
                                                    if (e.value) {
                                                        console.log(e.value)
                                                        updateMedication(
                                                            medications.indexOf(deposit) || 0,
                                                            {
                                                                ...deposit,
                                                                product: e.value,
                                                                product_id: e.value.id,
                                                                sale_price: e.value.sale_price,
                                                                quantity_to_deliver: Math.min(e.value.pharmacy_product_stock, deposit.quantity)
                                                            }
                                                        );
                                                    } else {
                                                        updateMedication(
                                                            medications.indexOf(deposit) || 0,
                                                            {
                                                                ...deposit,
                                                                product: null,
                                                                product_id: null,
                                                                sale_price: 0,
                                                                quantity_to_deliver: 0
                                                            }
                                                        );
                                                    }
                                                }}
                                                showClear
                                                filter
                                                placeholder="Seleccione del inventario"
                                                className="w-100"
                                            />

                                            {deposit.product && deposit.product.pharmacy_product_stock < deposit.quantity && <>
                                                <Divider />
                                                <p>
                                                    No hay stock suficiente para la cantidad solicitada. Solo hay {deposit.product.pharmacy_product_stock} unidades disponibles. Si desea hacer una entrega parcial, por favor ingrese la cantidad a entregar.
                                                </p>
                                                <div className="mb-2">
                                                    <label htmlFor="quantity" className="form-label">Cantidad a entregar</label>
                                                    <InputNumber
                                                        value={deposit.quantity_to_deliver}
                                                        max={deposit.available_stock}
                                                        min={1}
                                                        onValueChange={(e) => {
                                                            console.log(e.value, deposit.available_stock)
                                                            if (e.value && deposit.available_stock && e.value > deposit.available_stock) {
                                                                updateMedication(medications.indexOf(deposit) || 0, { ...deposit, quantity_to_deliver: deposit.available_stock });
                                                            } else {
                                                                updateMedication(medications.indexOf(deposit) || 0, { ...deposit, quantity_to_deliver: e.value || 0 });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </>}
                                        </>}
                                    </>
                                }
                            ]}
                            disablePaginator
                            disableSearch
                            onReload={handleReload}
                        />
                    )}

                    {delivered() && (
                        <CustomPRTable
                            data={medications}
                            columns={[
                                { field: 'product_name_concentration', header: 'Medicamentos' },
                                { field: 'quantity', header: 'Cantidad' }
                            ]}
                            disablePaginator
                            disableSearch
                            onReload={handleReload}
                        />
                    )}

                    {getFormErrorMessage("medications")}

                    {/* SECCIÓN DE RESUMEN Y PAGO - Similar al modal PHP */}
                    {!delivered() && (
                        <div className="card mt-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Resumen de Entrega - Pedido #{finalPrescription?.id}</h5>
                            </div>
                            <div className="card-body">
                                {/* Tabla resumen: muestra detalle con precios por unidad, cantidad y subtotal */}
                                <div className="table-responsive mb-3">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Medicamento</th>
                                                <th>Cantidad</th>
                                                <th>Precio unitario</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {verifiedProductsForDelivery.map((med, index) => (
                                                <tr key={med.identifier}>
                                                    <td>{med.product_name_concentration}</td>
                                                    <td>{med.quantity_to_deliver}</td>
                                                    <td>{(med.sale_price || 0).currency()}</td>
                                                    <td>{((med.sale_price || 0) * (med.quantity_to_deliver || 0)).currency()}</td>
                                                </tr>
                                            ))}
                                            {verifiedProductsForDelivery.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-muted">
                                                        No hay productos verificados para entrega
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Total general calculado */}
                                <div className="text-end mb-4">
                                    <h5>Total: <span className="text-primary">{totalAmount.currency()}</span></h5>
                                </div>

                                {/* Select para método de pago */}
                                <div className="mb-3">
                                    <label htmlFor="paymentMethod" className="form-label">Método de pago *</label>
                                    <Dropdown
                                        id="paymentMethod"
                                        value={selectedPaymentMethod}
                                        options={finalPaymentMethods}
                                        onChange={(e) => setSelectedPaymentMethod(e.value)}
                                        optionLabel="method"
                                        optionValue="id"
                                        placeholder="Seleccione un método de pago"
                                        className="w-100"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Notas o comentarios adicionales */}
                                <div className="mb-3">
                                    <label htmlFor="deliveryNotes" className="form-label">Notas de entrega</label>
                                    <InputTextarea
                                        id="deliveryNotes"
                                        value={deliveryNotes}
                                        onChange={(e) => setDeliveryNotes(e.target.value)}
                                        rows={2}
                                        placeholder="Observaciones o comentarios adicionales..."
                                        className="w-100"
                                        disabled={processing}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex gap-2">
                                <div className="d-flex flex-column flex-grow-1">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="fas fa-file-prescription text-primary me-2 fs-4"></i>
                                        <div>
                                            <div className="fw-medium">Receta #{finalPrescription?.id}</div>
                                            <div className="text-muted small">{medicationPrescriptionManager?.patient?.name || '--'} - {formatDateDMY(finalPrescription?.created_at)}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => setDialogVisible(true)}
                                        >
                                            <i className="fas fa-eye me-1"></i> Ver receta
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
                        </div>
                    </div>

                    <div className="text-center py-6 px-4 bg-light rounded-3 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <i className="pi pi-check-circle text-6xl text-success mb-4"></i>
                        <h2 className="mb-3 fw-bold">¡Entrega Generada Exitosamente!</h2>
                        <p className="text-muted mb-4">La entrega ha sido creada y guardada en el sistema.</p>

                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            <Button
                                type="button"
                                label="Enviar por WhatsApp"
                                icon={<i className="fas fa-whatsapp"></i>}
                                className="p-button-success p-button-lg"
                                onClick={handleSendWhatsApp}
                                loading={sendingWhatsApp}
                                disabled={sendingWhatsApp}
                            />

                            <Button
                                type="button"
                                label="Imprimir Factura"
                                className="p-button-primary p-button-lg"
                                icon="pi pi-print"
                                onClick={async () => {
                                    const user = await userService.getLoggedUser();
                                    await generateInvoiceFromInvoice(responseInvoice.invoice, user, finalPrescription?.patient, false);
                                }}
                            />

                            <Button
                                type="button"
                                label="Descargar Factura"
                                icon="pi pi-download"
                                className="p-button-help p-button-lg"
                                onClick={async () => {
                                    const user = await userService.getLoggedUser();
                                    await generateInvoiceFromInvoice(responseInvoice.invoice, user, finalPrescription?.patient, true);
                                }}
                            />

                            <Button
                                type="button"
                                label="Cerrar"
                                className="p-button-secondary p-button-lg"
                                onClick={() => setFinishDialogVisible(false)}
                            />
                        </div>

                        {sendingWhatsApp && (
                            <div className="mt-3 text-sm text-muted">
                                <i className="pi pi-spin pi-spinner mr-2"></i>
                                Enviando mensaje por WhatsApp...
                            </div>
                        )}
                    </div>

                    {!delivered() && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Button
                                type="button"
                                icon="pi pi-times"
                                label="Cancelar"
                                className="p-button-secondary"
                                onClick={() => window.history.back()}
                                disabled={processing}
                            />
                            <Button
                                icon={processing ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                label={processing ? "Procesando..." : "Entregar Pedido"}
                                className="btn btn-primary"
                                type="submit"
                                disabled={processing || verifiedProductsForDelivery.length === 0 || !selectedPaymentMethod}
                            />
                        </div>
                    )}
                </div>

                <MedicationDeliveryDetailDialog
                    visible={dialogVisible}
                    onHide={() => setDialogVisible(false)}
                    prescription={finalPrescription}
                />

            </form>

            <Dialog
                visible={finishDialogVisible}
                onHide={() => setFinishDialogVisible(false)}
            >
                <div className="text-center py-6 px-4 bg-light rounded-3 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <i className="pi pi-check-circle text-6xl text-success mb-4"></i>
                    <h2 className="mb-3 fw-bold">¡Entrega Generada Exitosamente!</h2>
                    <p className="text-muted mb-4">La entrega ha sido creada y guardada en el sistema.</p>

                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Button
                            type="button"
                            label="Enviar por WhatsApp"
                            icon={<i className="fas fa-whatsapp"></i>}
                            className="p-button-success p-button-lg"
                            onClick={handleSendWhatsApp}
                            loading={sendingWhatsApp}
                            disabled={sendingWhatsApp}
                        />

                        <Button
                            type="button"
                            label="Imprimir Factura"
                            className="p-button-primary p-button-lg"
                            icon="pi pi-print"
                            onClick={async () => {
                                const user = await userService.getLoggedUser();
                                await generateInvoiceFromInvoice(responseInvoice.invoice, user, finalPrescription?.patient, false);
                            }}
                        />

                        <Button
                            type="button"
                            label="Descargar Factura"
                            icon="pi pi-download"
                            className="p-button-help p-button-lg"
                            onClick={async () => {
                                const user = await userService.getLoggedUser();
                                await generateInvoiceFromInvoice(responseInvoice.invoice, user, finalPrescription?.patient, true);
                            }}
                        />

                        <Button
                            type="button"
                            label="Cerrar"
                            className="p-button-secondary p-button-lg"
                            onClick={() => setFinishDialogVisible(false)}
                        />
                    </div>

                    {sendingWhatsApp && (
                        <div className="mt-3 text-sm text-muted">
                            <i className="pi pi-spin pi-spinner mr-2"></i>
                            Enviando mensaje por WhatsApp...
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    );
};