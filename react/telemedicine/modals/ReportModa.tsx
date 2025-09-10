import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { FiltrosReporte, ReporteModalProps } from '../interfaces/ReportType';



export const ReportModal: React.FC<ReporteModalProps> = ({ visible, onHide }) => {
    const [filtros, setFiltros] = useState<FiltrosReporte>({
        fechaDesde: null,
        fechaHasta: null,
        tipoReporte: '',
        formato: 'pdf'
    });

    const [generando, setGenerando] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const toast = React.useRef<Toast>(null);

    const tiposReporte = [
        { label: 'Reporte general de consultas', value: 'general' },
        { label: 'Reporte por médico', value: 'medico' },
        { label: 'Reporte por paciente', value: 'paciente' },
        { label: 'Reporte de duración de consultas', value: 'duracion' }
    ];

    const formatosExportacion = [
        { label: 'PDF', value: 'pdf' },
        { label: 'Excel', value: 'excel' },
        { label: 'CSV', value: 'csv' }
    ];

    const handleInputChange = (field: keyof FiltrosReporte, value: any) => {
        setFiltros(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generarReporte = async () => {
        if (!filtros.fechaDesde || !filtros.fechaHasta) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Fechas requeridas',
                detail: 'Debe seleccionar un rango de fechas válido'
            });
            return;
        }

        if (filtros.fechaDesde > filtros.fechaHasta) {
            toast.current?.show({
                severity: 'error',
                summary: 'Rango inválido',
                detail: 'La fecha desde no puede ser mayor a la fecha hasta'
            });
            return;
        }

        setGenerando(true);
        setProgreso(0);

        // Simular generación de reporte
        const interval = setInterval(() => {
            setProgreso(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setGenerando(false);

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Reporte generado',
                        detail: 'El reporte se ha generado correctamente'
                    });

                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const descargarReporte = () => {
        // Lógica para descargar el reporte generado
        toast.current?.show({
            severity: 'info',
            summary: 'Descarga iniciada',
            detail: 'El reporte se está descargando...'
        });
    };

    const solicitarSoporte = () => {
        window.open('mailto:soporte@monaros.co?subject=Solicitud de nuevo reporte', '_blank');
    };

    const footerContent = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
                disabled={generando}
            />
            <Button
                label="Generar"
                icon="pi pi-file"
                onClick={generarReporte}
                disabled={generando}
                loading={generando}
            />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header="Reportes de Video Consultas"
                visible={visible}
                style={{ width: '50vw' }}
                footer={footerContent}
                onHide={onHide}
                className="reporte-modal"
            >
                <div className="grid">
                    <div className="col-12">
                        <Card>
                            <div className="grid formgrid">
                                <div className="col-12 field">
                                    <label htmlFor="fechaDesde" className="block mb-2">
                                        Desde: *
                                    </label>
                                    <Calendar
                                        id="fechaDesde"
                                        value={filtros.fechaDesde}
                                        onChange={(e) => handleInputChange('fechaDesde', e.value)}
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div className="col-12 field mt-3">
                                    <label htmlFor="fechaHasta" className="block mb-2">
                                        Hasta: *
                                    </label>
                                    <Calendar
                                        id="fechaHasta"
                                        value={filtros.fechaHasta}
                                        onChange={(e) => handleInputChange('fechaHasta', e.value)}
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div className="col-12 field mt-3">
                                    <label htmlFor="tipoReporte" className="block mb-2">
                                        Tipo de reporte:
                                    </label>
                                    <Dropdown
                                        id="tipoReporte"
                                        value={filtros.tipoReporte}
                                        options={tiposReporte}
                                        onChange={(e) => handleInputChange('tipoReporte', e.value)}
                                        placeholder="Seleccione tipo de reporte"
                                        className="w-full"
                                    />
                                </div>

                                <div className="col-12 field mt-3">
                                    <label htmlFor="formato" className="block mb-2">
                                        Formato:
                                    </label>
                                    <Dropdown
                                        id="formato"
                                        value={filtros.formato}
                                        options={formatosExportacion}
                                        onChange={(e) => handleInputChange('formato', e.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {generando && (
                                <div className="mt-4">
                                    <div className="flex align-items-center justify-content-between mb-2">
                                        <span className="text-sm">Generando reporte...</span>
                                        <span className="text-sm">{progreso}%</span>
                                    </div>
                                    <ProgressBar value={progreso} className="mb-3" />
                                </div>
                            )}

                            {progreso === 100 && (
                                <div className="mt-3">
                                    <Button
                                        label="Descargar Reporte"
                                        icon="pi pi-download"
                                        className="p-button-success w-full"
                                        onClick={descargarReporte}
                                    />
                                </div>
                            )}

                            <div className="mt-4 text-center">
                                <small className="text-color-secondary">
                                    ¿Necesitas un reporte nuevo? Solicítalo por{' '}
                                    <a
                                        href="#"
                                        onClick={solicitarSoporte}
                                        className="text-primary cursor-pointer"
                                    >
                                        <i className="pi pi-life-ring mr-1"></i>soporte
                                    </a>
                                </small>
                            </div>
                        </Card>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

