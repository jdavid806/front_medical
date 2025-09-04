import React from "react";
import { LabplusIntegrationConfig } from "./forms/LabplusIntegrationConfig";
import { IntegrationsTabs } from "./components/IntegrationsTabs";
import { useIntegrationConfigs } from "./hooks/useIntegrationConfigs";
import { DGIIIntegrationConfig } from "./forms/DGIIIntegrationConfig";

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
            id: "representante-tab",
            label: "Representante",
            icon: "fa-solid fa-address-book",
            content: <div>Contenido del tab Representante</div>
        },
        {
            id: "comunicacion-tab",
            label: "Comunicaciones",
            icon: "fa-solid fa-envelopes-bulk",
            content: <div>Contenido del tab Comunicaciones</div>
        },
        {
            id: "sedes-tab",
            label: "Sedes",
            icon: "fa-solid fa-location-dot",
            content: <div>Contenido del tab Sedes</div>
        }
    ];

    return (
        <>
            <IntegrationsTabs tabs={tabs} />
        </>
    );
};