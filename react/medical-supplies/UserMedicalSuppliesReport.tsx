import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { mockData } from './mockData';
import InventoryService from '../../services/api/classes/inventoryServices';

// Interfaces actualizadas
interface DeliveryDetail {
    delivery_id: number;
    quantity: number;
    deposit_id: number;
    delivery_date: string;
}

interface MedicalSupplyProduct {
    product_id: number;
    product_name: string;
    product_reference: string;
    requested_quantity: number;
    delivered_quantity: number;
    pending_quantity: number;
    status: string;
    delivery_details: DeliveryDetail[];
}

interface MedicalSupply {
    medical_supply_id: number;
    status: string;
    delivery_date: string | null;
    observations: string | null;
    products: MedicalSupplyProduct[];
}

interface ProcedureSupply {
    supply_id: number;
    supply_name: string;
    supply_reference: string;
    quantity: number;
}

interface CompletedProcedure {
    appointment_id: number;
    appointment_date: string;
    product_id: number;
    product_name: string;
    supplies_consumed: ProcedureSupply[];
}

interface ProductDetail {
    product_name: string;
    product_reference: string;
    barcode?: string;
}

interface UserReport {
    user_id: number;
    user_name: string;
    user_email: string;
    user_specialty: string;
    clinical_record: string;
    report_data: {
        delivered_supplies: { [productId: string]: number };
        consumed_supplies: { [productId: string]: number };
        current_balance: { [productId: string]: number };
        product_details: { [productId: string]: ProductDetail };
    };
    detailed_data: {
        medical_supplies: MedicalSupply[];
        completed_procedures: CompletedProcedure[];
    };
}

interface ApiResponse {
    report: UserReport[];
    summary: {
        total_users: number;
        generated_at: string;
    };
}

export const UserSupplyStockReport: React.FC = () => {
    const [reportData, setReportData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            // Reemplaza con tu endpoint real
            const service = new InventoryService();
            const response = await service.usersSuppliesStockReport();
            setReportData(response);
        } catch (err) {
            setError('Error al cargar el reporte');
            console.error('Error fetching report:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case 'entregado': return 'success';
            case 'parcialmente_entregado': return 'warning';
            case 'pendiente': return 'danger';
            default: return 'info';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'entregado': return 'Entregado';
            case 'parcialmente_entregado': return 'Parcialmente Entregado';
            case 'pendiente': return 'Pendiente';
            default: return status;
        }
    };

    const calculateProgress = (delivered: number, requested: number) => {
        return requested > 0 ? (delivered / requested) * 100 : 0;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const UserSummaryCard = ({ user }: { user: UserReport }) => {
        const totalProducts = Object.keys(user.report_data.current_balance).length;
        const positiveBalanceCount = Object.values(user.report_data.current_balance).filter(balance => balance > 0).length;
        const zeroBalanceCount = Object.values(user.report_data.current_balance).filter(balance => balance === 0).length;
        const negativeBalanceCount = Object.values(user.report_data.current_balance).filter(balance => balance < 0).length;

        return (
            <Card className="mb-3 border-0 shadow-sm">
                <div className="row align-items-center">
                    <div className="col-md-3">
                        <h6 className="mb-1 fw-bold text-primary">{user.user_name}</h6>
                        <small className="text-muted">{user.user_specialty}</small>
                        <div className="mt-1">
                            <Badge value={user.clinical_record} severity="info" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex flex-column">
                            <small className="text-muted">Email</small>
                            <span>{user.user_email}</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row text-center">
                            <div className="col-4">
                                <div className="border-end">
                                    <h5 className="mb-0 text-success">{positiveBalanceCount}</h5>
                                    <small className="text-muted">Con Stock</small>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="border-end">
                                    <h5 className="mb-0 text-warning">{zeroBalanceCount}</h5>
                                    <small className="text-muted">Sin Stock</small>
                                </div>
                            </div>
                            <div className="col-4">
                                <h5 className="mb-0 text-danger">{negativeBalanceCount}</h5>
                                <small className="text-muted">Sobregirado</small>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    const ProductBalanceTable = ({ user }: { user: UserReport }) => {
        const products = Object.keys(user.report_data.current_balance).map(productId => {
            const productDetail = user.report_data.product_details[productId];
            return {
                productId,
                productName: productDetail?.product_name || `Producto ${productId}`,
                productReference: productDetail?.product_reference || 'N/A',
                delivered: user.report_data.delivered_supplies[productId] || 0,
                consumed: user.report_data.consumed_supplies[productId] || 0,
                balance: user.report_data.current_balance[productId]
            };
        });

        const balanceBodyTemplate = (rowData: any) => {
            const severity = rowData.balance > 0 ? 'success' : rowData.balance < 0 ? 'danger' : 'warning';
            return <Tag value={rowData.balance} severity={severity} />;
        };

        const productNameBodyTemplate = (rowData: any) => {
            return (
                <div>
                    <div className="fw-semibold">{rowData.productName}</div>
                    <small className="text-muted">Ref: {rowData.productReference}</small>
                </div>
            );
        };

        return (
            <Card className="mb-3" title="Balance de Insumos">
                <DataTable value={products} size="small" className="p-datatable-sm">
                    <Column field="productName" header="Producto" body={productNameBodyTemplate} sortable />
                    <Column field="delivered" header="Entregado" sortable />
                    <Column field="consumed" header="Consumido" sortable />
                    <Column field="balance" header="Saldo" body={balanceBodyTemplate} sortable />
                </DataTable>
            </Card>
        );
    };

    const MedicalSuppliesSection = ({ medicalSupplies }: { medicalSupplies: MedicalSupply[] }) => {
        const productNameBodyTemplate = (rowData: MedicalSupplyProduct) => {
            return (
                <div>
                    <div className="fw-semibold">{rowData.product_name}</div>
                    <small className="text-muted">Ref: {rowData.product_reference}</small>
                </div>
            );
        };

        return (
            <Card className="mb-3" title="Solicitudes de Insumos Médicos">
                <Accordion multiple>
                    {medicalSupplies.map((supply) => (
                        <AccordionTab
                            key={supply.medical_supply_id}
                            header={
                                <div className="d-flex justify-content-between align-items-center w-100">
                                    <span>Solicitud #{supply.medical_supply_id}</span>
                                    <div className="d-flex gap-2">
                                        <Tag
                                            value={getStatusLabel(supply.status)}
                                            severity={getStatusSeverity(supply.status)}
                                        />
                                        {supply.delivery_date && (
                                            <Badge value={formatDate(supply.delivery_date)} />
                                        )}
                                    </div>
                                </div>
                            }
                        >
                            {supply.observations && (
                                <div className="alert alert-warning mb-3">
                                    <strong>Observaciones:</strong> {supply.observations}
                                </div>
                            )}

                            <DataTable value={supply.products} size="small">
                                <Column field="product_name" header="Producto" body={productNameBodyTemplate} />
                                <Column field="requested_quantity" header="Solicitado" />
                                <Column field="delivered_quantity" header="Entregado" />
                                <Column field="pending_quantity" header="Pendiente" />
                                <Column
                                    field="status"
                                    header="Estado"
                                    body={(rowData) => (
                                        <Tag
                                            value={getStatusLabel(rowData.status)}
                                            severity={getStatusSeverity(rowData.status)}
                                        />
                                    )}
                                />
                                <Column
                                    header="Progreso"
                                    body={(rowData) => (
                                        <ProgressBar
                                            value={calculateProgress(rowData.delivered_quantity, rowData.requested_quantity)}
                                            showValue={false}
                                            style={{ height: '6px' }}
                                        />
                                    )}
                                />
                            </DataTable>

                            {/* Detalles de entrega */}
                            <h6 className="mt-3 mb-2">Detalles de Entrega</h6>
                            {supply.products.map((product) => (
                                <div key={product.product_id} className="mb-2">
                                    <small className="text-muted">{product.product_name}:</small>
                                    {product.delivery_details.length > 0 ? (
                                        <DataTable value={product.delivery_details} size="small" className="mt-1">
                                            <Column field="delivery_id" header="ID Entrega" />
                                            <Column field="quantity" header="Cantidad" />
                                            <Column field="deposit_id" header="Depósito" />
                                            <Column
                                                field="delivery_date"
                                                header="Fecha"
                                                body={(rowData) => formatDate(rowData.delivery_date)}
                                            />
                                        </DataTable>
                                    ) : (
                                        <div className="text-center p-2 text-muted">
                                            No hay detalles de entrega
                                        </div>
                                    )}
                                </div>
                            ))}
                        </AccordionTab>
                    ))}
                </Accordion>
            </Card>
        );
    };

    const ProceduresSection = ({ procedures }: { procedures: CompletedProcedure[] }) => {
        const suppliesConsumedBodyTemplate = (rowData: CompletedProcedure) => {
            return (
                <div>
                    {rowData.supplies_consumed.map((supply, idx) => (
                        <div key={idx} className="mb-1">
                            <Badge
                                value={`${supply.supply_name} (${supply.quantity})`}
                                className="me-1"
                                severity="info"
                            />
                            <small className="text-muted">Ref: {supply.supply_reference}</small>
                        </div>
                    ))}
                </div>
            );
        };

        return (
            <Card className="mb-3" title="Procedimientos Completados">
                <DataTable value={procedures} size="small">
                    <Column field="appointment_id" header="ID Cita" />
                    <Column
                        field="appointment_date"
                        header="Fecha"
                        body={(rowData) => formatDate(rowData.appointment_date)}
                        sortable
                    />
                    <Column field="product_name" header="Procedimiento" />
                    <Column
                        header="Insumos Consumidos"
                        body={suppliesConsumedBodyTemplate}
                    />
                </DataTable>
            </Card>
        );
    };

    const UserDetailSection = ({ user }: { user: UserReport }) => {
        return (
            <div className="user-detail-section mb-4 p-3 border rounded">
                <UserSummaryCard user={user} />
                <ProductBalanceTable user={user} />
                <MedicalSuppliesSection medicalSupplies={user.detailed_data.medical_supplies} />
                {/*<ProceduresSection procedures={user.detailed_data.completed_procedures} />*/}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <Card title="Informe de Consumo de Insumos">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="mb-3">
                            <Skeleton width="100%" height="80px" />
                        </div>
                    ))}
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Card className="border-danger">
                    <div className="alert alert-danger mb-0">
                        <i className="pi pi-exclamation-triangle me-2"></i>
                        {error}
                        <button
                            className="btn btn-sm btn-outline-danger ms-3"
                            onClick={fetchReportData}
                        >
                            Reintentar
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Card
                title={
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Informe de Consumo de Insumos</span>
                        {reportData && (
                            <Badge value={`${reportData.summary.total_users} usuarios`} />
                        )}
                    </div>
                }
                subTitle={reportData && `Generado: ${formatDate(reportData.summary.generated_at)}`}
            >
                {reportData ? (
                    <Accordion multiple>
                        {reportData.report.map((user) => (
                            <AccordionTab
                                key={user.user_id}
                                header={
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <span>{user.user_name}</span>
                                        <div className="d-flex gap-2">
                                            <Tag value={user.user_specialty} severity="info" />
                                            <Badge
                                                value={Object.keys(user.report_data.current_balance).length}
                                                severity="success"
                                            />
                                        </div>
                                    </div>
                                }
                            >
                                <UserDetailSection user={user} />
                            </AccordionTab>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center p-4 text-muted">
                        No hay datos disponibles
                    </div>
                )}
            </Card>
        </div>
    );
};