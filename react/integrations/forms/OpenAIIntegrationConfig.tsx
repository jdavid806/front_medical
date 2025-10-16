import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm";
import { IntegrationConfigFormProps } from "../interfaces";

export const OpenAIIntegrationConfig = (props: IntegrationConfigFormProps) => {

    const { configs = [] } = props;

    const initialConfigFields = [
        {
            configKey: "OPENAI_API_KEY",
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
