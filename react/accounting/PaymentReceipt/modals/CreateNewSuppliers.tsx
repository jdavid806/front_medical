import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

interface GeneralData {
    type: string;
    documentType: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    city: string;
    phone: string;
}

interface BillingData {
    billingType: string;
    billingDocumentNumber: string;
    billingCity: string;
    billingAddress: string;
}

export const CreateNewSuppliers: React.FC<{
    visible: boolean;
    onHide: () => void
}> = ({ visible, onHide }) => {
    const [generalData, setGeneralData] = useState<GeneralData>({
        type: '',
        documentType: '',
        documentNumber: '',
        firstName: '',
        lastName: '',
        city: '',
        phone: '',
    });

    const [billingData, setBillingData] = useState<BillingData>({
        billingType: '',
        billingDocumentNumber: '',
        billingCity: '',
        billingAddress: '',
    });

    const [showBilling, setShowBilling] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'billing'>('general');
    const [submitted, setSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleGeneralDropdownChange = (e: DropdownChangeEvent) => {
        const { name, value } = e.target;
        setGeneralData({ ...generalData, [name as keyof GeneralData]: value });
    };

    const handleGeneralInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGeneralData({ ...generalData, [name as keyof GeneralData]: value });
    };

    const handleBillingDropdownChange = (e: DropdownChangeEvent) => {
        const { name, value } = e.target;
        setBillingData({ ...billingData, [name as keyof BillingData]: value });
    };

    const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBillingData({ ...billingData, [name as keyof BillingData]: value });
    };

    const validateGeneralData = (): boolean => {
        return (
            generalData.type !== '' &&
            generalData.documentType !== '' &&
            generalData.documentNumber !== '' &&
            generalData.firstName !== '' &&
            generalData.lastName !== '' &&
            generalData.city !== '' &&
            generalData.phone !== ''
        );
    };

    const handleNext = () => {
        setSubmitted(true);

        if (!validateGeneralData()) {
            return;
        }

        if (!showBilling) {
            setShowBilling(true);
            setActiveTab('billing');
        } else {
            // Aquí iría la lógica para enviar los datos al servidor
            setSuccessMessage('Proveedor creado exitosamente');
            setTimeout(() => {
                onHide();
                setShowBilling(false);
                setActiveTab('general');
                setSubmitted(false);
                setSuccessMessage('');
            }, 2000);
        }
    };

    const documentTypes = [
        { label: 'Cédula de Ciudadanía', value: 'CC' },
        { label: 'NIT', value: 'NIT' },
        { label: 'Cédula de Extranjería', value: 'CE' },
        { label: 'Tarjeta de Identidad', value: 'TI' },
    ];

    const cities = [
        { label: 'Medellín', value: 'Medellín' },
        { label: 'Bogotá', value: 'Bogotá' },
        { label: 'Cali', value: 'Cali' },
        { label: 'Barranquilla', value: 'Barranquilla' },
    ];

    const supplierTypes = [
        { label: 'Proveedor', value: 'supplier' },
        { label: 'Cliente', value: 'client' },
        { label: 'Proveedor y Cliente', value: 'both' },
    ];

    const billingTypes = [
        { label: 'Factura electrónica', value: 'electronic' },
        { label: 'Factura física', value: 'physical' },
    ];

    const isFormFieldValid = (field: keyof GeneralData | keyof BillingData, form: 'general' | 'billing') => {
        if (form === 'general') {
            return submitted && (generalData[field as keyof GeneralData] === '');
        } else {
            return submitted && (billingData[field as keyof BillingData] === '');
        }
    };

    const getFormErrorMessage = (field: keyof GeneralData | keyof BillingData, form: 'general' | 'billing') => {
        return isFormFieldValid(field, form) && (
            <small className="p-error">Este campo es requerido.</small>
        );
    };

    return (
        <Dialog
            header="Crear nuevo proveedor"
            visible={visible}
            onHide={onHide}
            modal
            className="w-100"
            style={{ maxWidth: '800px' }}
        >
            {successMessage && (
                <Message severity="success" text={successMessage} className="mb-4" />
            )}

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={classNames('nav-link', { 'active': activeTab === 'general' })}
                        onClick={() => setActiveTab('general')}
                    >
                        Datos Generales
                    </button>
                </li>
                {showBilling && (
                    <li className="nav-item">
                        <button
                            className={classNames('nav-link', { 'active': activeTab === 'billing' })}
                            onClick={() => setActiveTab('billing')}
                        >
                            Datos de Facturación
                        </button>
                    </li>
                )}
            </ul>

            <div className="row">
                {activeTab === 'general' && (
                    <div className="col-12">
                        <div className="formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="type">Tipo de Tercero*</label>
                                <Dropdown
                                    id="type"
                                    value={generalData.type}
                                    options={[{ label: 'Seleccione...', value: '' }, ...supplierTypes]}
                                    onChange={handleGeneralDropdownChange}
                                    name="type"
                                    placeholder="Seleccione el tipo"
                                    className={classNames({ 'p-invalid': isFormFieldValid('type', 'general') })}
                                />
                                {getFormErrorMessage('type', 'general')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="documentType">Tipo de Documento*</label>
                                <Dropdown
                                    id="documentType"
                                    value={generalData.documentType}
                                    options={[{ label: 'Seleccione...', value: '' }, ...documentTypes]}
                                    onChange={handleGeneralDropdownChange}
                                    name="documentType"
                                    placeholder="Seleccione el documento"
                                    className={classNames({ 'p-invalid': isFormFieldValid('documentType', 'general') })}
                                />
                                {getFormErrorMessage('documentType', 'general')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="documentNumber">Número de Documento*</label>
                                <InputText
                                    id="documentNumber"
                                    value={generalData.documentNumber}
                                    onChange={handleGeneralInputChange}
                                    name="documentNumber"
                                    placeholder="Ingrese el número"
                                    className={classNames('w-100', { 'p-invalid': isFormFieldValid('documentNumber', 'general') })}
                                />
                                {getFormErrorMessage('documentNumber', 'general')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="firstName">Nombre*</label>
                                <InputText
                                    id="firstName"
                                    value={generalData.firstName}
                                    onChange={handleGeneralInputChange}
                                    name="firstName"
                                    placeholder="Ingrese el nombre"
                                    className={classNames('w-100', { 'p-invalid': isFormFieldValid('firstName', 'general') })}
                                />
                                {getFormErrorMessage('firstName', 'general')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="lastName">Apellido*</label>
                                <InputText
                                    id="lastName"
                                    value={generalData.lastName}
                                    onChange={handleGeneralInputChange}
                                    name="lastName"
                                    placeholder="Ingrese el apellido"
                                    className={classNames('w-100', { 'p-invalid': isFormFieldValid('lastName', 'general') })}
                                />
                                {getFormErrorMessage('lastName', 'general')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="city">Ciudad*</label>
                                <Dropdown
                                    id="city"
                                    value={generalData.city}
                                    options={[{ label: 'Seleccione...', value: '' }, ...cities]}
                                    onChange={handleGeneralDropdownChange}
                                    name="city"
                                    placeholder="Seleccione la ciudad"
                                    className={classNames({ 'p-invalid': isFormFieldValid('city', 'general') })}
                                />
                                {getFormErrorMessage('city', 'general')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="phone">Teléfono*</label>
                                <InputText
                                    id="phone"
                                    value={generalData.phone}
                                    onChange={handleGeneralInputChange}
                                    name="phone"
                                    placeholder="Ingrese el teléfono"
                                    className={classNames('w-100', { 'p-invalid': isFormFieldValid('phone', 'general') })}
                                    keyfilter="num"
                                />
                                {getFormErrorMessage('phone', 'general')}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="col-12">
                        <div className="formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="billingType">Tipo de Factura*</label>
                                <Dropdown
                                    id="billingType"
                                    value={billingData.billingType}
                                    options={[{ label: 'Seleccione...', value: '' }, ...billingTypes]}
                                    onChange={handleBillingDropdownChange}
                                    name="billingType"
                                    placeholder="Seleccione el tipo"
                                    className={classNames({ 'p-invalid': isFormFieldValid('billingType', 'billing') })}
                                />
                                {getFormErrorMessage('billingType', 'billing')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="billingDocumentNumber">Número de Documento*</label>
                                <InputText
                                    id="billingDocumentNumber"
                                    value={billingData.billingDocumentNumber}
                                    onChange={handleBillingInputChange}
                                    name="billingDocumentNumber"
                                    placeholder="Ingrese el número"
                                    className={classNames('w-100', { 'p-invalid': isFormFieldValid('billingDocumentNumber', 'billing') })}
                                />
                                {getFormErrorMessage('billingDocumentNumber', 'billing')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="billingCity">Ciudad de Facturación*</label>
                                <Dropdown
                                    id="billingCity"
                                    value={billingData.billingCity}
                                    options={[{ label: 'Seleccione...', value: '' }, ...cities]}
                                    onChange={handleBillingDropdownChange}
                                    name="billingCity"
                                    placeholder="Seleccione la ciudad"
                                    className={classNames({ 'p-invalid': isFormFieldValid('billingCity', 'billing') })}
                                />
                                {getFormErrorMessage('billingCity', 'billing')}
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor="billingAddress">Dirección*</label>
                                <InputText
                                    id="billingAddress"
                                    value={billingData.billingAddress}
                                    onChange={handleBillingInputChange}
                                    name="billingAddress"
                                    placeholder="Ingrese la dirección"
                                    className={classNames('w-100', { 'p-invalid': isFormFieldValid('billingAddress', 'billing') })}
                                />
                                {getFormErrorMessage('billingAddress', 'billing')}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-content-between mt-4">
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={onHide}
                    className="p-button-text"
                />
                <Button
                    label={showBilling ? 'Guardar' : 'Siguiente'}
                    icon={showBilling ? 'pi pi-check' : 'pi pi-arrow-right'}
                    onClick={handleNext}
                    className="p-button-success"
                />
            </div>
        </Dialog>
    );
};