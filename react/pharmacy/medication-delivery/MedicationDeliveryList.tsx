import React, { useEffect, useRef, useState } from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { formatDateDMY } from "../../../services/utilidades";
import { useAllRecipes } from "./hooks/useAllRecipes";
import { MedicationPrescriptionManager } from "./helpers/MedicationPrescriptionManager";
import { PrescriptionDto } from "../../models/models";
import { MenuItem } from "primereact/menuitem";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useActiveTenantConvenios } from "../../convenios/hooks/useActiveTenantConvenios";
import { useConvenioRecipes } from "../../convenios/hooks/useConvenioRecipes";

interface MedicationDeliveryListProps {
    onDeliverySelect: (delivery: PrescriptionDto) => void;
    onDeliverySelectConvenio: (delivery: PrescriptionDto) => void;
}

export const MedicationDeliveryList = ({ onDeliverySelect, onDeliverySelectConvenio }: MedicationDeliveryListProps) => {

    const { fetchAllRecipes, recipes } = useAllRecipes();
    const { convenios } = useActiveTenantConvenios();
    const { fetchConvenioRecipes, recipes: convenioRecipes } = useConvenioRecipes();

    const [search, setSearch] = useState('');
    const [selectedConvenio, setSelectedConvenio] = useState<any>(null);

    const statusItems: MenuItem[] = [
        { label: 'Todos', command: () => fetchRecipes("ALL") },
        { label: 'Pendiente', command: () => fetchRecipes("PENDING") },
        { label: 'Entregado', command: () => fetchRecipes("DELIVERED") },
    ];

    const statusMenu = useRef<Menu>(null);

    const finalRecipes = selectedConvenio ? convenioRecipes : recipes;

    // useEffect(() => {
    //     fetchRecipes("PENDING");
    // }, [selectedConvenio]);

    const fetchRecipes = (status: string) => {
        if (search.length < 3) {
            return;
        }
        if (!selectedConvenio) {
            fetchAllRecipes(status, search);
        } else {
            fetchConvenioRecipes({
                tenantId: selectedConvenio.tenant_b_id,
                apiKey: selectedConvenio.api_keys.find((apiKey: any) => apiKey.module === "farmacia").key,
                module: "farmacia",
                search,
                status
            });
        }
    };

    useEffect(() => {
        fetchRecipes("PENDING");
    }, [search]);

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center mb-3">
                <Button
                    icon={<i className="fa fa-filter me-2"></i>}
                    label="Filtrar por estado"
                    onClick={(event) => statusMenu.current?.toggle(event)}
                    className="btn btn-sm btn-outline-secondary"
                />
                <Menu model={statusItems} popup ref={statusMenu} />
            </div>

            <div className="mb-3">
                <Dropdown
                    inputId="convenio"
                    options={convenios}
                    optionLabel="label"
                    filter
                    showClear
                    placeholder="Convenio"
                    className="w-100"
                    value={selectedConvenio}
                    onChange={(e) => {
                        console.log(e.value)
                        setSelectedConvenio(e.value)
                        onDeliverySelectConvenio(e.value)
                    }}
                />
            </div>

            <div className="input-group mb-2">
                <InputText
                    placeholder="Buscar por # o nombre..."
                    id="searchOrder"
                    className="w-100"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Divider className="my-2" />

            <div className="d-flex flex-column gap-4">
                {finalRecipes.map((recipe) => {
                    const manager = new MedicationPrescriptionManager(recipe);

                    return (
                        <div
                            key={recipe.id}
                            className="card shadow-sm border-0 cursor-pointer hover-shadow"
                            onClick={() => onDeliverySelect(recipe)}
                            style={{
                                transition: 'all 0.2s ease',
                                borderRadius: '8px'
                            }}
                        >
                            <div className="card-body p-3">
                                {/* Header con número de solicitud y estado */}
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <h6 className="card-title mb-0 fw-bold text-primary">
                                            Receta #{recipe.id}
                                        </h6>
                                        <span
                                            className={`badge fs-7 bg-${manager.statusSeverity}`}
                                            style={{ fontSize: '0.7rem' }}
                                        >
                                            {manager.statusLabel}
                                        </span>
                                    </div>
                                    <div>
                                        <small className="text-muted fw-medium">
                                            {formatDateDMY(recipe.created_at)}
                                        </small>
                                    </div>
                                </div>

                                {/* Información adicional */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3">
                                        <div className="d-flex align-items-center gap-1">
                                            <small className="fw-semibold text-muted fs-7">
                                                Paciente:
                                            </small>
                                            <small className="text-dark fs-7">
                                                {manager?.prescriber?.name || '--'}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <style>{`
                .hover-shadow:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    transform: translateY(-2px);
                }
                .min-width-fit {
                    min-width: 110px;
                }
                .fs-7 {
                    font-size: 0.875rem !important;
                }
                .fs-9 {
                    font-size: 0.75rem !important;
                }
                .lh-sm {
                    line-height: 1.4 !important;
                }
            `}</style>
        </>
    );
};