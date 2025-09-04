import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm";
import { IntegrationConfigFormProps, ConfigFieldI } from "../interfaces";

export const DGIIIntegrationConfig = (props: IntegrationConfigFormProps) => {

    const { configs = [] } = props;

    const initialConfigFields: ConfigFieldI[] = [
        {
            configKey: "DGII_FILE",
            field: "file",
            label: "Certificado P12",
            type: "file",
            description: "Certificado P12 del DGII"
        },
        {
            configKey: "DGII_PASSWORD",
            field: "password",
            label: "Contraseña",
            type: "password",
            description: "Contraseña del certificado P12"
        },
        {
            configKey: "DGII_TENANTS",
            field: "tenants",
            label: "Tenants",
            type: "list",
            source: "DGII_TENANTS",
            sourceType: "static",
            multiple: false,
            placeholder: "Seleccione un tenant",
        },
        {
            configKey: "DGII_USERS",
            field: "users",
            label: "Usuarios",
            type: "list",
            source: "USERS",
            sourceType: "api",
            multiple: true,
            placeholder: "Seleccione un usuario"
        }
    ];

    const handleSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <>
            <DynamicIntegrationForm
                configs={configs}
                initialConfigFields={initialConfigFields}
                onSubmit={handleSubmit}
            />
        </>
    );
};
