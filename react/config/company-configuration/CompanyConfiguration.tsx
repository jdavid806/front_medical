// CompanyConfiguration.tsx
import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Company, WhatsAppStatus } from "./types/consultorio";
import GeneralInfoTab from "./components/GeneralInfoTab";
import CommunicationsTab from "./components/CommunicationsTab";
import BranchesTab from "./components/BranchesTab";
import RepresentativeTab from "./components/RepresentativeTab";
import { useCompanyGeneral } from "./hooks/useCompanyGeneral";
import { Button } from "primereact/button";
import { useTabValidation } from "../general-configuration/hooks/useTabValidation";

interface CompanyConfigurationProps {
  onComplete?: () => void;
}

export const CompanyConfiguration: React.FC<CompanyConfigurationProps> = ({
  onComplete,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [whatsAppStatus, setWhatsAppStatus] = useState<WhatsAppStatus>({
    connected: false,
  });

  const { company, loading, error, refetch } = useCompanyGeneral();
  const { validations, updateValidation, allTabsCompleted, getEnabledTabs } =
    useTabValidation(company);

  const handleCompanyUpdate = (updatedCompany: Company) => {
    console.log("Company updated:", updatedCompany);
    refetch();
    console.log("company:", company);
  };

  const handleTabChange = (index: number) => {
    const enabledTabs = getEnabledTabs();
    if (enabledTabs.includes(index)) {
      setActiveIndex(index);
    }
  };

  const isTabEnabled = (index: number): boolean => {
    return getEnabledTabs().includes(index);
  };

  const getTabHeader = (index: number, icon: string, label: string) => {
    const enabled = isTabEnabled(index);
    const getDisabledReason = () => {
      if (index === 1 && !validations.generalInfo)
        return "Complete Información General primero";
      if (
        index === 2 &&
        (!validations.generalInfo || !validations.representative)
      )
        return "Complete Representante primero";
      if (
        index === 3 &&
        (!validations.generalInfo || !validations.representative)
      )
        return "Complete Representante primero";
      return "Módulo bloqueado";
    };

    return (
      <div
        className={`flex align-items-center gap-2 ${
          !enabled ? "opacity-50" : ""
        }`}
      >
        <i className={icon}></i>
        <span>{label}</span>
        {!enabled && (
          <i
            className="pi pi-lock text-muted ml-2"
            style={{ fontSize: "0.8rem" }}
            title={getDisabledReason()}
          ></i>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <ProgressSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <Message severity="error" text={error} className="my-3" />
        <Button label="Reintentar" icon="pi pi-refresh" onClick={refetch} />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row gx-3 gy-4 mb-5">
        <Card className="p-3">
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => handleTabChange(e.index)}
            className="company-config-tabs"
          >
            <TabPanel
              header={getTabHeader(
                0,
                "fa-solid fa-circle-info",
                "Información General"
              )}
            >
              <GeneralInfoTab
                company={company}
                onUpdate={handleCompanyUpdate}
                onValidationChange={(isValid) =>
                  updateValidation("generalInfo", isValid)
                }
              />
            </TabPanel>

            <TabPanel
              header={getTabHeader(
                1,
                "fa-solid fa-address-book",
                "Representante"
              )}
              disabled={!isTabEnabled(1)}
            >
              <RepresentativeTab
                companyId={company?.id}
                onValidationChange={(isValid) =>
                  updateValidation("representative", isValid)
                }
              />
            </TabPanel>

            <TabPanel
              header={getTabHeader(
                2,
                "fa-solid fa-envelopes-bulk",
                "Comunicaciones"
              )}
              disabled={!isTabEnabled(2)}
            >
              <CommunicationsTab
                whatsAppStatus={whatsAppStatus}
                onStatusChange={setWhatsAppStatus}
              />
            </TabPanel>

            <TabPanel
              header={getTabHeader(3, "fa-solid fa-location-dot", "Sedes")}
              disabled={!isTabEnabled(3)}
            >
              <BranchesTab
                companyId={company?.id}
                onValidationChange={(isValid) =>
                  updateValidation("branches", isValid)
                }
              />
            </TabPanel>
          </TabView>

          {/* Botón para continuar al siguiente módulo */}
          {allTabsCompleted && (
            <div className="mt-4 p-3 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-success">
                    <i className="pi pi-check-circle mr-2"></i>
                    Todos los módulos completados
                  </small>
                </div>
                <Button
                  label="Continuar a Siguiente Módulo"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  className="p-button-success"
                  onClick={onComplete}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
