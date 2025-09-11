import React, { useRef } from "react";
import { Toast } from "primereact/toast";

export const usePRToast = () => {
    const toast = useRef<Toast>(null);

    const showSuccessToast = ({
        title,
        message,
    }: {
        title?: string;
        message?: string;
    } = {}) => {
        toast.current?.show({
            severity: "success",
            summary: title || "Éxito",
            detail: message || "Operación exitosa",
        });
    };

    const showErrorToast = ({
        title,
        message,
    }: {
        title?: string;
        message?: string;
    } = {}) => {
        toast.current?.show({
            severity: "error",
            summary: title || "Error",
            detail: message || "Operación fallida",
        });
    };

    const showFormErrorsToast = ({
        title,
        errors,
    }: {
        title?: string;
        errors: any;
    }) => {
        toast.current?.show({
            severity: "error",
            summary: title || "Errores de validación",
            content: (props) => (
                <div className="text-start">
                    <h3>{props.message.summary}</h3>
                    {Object.entries(errors).map(([field, messages]) => (
                        <div className="mb-2">
                            <ul className="mb-0 mt-1 ps-3">
                                {(messages as string[]).map((msg) => (
                                    <li>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ),
        });
    };

    const showServerErrorsToast = (errors: any) => {
        if (errors.data?.errors) {
            showFormErrorsToast({
                errors: errors.data.errors,
            });
        } else {
            showErrorToast({
                message: errors.data.error || errors.message || 'Ocurrió un error inesperado'
            });
        }
    };

    return {
        toast,
        showSuccessToast,
        showErrorToast,
        showFormErrorsToast,
        showServerErrorsToast,
    };
};  