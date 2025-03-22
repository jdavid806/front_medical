import React, { useState } from 'react';
import { useCashControlReport } from './hooks/useCashControlReport';

export const CierreCaja = () => {
    const { cashControlReportItems } = useCashControlReport();

    // Estado para controlar qué cierres están expandidos
    const [cierresExpandidos, setCierresExpandidos] = useState({});

    // Función para alternar la expansión de un cierre
    const toggleCierre = (id) => {
        setCierresExpandidos({
            ...cierresExpandidos,
            [id]: !cierresExpandidos[id]
        });
    };

    // Formatear dinero en formato local
    const formatoDinero = (cantidad) => {
        return cantidad.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
    };

    // Obtener fecha formateada
    const obtenerFechaFormateada = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!cashControlReportItems || cashControlReportItems.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100 bg-light rounded-3 p-4">
                <p className="text-muted text-center mb-0">No hay datos de cierre disponibles</p>
            </div>
        );
    }

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-light">
                <h2 className="h5 mb-0">Cierre de Caja</h2>
            </div>
            <div className="list-group list-group-flush">
                {cashControlReportItems.map((cierre) => (
                    <div key={cierre.id} className="list-group-item">
                        <div
                            className="d-flex justify-content-between align-items-center cursor-pointer flex-wrap gap-2"
                            onClick={() => toggleCierre(cierre.id)}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <i className="fas fa-calendar-alt text-primary me-3"></i>
                                <span className="fw-medium">
                                    {obtenerFechaFormateada(cierre.created_at)}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                <div className="d-flex gap-3 justify-content-between">
                                    <div className="text-end">
                                        <p className="text-muted small mb-0">Total Recibido</p>
                                        <p className="fw-bold text-success mb-0">{formatoDinero(cierre.total_received)}</p>
                                    </div>
                                    <div className="text-end">
                                        <p className="text-muted small mb-0">Sobrante</p>
                                        <p className={`fw-bold mb-0 ${cierre.remaining_amount >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {formatoDinero(cierre.remaining_amount)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <p className="text-muted small mb-0">Entregado por</p>
                                    <p className="fw-medium mb-0">Nombre del usuario entregador</p>
                                </div>
                                <div className="text-end">
                                    <p className="text-muted small mb-0">Validado por</p>
                                    <p className="fw-medium mb-0">Nombre del usuario validador</p>
                                </div>
                                <i className={`fas ${cierresExpandidos[cierre.id] ? 'fa-chevron-up' : 'fa-chevron-down'} text-muted`}></i>
                            </div>
                        </div>
                        {cierresExpandidos[cierre.id] && (
                            <div className="mt-3 ps-5">
                                <div className="bg-light rounded p-3 mb-3">
                                    <h3 className="h6 fw-medium mb-2">
                                        <i className="fas fa-credit-card text-muted me-1"></i> Detalle por Método de Pago
                                    </h3>
                                    <div className="table-responsive">
                                        <table className="table table-bordered mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="text-start small fw-medium">Método de Pago</th>
                                                    <th className="text-end small fw-medium">Esperado</th>
                                                    <th className="text-end small fw-medium">Recibido</th>
                                                    <th className="text-end small px-2 fw-medium">Diferencia</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cierre.details && cierre.details.map((detalle) => (
                                                    <tr key={detalle.id}>
                                                        <td className="text-start small px-2">Metodo de pago</td>
                                                        <td className="text-end small">{formatoDinero(detalle.total_expected)}</td>
                                                        <td className="text-end small fw-medium text-success">{formatoDinero(detalle.total_received)}</td>
                                                        <td className={`text-end small px-2 fw-medium ${detalle.remaining_amount >= 0 ? 'text-success' : 'text-danger'}`}>
                                                            {formatoDinero(detalle.remaining_amount)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-light">
                                                <tr>
                                                    <td className="text-start small fw-medium">Total</td>
                                                    <td className="text-end small fw-medium">{formatoDinero(cierre.total_expected)}</td>
                                                    <td className="text-end small fw-medium text-success">{formatoDinero(cierre.total_received)}</td>
                                                    <td className={`text-end small fw-medium ${cierre.remaining_amount >= 0 ? 'text-success' : 'text-danger'}`}>
                                                        {formatoDinero(cierre.remaining_amount)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-sm btn-outline-primary">
                                        <i className="fas fa-print me-1"></i> Imprimir
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};