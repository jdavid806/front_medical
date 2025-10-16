import React from "react";
import { LabplusIntegrationConfig } from "./forms/LabplusIntegrationConfig";
import { IntegrationsTabs } from "./components/IntegrationsTabs";
import { useIntegrationConfigs } from "./hooks/useIntegrationConfigs";
import { DGIIIntegrationConfig } from "./forms/DGIIIntegrationConfig";
import { SISPROIntegrationConfig } from "./forms/SISPROIntegrationConfig";
import { OpenAIIntegrationConfig } from "./forms/OpenAIIntegrationConfig";
import { CarnetIntegrationConfig } from "./forms/CarnetIntegrationConfig";
import { GeminiIntegrationConfig } from "./forms/GeminiIntegrationConfig";

export const IntegrationsApp = () => {

    const { configs } = useIntegrationConfigs();

    const tabs = [
        {
            id: "labplus-tab",
            label: "Labplus",
            icon: "fa-solid fa-plus",
            content: <LabplusIntegrationConfig configs={configs} />
        },
        {
            id: "dgii-tab",
            label: "DGII",
            icon: "fa-solid fa-file-invoice",
            content: <DGIIIntegrationConfig configs={configs} />
        },
        {
            id: "sispro-tab",
            label: "SISPRO",
            icon: "fa-solid fa-address-book",
            content: <SISPROIntegrationConfig configs={configs} />
        },
        {
            id: "carnet-tab",
            label: "Carnet",
            icon: "fa-solid fa-envelopes-bulk",
            content: <CarnetIntegrationConfig configs={configs} />
        },
        {
            id: "openai-tab",
            label: "OpenAI",
            icon: "fa-solid fa-brain",
            content: <OpenAIIntegrationConfig configs={configs} />
        },
        {
            id: "gemini-tab",
            label: "Gemini",
            icon: "fa-solid fa-brain",
            content: <GeminiIntegrationConfig configs={configs} />
        }
    ];

    return (
        <>
            <IntegrationsTabs tabs={tabs} />
        </>
    );
};