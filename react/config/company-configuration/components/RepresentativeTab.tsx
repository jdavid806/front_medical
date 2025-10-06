import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { Representative } from '../types/consultorio';
import { useCompanyRepresentative } from '../hooks/useCompanyRepresentative';
import { SwalManager } from '../../../../services/alertManagerImported';

interface RepresentativeTabProps {
    companyId?: string;
    onValidationChange?: (isValid: boolean) => void;
}

const RepresentativeTab: React.FC<RepresentativeTabProps> = ({ companyId, onValidationChange }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
        watch
    } = useForm<Representative>({
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            document_type: '',
            document_number: ''
        },
        mode: 'onChange'
    });

    const { representative, loading, error, isSubmitting, saveRepresentative } = useCompanyRepresentative();

    const documentTypes = [
        { label: 'RNC', value: 'RNC' },
        { label: 'PASSPORTE', value: 'PASSPORT' },
        { label: 'NIT', value: 'NIT' },
        { label: 'CEDULA DE CIUDADANIA', value: 'CC' }
    ];

    // Observar cambios en el formulario para validación
    const formValues = watch();

    useEffect(() => {
        if (representative) {
            reset(representative);
        } else if (!loading && !error) {
            reset({
                name: '',
                phone: '',
                email: '',
                document_type: '',
                document_number: ''
            });
        }
    }, [representative, loading, error, reset]);

    // Validar cuando cambien los valores del formulario
    useEffect(() => {
        const hasRequiredFields = Boolean(
            formValues.name &&
            formValues.document_type &&
            formValues.document_number
        );
        onValidationChange?.(hasRequiredFields);
    }, [formValues, onValidationChange]);

    const onSubmit = async (data: Representative) => {
        try {
            if (!companyId) {
                Message.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'companyId es requerido'
                });
                return;
            }

            const savedRepresentative = await saveRepresentative(companyId, data);
            reset(savedRepresentative);

            // Notificar validación exitosa después de guardar
            onValidationChange?.(true);

            SwalManager.success('Representante Legal se actualizo correctamente');

        } catch (error) {
            console.error('Error en onSubmit:', error);
            onValidationChange?.(false);
        }
    };

    if (loading) {
        return (
            <Card className="shadow-sm">
                <div className="container-fluid">
                    <div className="text-center p-4">Cargando datos del representante...</div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-sm">
                <div className="container-fluid">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm">
            <div className="container-fluid">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row mb-4">
                        <div className="col-12">
                            <h5 className="fw-bold mb-3">Información del Representante Legal</h5>
                            {!companyId && (
                                <div className="alert alert-warning">
                                    companyId no proporcionado. No se pueden guardar datos.
                                </div>
                            )}
                        </div>

                        {/* Nombre - Ocupa toda la fila */}
                        <div className="col-12 mb-3">
                            <label htmlFor="name" className="form-label">
                                Nombre Completo <span className="text-danger">*</span>
                            </label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: 'El nombre del Representante no puede estar vacío',
                                    minLength: {
                                        value: 2,
                                        message: 'El nombre debe tener al menos 2 caracteres'
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        id="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="Jhon Doe"
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.name && (
                                <div className="invalid-feedback d-block">
                                    {errors.name.message}
                                </div>
                            )}
                        </div>

                        {/* Teléfono y Email - En dos columnas */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="phone" className="form-label">
                                Teléfono
                            </label>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^\+?[\d\s\-\(\)]+$/,
                                        message: 'Formato de teléfono inválido'
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        id="phone"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        placeholder="+57 300 123 4567"
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.phone && (
                                <div className="invalid-feedback d-block">
                                    {errors.phone.message}
                                </div>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico
                            </label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Formato de email inválido'
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        id="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="ejemplo@correo.com"
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.email && (
                                <div className="invalid-feedback d-block">
                                    {errors.email.message}
                                </div>
                            )}
                        </div>

                        {/* Tipo Documento y Documento - En dos columnas */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="document_type" className="form-label">
                                Tipo de Documento <span className="text-danger">*</span>
                            </label>
                            <Controller
                                name="document_type"
                                control={control}
                                rules={{ required: 'Seleccione un Tipo de Documento' }}
                                render={({ field }) => (
                                    <Dropdown
                                        {...field}
                                        id="document_type"
                                        options={documentTypes}
                                        placeholder="Seleccione un tipo de documento"
                                        className={`w-100 ${errors.document_type ? 'is-invalid' : ''}`}
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.document_type && (
                                <div className="invalid-feedback d-block">
                                    {errors.document_type.message}
                                </div>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="document_number" className="form-label">
                                Número de Documento <span className="text-danger">*</span>
                            </label>
                            <Controller
                                name="document_number"
                                control={control}
                                rules={{
                                    required: 'El Documento no puede estar vacío',
                                    minLength: {
                                        value: 3,
                                        message: 'El documento debe tener al menos 3 caracteres'
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        id="document_number"
                                        className={`form-control ${errors.document_number ? 'is-invalid' : ''}`}
                                        placeholder="123456789"
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.document_number && (
                                <div className="invalid-feedback d-block">
                                    {errors.document_number.message}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botón de Guardar */}
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    {isDirty && (
                                        <small className="text-warning">
                                            <i className="pi pi-info-circle mr-2"></i>
                                            Tienes cambios sin guardar
                                        </small>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    label="Guardar Representante"
                                    icon="pi pi-save"
                                    loading={isSubmitting}
                                    className="btn-primary"
                                    disabled={!companyId || !isValid}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Card>
    );
};

export default RepresentativeTab;