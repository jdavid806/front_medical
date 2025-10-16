import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm";
import { IntegrationConfigFormProps } from "../interfaces";

export const GeminiIntegrationConfig = (props: IntegrationConfigFormProps) => {

    const { configs = [] } = props;

    const initialConfigFields = [
        {
            configKey: "GEMINI_API_KEY",
            field: "api_key",
            label: "API Key",
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
