import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm";
import { IntegrationConfigFormProps } from "../interfaces";

export const LabplusIntegrationConfig = (props: IntegrationConfigFormProps) => {

    const { configs = [] } = props;

    const initialConfigFields = [
        {
            configKey: "LABPLUS_URL",
            field: "url",
            label: "URL",
            type: "text"
        },
        {
            configKey: "LABPLUS_TOKEN",
            field: "token",
            label: "Token",
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
