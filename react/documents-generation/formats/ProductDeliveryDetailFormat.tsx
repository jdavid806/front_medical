import React from "react";
import { MedicalSupply } from "../../pharmacy/supplies/interfaces";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager";
import { formatDateDMY } from "../../../services/utilidades";

export const ProductDeliveryDetailFormat: React.FC<{
    delivery: MedicalSupply,
    deliveryManager: MedicalSupplyManager
}> = ({ delivery, deliveryManager }) => {

    const renderCard = (title: string, content: React.ReactNode) => {
        return (
            <div className="card">
                <div className="card-header">
                    <h3>{title}</h3>
                </div>
                <div className="card-content">
                    {content}
                </div>
            </div>
        );
    };

    const renderInfoItem = (label: string, value: string) => {
        return (
            <div className="info-item">
                <label className="info-label">{label}</label>
                <div className="info-value">
                    <span>{value || '--'}</span>
                </div>
            </div>
        );
    };

    return <>
        <div className="container">
            {/* Información general de la solicitud */}
            {renderCard("Información General",
                <div className="row">
                    <div className="col">
                        {renderInfoItem("Solicitado por:", deliveryManager?.requestedBy?.name || "--")}
                        {renderInfoItem("Email:", deliveryManager?.requestedBy?.email || "--")}
                        {renderInfoItem("Dirección:", deliveryManager?.requestedBy?.address || "--")}
                    </div>
                    <div className="col">
                        {renderInfoItem("Fecha de creación:", formatDateDMY(delivery.created_at))}
                        {renderInfoItem("Teléfono:", deliveryManager?.requestedBy?.phone || "--")}
                    </div>

                    {delivery.observations && (
                        <div className="col-full">
                            <div className="info-item">
                                <label className="info-label">Observaciones:</label>
                                <div className="observations">
                                    {delivery.observations}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Lista de productos solicitados */}
            {renderCard(`Productos Solicitados (${delivery.products.length})`,
                <div className="table-container">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th className="text-center">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {delivery.products.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="product-info">
                                            <div className="product-name">{item.product.name}</div>
                                            <div className="product-description">{item.product.description}</div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <span className="quantity-badge">{item.quantity}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Resumen del estado */}
            {renderCard("Resumen del Estado",
                <div className="summary-grid">
                    <div className="summary-item">
                        <div className="summary-number">{delivery.products.length}</div>
                        <div className="summary-label">Productos solicitados</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-number">
                            {delivery.products.reduce((total, item) => total + item.quantity, 0)}
                        </div>
                        <div className="summary-label">Total de unidades</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-number">{deliveryManager?.statusLabel}</div>
                        <div className="summary-label">Estado actual</div>
                    </div>
                </div>
            )}
        </div>

        <style>{`
            body {
                margin: 0;
                padding: 20px;
                color: #000;
                background: #fff;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.4;
            }

            .no-print {
                display: none !important;
            }

            .container {
                max-width: 100%;
                margin: 0 auto;
            }

            /* Card Styles */
            .card {
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 20px;
                page-break-inside: avoid;
            }

            .card-header {
                background-color: #f8f9fa;
                padding: 12px 16px;
                border-bottom: 1px solid #ddd;
            }

            .card-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }

            .card-content {
                padding: 16px;
            }

            /* Row and Column Layout */
            .row {
                display: flex;
                flex-wrap: wrap;
                margin: -8px;
            }

            .col {
                flex: 1;
                min-width: 250px;
                padding: 8px;
            }

            .col-full {
                flex: 100%;
                padding: 8px;
            }

            /* Info Item Styles */
            .info-item {
                margin-bottom: 16px;
            }

            .info-label {
                display: block;
                font-weight: bold;
                font-size: 11px;
                color: #666;
                margin-bottom: 4px;
                text-transform: uppercase;
            }

            .info-value {
                display: flex;
                align-items: center;
                font-size: 13px;
            }

            .info-icon {
                margin-right: 8px;
                font-size: 14px;
            }

            /* Observations */
            .observations {
                background-color: #f8f9fa;
                padding: 12px;
                border-radius: 4px;
                border-left: 3px solid #6c757d;
                display: flex;
                align-items: flex-start;
            }

            .obs-icon {
                margin-right: 8px;
                font-size: 14px;
            }

            /* Table Styles */
            .table-container {
                overflow-x: auto;
            }

            .product-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
            }

            .product-table th {
                background-color: #f8f9fa;
                border: 1px solid #ddd;
                padding: 8px 12px;
                text-align: left;
                font-weight: bold;
            }

            .product-table td {
                border: 1px solid #ddd;
                padding: 8px 12px;
                vertical-align: top;
            }

            .text-center {
                text-align: center;
            }

            .product-info {
                min-width: 200px;
            }

            .product-name {
                font-weight: bold;
                margin-bottom: 2px;
            }

            .product-description {
                font-size: 10px;
                color: #666;
            }

            .quantity-badge {
                background-color: #007bff;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
            }

            /* Delivery Status */
            .delivery-status {
                margin-top: 4px;
            }

            .status-tag {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
            }

            .status-scheduled {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }

            .status-pending {
                background-color: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
            }

            /* Summary Grid */
            .summary-grid {
                display: flex;
                justify-content: space-around;
                text-align: center;
                flex-wrap: wrap;
            }

            .summary-item {
                flex: 1;
                min-width: 120px;
                padding: 16px 8px;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                margin: 0 8px;
            }

            .summary-icon {
                font-size: 24px;
                margin-bottom: 8px;
            }

            .summary-number {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 4px;
            }

            .summary-label {
                font-size: 11px;
                color: #666;
            }

            /* Print-specific styles */
            @media print {
                body {
                    padding: 10px;
                    font-size: 11px;
                }

                .card {
                    border: 1px solid #000;
                    margin-bottom: 15px;
                }

                .card-header {
                    background-color: #f0f0f0 !important;
                    -webkit-print-color-adjust: exact;
                }

                .quantity-badge {
                    background-color: #000 !important;
                    color: white !important;
                    -webkit-print-color-adjust: exact;
                }

                .status-scheduled {
                    background-color: #d4edda !important;
                    -webkit-print-color-adjust: exact;
                }

                .status-pending {
                    background-color: #fff3cd !important;
                    -webkit-print-color-adjust: exact;
                }

                .summary-item {
                    border: 1px solid #000;
                }
            }
        `}</style>
    </>
};