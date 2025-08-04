import React, { useState } from 'react';
import {
    Button,
    Dropdown,
    InputText,
    InputTextarea,
    Calendar,
    Dialog
} from 'primereact';


interface FormData {
    tipo: string;
    proveedor: string;
    fecha: string | Date | null;
    costo: string;
    dinero: string;
    valorPagado: string;
    observaciones: string;
}

interface DropdownOption {
    label: string;
    value: string;
}

interface PaymentReceiptModalProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (formData: FormData) => void;
    initialData?: Partial<FormData>;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
    visible,
    onHide,
    onSubmit,
    initialData = {}
}) => {
    const [formData, setFormData] = useState<FormData>({
        tipo: 'RP - 1 - recibo de pago egreso',
        proveedor: '',
        fecha: null,
        costo: '',
        dinero: '',
        valorPagado: '',
        observaciones: '',
        ...initialData
    });

    const tipoOptions: DropdownOption[] = [
        { label: 'RP - 1 - recibo de pago egreso', value: 'RP - 1 - recibo de pago egreso' }
    ];

    const costoOptions: DropdownOption[] = [
        { label: 'Opción 1', value: 'opcion1' },
        { label: 'Opción 2', value: 'opcion2' }
    ];

    const dineroOptions: DropdownOption[] = [
        { label: 'Opción 1', value: 'opcion1' },
        { label: 'Opción 2', value: 'opcion2' }
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleCancel = () => {
        onHide();
    };

    return (
        <Dialog
            header="Nuevo recibo de pago"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={onHide}
            modal
            className="p-fluid"
        >
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col-12">
                        <label htmlFor="tipo" className="form-label">Tipo</label>
                        <Dropdown
                            id="tipo"
                            value={formData.tipo}
                            options={tipoOptions}
                            disabled
                            className="w-100"
                            onChange={(e) => onDropdownChange(e, 'tipo')}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-12">
                        <label htmlFor="proveedor" className="form-label">Proveedor / Otras</label>
                        <InputText
                            id="proveedor"
                            name="proveedor"
                            value={formData.proveedor}
                            onChange={onInputChange}
                            className="w-100"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="fecha" className="form-label">Fecha de elaboración</label>
                        <Calendar
                            id="fecha"
                            name="fecha"
                            value={formData.fecha ? new Date(formData.fecha) : null}
                            onChange={onDateChange}
                            dateFormat="mm/dd/yy"
                            className="w-100"
                            showIcon
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="valorPagado" className="form-label">Valor pagado</label>
                        <InputText
                            id="valorPagado"
                            name="valorPagado"
                            value={formData.valorPagado}
                            onChange={onInputChange}
                            className="w-100"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="costo" className="form-label">Costo</label>
                        <Dropdown
                            id="costo"
                            value={formData.costo}
                            options={costoOptions}
                            onChange={(e) => onDropdownChange(e, 'costo')}
                            name="costo"
                            placeholder="Seleccionar"
                            className="w-100"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="dinero" className="form-label">De donde sale el dinero</label>
                        <Dropdown
                            id="dinero"
                            value={formData.dinero}
                            options={dineroOptions}
                            onChange={(e) => onDropdownChange(e, 'dinero')}
                            name="dinero"
                            placeholder="Seleccionar"
                            className="w-100"
                        />
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12">
                        <label htmlFor="observaciones" className="form-label">Observaciones</label>
                        <InputTextarea
                            id="observaciones"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={onInputChange}
                            rows={5}
                            className="w-100"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 d-flex justify-content-end gap-2">
                        <Button
                            label="Cancelar"
                            className="p-button-secondary"
                            onClick={handleCancel}
                        />
                        <Button
                            label="Guardar y descargar"
                            type="submit"
                            className="p-button-primary"
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};