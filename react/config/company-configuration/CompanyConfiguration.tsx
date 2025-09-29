import React, { useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Company, WhatsAppStatus } from './types/consultorio';
import GeneralInfoTab from './components/GeneralInfoTab';
import CommunicationsTab from './components/CommunicationsTab';
import BranchesTab from './components/BranchesTab';
import RepresentativeTab from './components/RepresentativeTab';
import { useCompanyGeneral } from './hooks/useCompanyGeneral';
import { Button } from 'primereact/button';

export const CompanyConfiguration: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [whatsAppStatus, setWhatsAppStatus] = useState<WhatsAppStatus>({ connected: false });

    const { company, loading, error, refetch } = useCompanyGeneral();

    const handleCompanyUpdate = (updatedCompany: Company) => {
        refetch();
    };

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <ProgressSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid">
                <Message
                    severity="error"
                    text={error}
                    className="my-3"
                />
                <Button
                    label="Reintentar"
                    icon="pi pi-refresh"
                    onClick={refetch}
                />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row gx-3 gy-4 mb-5">
                <Card className="p-3">
                    <TabView
                        activeIndex={activeIndex}
                        onTabChange={(e) => setActiveIndex(e.index)}
                        className="company-config-tabs"
                    >
                        <TabPanel header={
                            <div className="flex align-items-center gap-2">
                                <i className="fa-solid fa-circle-info"></i>
                                <span>Información General</span>
                            </div>
                        }>
                            <GeneralInfoTab
                                company={company}
                                onUpdate={handleCompanyUpdate}
                            />
                        </TabPanel>

                        <TabPanel header={
                            <div className="flex align-items-center gap-2">
                                <i className="fa-solid fa-address-book"></i>
                                <span>Representante</span>
                            </div>
                        }>
                            <RepresentativeTab companyId={company?.id} />
                        </TabPanel>

                        <TabPanel header={
                            <div className="flex align-items-center gap-2">
                                <i className="fa-solid fa-envelopes-bulk"></i>
                                <span>Comunicaciones</span>
                            </div>
                        }>
                            <CommunicationsTab
                                whatsAppStatus={whatsAppStatus}
                                onStatusChange={setWhatsAppStatus}
                            />
                        </TabPanel>

                        <TabPanel header={
                            <div className="flex align-items-center gap-2">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>Sedes</span>
                            </div>
                        }>
                            <BranchesTab companyId={company?.id} />
                        </TabPanel>
                    </TabView>
                </Card>
            </div>
        </div>
    );
};