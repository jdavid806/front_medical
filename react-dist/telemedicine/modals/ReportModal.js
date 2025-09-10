import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
export const ReportModal = ({
  visible,
  onHide
}) => {
  const [filtros, setFiltros] = useState({
    fechaDesde: null,
    fechaHasta: null,
    tipoReporte: '',
    formato: 'pdf'
  });
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const toast = useRef(null);
  const tiposReporte = [{
    label: 'Reporte general de consultas',
    value: 'general'
  }, {
    label: 'Reporte por médico',
    value: 'medico'
  }, {
    label: 'Reporte por paciente',
    value: 'paciente'
  }, {
    label: 'Reporte de duración de consultas',
    value: 'duracion'
  }];
  const formatosExportacion = [{
    label: 'PDF',
    value: 'pdf'
  }, {
    label: 'Excel',
    value: 'excel'
  }, {
    label: 'CSV',
    value: 'csv'
  }];
  const handleInputChange = (field, value) => {
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
  const footerContent = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: onHide,
    disabled: generando
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Generar",
    icon: "pi pi-file",
    onClick: generarReporte,
    disabled: generando,
    loading: generando
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-file-pdf mr-2"
    }), " Reportes de Video Consultas"),
    visible: visible,
    style: {
      width: '90vw',
      maxWidth: '600px'
    },
    footer: footerContent,
    onHide: onHide,
    className: "reporte-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "border-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row form-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fechaDesde",
    className: "form-label"
  }, "Desde: *"), /*#__PURE__*/React.createElement(Calendar, {
    id: "fechaDesde",
    value: filtros.fechaDesde,
    onChange: e => handleInputChange('fechaDesde', e.value),
    dateFormat: "dd/mm/yy",
    showIcon: true,
    className: "w-full",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fechaHasta",
    className: "form-label"
  }, "Hasta: *"), /*#__PURE__*/React.createElement(Calendar, {
    id: "fechaHasta",
    value: filtros.fechaHasta,
    onChange: e => handleInputChange('fechaHasta', e.value),
    dateFormat: "dd/mm/yy",
    showIcon: true,
    className: "w-full",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tipoReporte",
    className: "form-label"
  }, "Tipo de reporte:"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "tipoReporte",
    value: filtros.tipoReporte,
    options: tiposReporte,
    onChange: e => handleInputChange('tipoReporte', e.value),
    placeholder: "Seleccione tipo de reporte",
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "formato",
    className: "form-label"
  }, "Formato:"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "formato",
    value: filtros.formato,
    options: formatosExportacion,
    onChange: e => handleInputChange('formato', e.value),
    className: "w-full"
  }))), generando && /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-between mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "Generando reporte..."), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, progreso, "%")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: progreso,
    className: "mb-3"
  })), progreso === 100 && /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Descargar Reporte",
    icon: "pi pi-download",
    className: "p-button-success w-full",
    onClick: descargarReporte
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-center"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-color-secondary"
  }, "\xBFNecesitas un reporte nuevo? Solic\xEDtalo por", ' ', /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: solicitarSoporte,
    className: "text-primary cursor-pointer text-decoration-none"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-life-ring mr-1"
  }), "soporte"))))))));
};