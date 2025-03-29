import React, { useState } from 'react';
import {
    Button,
    Dropdown,
    InputText,
    InputTextarea,
    Calendar,
    FileUpload
} from 'primereact';

interface FormData {
    tipo: string;
    proveedor: string;
    numeroFactura: string;
    fecha: string | Date | null;
    centroCosto: string;
    costo: string;
    dinero: string;
    valorPagado: string;
    observaciones: string;
    archivo: File | null;
}

interface DropdownOption {
    label: string;
    value: string;
}

export const PaymentReceiptForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        tipo: '',
        proveedor: '',
        numeroFactura: '',
        fecha: null,
        centroCosto: '',
        costo: '',
        dinero: '',
        valorPagado: '',
        observaciones: '',
        archivo: null
    });

    // Datos mock para los dropdowns
    const tipoOptions: DropdownOption[] = [
        { label: 'RP - 1 - Recibo de pago egreso', value: 'RP - 1 - Recibo de pago egreso' },
        { label: 'RP - 2 - Recibo de pago ingreso', value: 'RP - 2 - Recibo de pago ingreso' },
        { label: 'RC - 1 - Recibo de caja', value: 'RC - 1 - Recibo de caja' },
        { label: 'RC - 2 - Comprobante de egreso', value: 'RC - 2 - Comprobante de egreso' }
    ];

    const centroCostoOptions: DropdownOption[] = [
        { label: 'Administración', value: 'admin' },
        { label: 'Ventas', value: 'ventas' },
        { label: 'Producción', value: 'produccion' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'TI', value: 'ti' }
    ];

    const costoOptions: DropdownOption[] = [
        { label: 'Materiales', value: 'materiales' },
        { label: 'Servicios', value: 'servicios' },
        { label: 'Nómina', value: 'nomina' },
        { label: 'Logística', value: 'logistica' },
        { label: 'Otros', value: 'otros' }
    ];

    const dineroOptions: DropdownOption[] = [
        { label: 'Caja menor', value: 'caja_menor' },
        { label: 'Cuenta corriente', value: 'cuenta_corriente' },
        { label: 'Fondo de reserva', value: 'fondo_reserva' },
        { label: 'Inversiones', value: 'inversiones' },
        { label: 'Otro origen', value: 'otro' }
    ];

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onDropdownChange = (e: { value: string }, name: string) => {
        setFormData(prev => ({ ...prev, [name]: e.value }));
    };

    const onDateChange = (e: { value: Date | Date[] | null }) => {
        if (e.value && !Array.isArray(e.value)) {
            setFormData(prev => ({ ...prev, fecha: e.value as Date }));
        }
    };

    const onFileUpload = (e: { files: File[] }) => {
        setFormData(prev => ({ ...prev, archivo: e.files[0] }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted: ', formData);
        // Lógica de envío aquí
    };

    const onCancel = () => {
        console.log('Form cancelled');
        // Lógica de cancelación aquí
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-12 col-lg-10"> {/* Formulario más ancho */}
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h2 className="h4 mb-0">Nuevo recibo de pago</h2>
                        </div>

                        <div className="card-body">
                            <form onSubmit={onSubmit}>
                                <div className="row mb-4">
                                    {/* Columna izquierda */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="tipo" className="form-label">Tipo de documento</label>
                                            <Dropdown
                                                id="tipo"
                                                value={formData.tipo}
                                                options={tipoOptions}
                                                onChange={(e) => onDropdownChange(e, 'tipo')}
                                                placeholder="Seleccione el tipo"
                                                className="w-100"
                                                filter
                                                showClear
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="proveedor" className="form-label">Proveedor / Otras entidades</label>
                                            <InputText
                                                id="proveedor"
                                                name="proveedor"
                                                value={formData.proveedor}
                                                onChange={onInputChange}
                                                className="w-100"
                                                placeholder="Nombre del proveedor"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="costo" className="form-label">Costo asociado</label>
                                            <Dropdown
                                                id="costo"
                                                value={formData.costo}
                                                options={costoOptions}
                                                onChange={(e) => onDropdownChange(e, 'costo')}
                                                placeholder="Seleccione el costo"
                                                className="w-100"
                                                filter
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="dinero" className="form-label">Origen del dinero</label>
                                            <Dropdown
                                                id="dinero"
                                                value={formData.dinero}
                                                options={dineroOptions}
                                                onChange={(e) => onDropdownChange(e, 'dinero')}
                                                placeholder="Seleccione el origen"
                                                className="w-100"
                                                filter
                                            />
                                        </div>
                                    </div>

                                    {/* Columna derecha */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="numeroFactura" className="form-label">Número de factura</label>
                                            <InputText
                                                id="numeroFactura"
                                                name="numeroFactura"
                                                value={formData.numeroFactura}
                                                onChange={onInputChange}
                                                className="w-100"
                                                placeholder="Número de documento"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="fecha" className="form-label">Fecha de elaboración</label>
                                            <Calendar
                                                id="fecha"
                                                value={formData.fecha}
                                                onChange={onDateChange}
                                                dateFormat="dd/mm/yy"
                                                className="w-100"
                                                showIcon
                                                placeholder="Seleccione la fecha"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="centroCosto" className="form-label">Centro de costo</label>
                                            <Dropdown
                                                id="centroCosto"
                                                value={formData.centroCosto}
                                                options={centroCostoOptions}
                                                onChange={(e) => onDropdownChange(e, 'centroCosto')}
                                                placeholder="Seleccione centro"
                                                className="w-100"
                                                filter
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="valorPagado" className="form-label">Valor pagado ($)</label>
                                            <InputText
                                                id="valorPagado"
                                                name="valorPagado"
                                                value={formData.valorPagado}
                                                onChange={onInputChange}
                                                className="w-100"
                                                placeholder="0.00"
                                                keyfilter="money"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Observaciones y archivo */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <label htmlFor="observaciones" className="form-label">Observaciones</label>
                                        <InputTextarea
                                            id="observaciones"
                                            name="observaciones"
                                            value={formData.observaciones}
                                            onChange={onInputChange}
                                            rows={3}
                                            className="w-100"
                                            placeholder="Detalles adicionales..."
                                        />
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-12">
                                        <label className="form-label">Adjuntar archivo</label>
                                        <FileUpload
                                            mode="basic"
                                            name="archivo"
                                            accept="image/*,.pdf,.doc,.docx"
                                            maxFileSize={1000000}
                                            chooseLabel="Seleccionar archivo"
                                            className="w-100"
                                            onUpload={onFileUpload}
                                        />
                                    </div>
                                </div>

                                {/* Botones de acción - Centrados */}
                                <div className="row">
                                    <div className="col-12 d-flex justify-content-center gap-3">
                                        <Button
                                            label="Cancelar"
                                            icon="pi pi-times"
                                            className="p-button-secondary"
                                            onClick={onCancel}
                                        />
                                        <Button
                                            label="Guardar y Descargar"
                                            icon="pi pi-save"
                                            type="submit"
                                            className="p-button-primary"
                                        />
                                        <Button
                                            label="Guardar"
                                            icon="pi pi-download"
                                            className="p-button-success"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};