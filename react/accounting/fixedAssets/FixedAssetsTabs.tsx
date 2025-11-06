import React, { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import FixedAssetsTable from "./tables/FixedAssetsTable";
import DepreciationHistoryTable from "./tables/DepreciationHistoryTable";

export const FixedAssetsTabs = () => {
    const [activeTab, setActiveTab] = useState("assets");
    const [loading, setLoading] = useState(false);

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "assets":
                return <FixedAssetsTable />;
            case "depreciation":
                return <DepreciationHistoryTable />;
            default:
                return <FixedAssetsTable />;
        }
    };

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [activeTab]);

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <main className="main" id="top">
            <div className="row g-3 justify-content-between align-items-start mb-4">
                <div className="col-12">
                    {/* Breadcrumb */}
                    <nav className="mb-3" aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <a href="homeContabilidad">Contabilidad</a>
                            </li>
                            <li className="breadcrumb-item active">Activos Fijos</li>
                        </ol>
                    </nav>

                    <div
                        className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                        style={{ minHeight: "400px" }}
                    >
                        <div className="card-body h-100 w-100 d-flex flex-column">
                            <div className="tabs-professional-container">
                                <div className="tabs-header">
                                    <button
                                        className={`tab-item ${activeTab === "assets" ? "active" : ""}`}
                                        onClick={() => setActiveTab("assets")}
                                    >
                                        <i className="fas fa-building"></i>
                                        Activos Fijos
                                    </button>
                                    <button
                                        className={`tab-item ${activeTab === "depreciation" ? "active" : ""}`}
                                        onClick={() => setActiveTab("depreciation")}
                                    >
                                        <i className="fas fa-calculator"></i>
                                        Historial
                                    </button>
                                </div>

                                <div className="tabs-content">
                                    <div className={`tab-panel ${activeTab === "assets" ? "active" : ""}`}>
                                        {renderActiveComponent()}
                                    </div>
                                    <div className={`tab-panel ${activeTab === "depreciation" ? "active" : ""}`}>
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