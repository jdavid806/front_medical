import React, { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { SalesInvoices } from "../invoices/SalesInvoices";
import { PurchaseInvoices } from "../invoices/PurchaseInvoices";
import { BillingEntity } from "../invoices/BillingEntity";
import { DebitCreditNotes } from "../invoices/DebitCreditNotes";
import { PurchaseOrders } from "../invoices/PurchaseOrders";


export const TabsBilling = () => {
    const [activeTab, setActiveTab] = useState("salesInvoices");
    const [loading, setLoading] = useState(false);

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "salesInvoices":
                return <SalesInvoices />;
            case "purchaseInvoices":
                return <PurchaseInvoices />;
            case "billingEntity":
                return <BillingEntity />;
            case "debitCreditNotes":
                return <DebitCreditNotes />;
            case "purchaseOrders":
                return <PurchaseOrders />;
            default:
                return <SalesInvoices />;
        }
    };

    if (loading) {
        return (
            <div
                className="flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
            >
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <main className="main" id="top">
            <div className="row g-3 justify-content-between align-items-start mb-4">
                <div className="col-12">
                    <div
                        className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                        style={{ minHeight: "400px" }}
                    >
                        <div className="card-body h-100 w-100 d-flex flex-column" style={{ marginTop: "-40px" }}>
                            <div className="tabs-professional-container mt-4">
                                <div className="tabs-header">
                                    <button
                                        className={`tab-item ${activeTab === "salesInvoices" ? "active" : ""}`}
                                        onClick={() => setActiveTab("salesInvoices")}
                                    >
                                   <i className="fas fa-file-invoice-dollar"></i>
                                        Facturación Ventas
                                    </button>
                                    <button
                                        className={`tab-item ${activeTab === "purchaseInvoices" ? "active" : ""}`}
                                        onClick={() => setActiveTab("purchaseInvoices")}
                                    >
                                        <i className="fas fa-file-invoice-dollar"></i>
                                        Facturación Compras
                                    </button>
                                    <button
                                        className={`tab-item ${activeTab === "billingEntity" ? "active" : ""}`}
                                        onClick={() => setActiveTab("billingEntity")}
                                    >
                                        <i className="fas fa-file-invoice-dollar"></i>
                                        Facturación X Entidad
                                    </button>
                                    <button
                                        className={`tab-item ${activeTab === "debitCreditNotes" ? "active" : ""}`}
                                        onClick={() => setActiveTab("debitCreditNotes")}
                                    >
                                        <i className="fas fa-file-alt"></i>
                                        Nota Débito/Créditos
                                    </button>
                                    <button
                                        className={`tab-item ${activeTab === "purchaseOrders" ? "active" : ""}`}
                                        onClick={() => setActiveTab("purchaseOrders")}
                                    >
                                        <i className="fas fa-file-invoice"></i>
                                        Órdenes de Compras
                                    </button>
                                </div>

                                <div className="tabs-content">
                                    <div className={`tab-panel ${activeTab === "salesInvoices" ? "active" : ""}`}>
                                        {renderActiveComponent()}
                                    </div>
                                    <div className={`tab-panel ${activeTab === "purchaseInvoices" ? "active" : ""}`}>
                                        {renderActiveComponent()}
                                    </div>
                                    <div className={`tab-panel ${activeTab === "billingEntity" ? "active" : ""}`}>
                                        {renderActiveComponent()}
                                    </div>
                                    <div className={`tab-panel ${activeTab === "debitCreditNotes" ? "active" : ""}`}>
                                        {renderActiveComponent()}
                                    </div>
                                    <div className={`tab-panel ${activeTab === "purchaseOrders" ? "active" : ""}`}>
                                        {renderActiveComponent()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};