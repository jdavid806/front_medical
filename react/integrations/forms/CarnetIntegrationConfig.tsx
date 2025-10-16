import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm";
import { IntegrationConfigFormProps } from "../interfaces";

export const CarnetIntegrationConfig = (props: IntegrationConfigFormProps) => {

    const { configs = [] } = props;

    const initialConfigFields = [
        {
            configKey: "CARNET_USERNAME",
            field: "user",
            label: "Usuario",
            type: "text"
        },
        {
            configKey: "CARNET_CLIENT_ID",
            field: "client_id",
            label: "Identificación del cliente",
            type: "text"
        },
        {
            configKey: "CARNET_API_KEY",
            field: "api_key",
            label: "API Key",
            type: "text"
        },
        {
            configKey: "CARNET_API_SECRET",
            field: "api_secret",
            label: "API Secret",
            type: "text"
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
