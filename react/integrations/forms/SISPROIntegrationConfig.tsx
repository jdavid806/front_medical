import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm";
import { IntegrationConfigFormProps } from "../interfaces";

export const SISPROIntegrationConfig = (props: IntegrationConfigFormProps) => {

    const { configs = [] } = props;

    const initialConfigFields = [
        {
            configKey: "SISPRO_ID_TYPE",
            field: "id_type",
            label: "Tipo de identificación",
            type: "list",
            source: "SISPRO_ID_TYPE",
            sourceType: "static",
            multiple: false,
            placeholder: "Seleccione un tipo de identificación",
        },
        {
            configKey: "SISPRO_ID",
            field: "id",
            label: "Identificación",
            type: "text",
            placeholder: "Ingrese la identificación"
        },
        {
            configKey: "SISPRO_USERNAME",
            field: "username",
            label: "Nombre de usuario",
            type: "text",
            placeholder: "Ingrese el nombre de usuario"
        },
        {
            configKey: "SISPRO_PASSWORD",
            field: "password",
            label: "Contraseña",
            type: "password",
            placeholder: "Ingrese la contraseña"
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
