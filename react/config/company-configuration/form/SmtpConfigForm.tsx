import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { SmtpConfig } from '../types/consultorio';
import { useCompanyCommunication } from '../hooks/useCompanyCommunication';

const SmtpConfigForm: React.FC = () => {
    const toast = useRef<Toast>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<SmtpConfig>({
        defaultValues: {
            smtp_server: '',
            port: 587,
            security: 'tls',
            email: '',
            password: '',
        }
    });

    const { communication, loading, error, isSubmitting, submitError, saveCommunication } = useCompanyCommunication();

    const securityOptions = [
        { label: 'TLS', value: 'tls' },
        { label: 'SSL', value: 'ssl' },
        { label: 'Ninguna', value: 'none' }
    ];

    const selectedSecurity = watch('security');

    useEffect(() => {
        if (communication) {
            reset(communication);
        } else if (!loading && !error) {
            reset({
                smtp_server: '',
                port: 587,
                security: 'tls',
                email: '',
                password: '',
            });
        }
    }, [communication, loading, error, reset]);

    useEffect(() => {
        if (submitError && toast.current) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: submitError,
                life: 5000
            });
        }
    }, [submitError]);

    const onSubmit = async (data: SmtpConfig) => {
        try {
            console.log('Enviando datos:', data);
            await saveCommunication(data);
        } catch (error) {
            console.error('Error en onSubmit:', error);
        }
    };

    const handleTestConnection = async () => {
        const formData = watch();
        if (!formData.smtp_server || !formData.port || !formData.email) {
            if (toast.current) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Complete los campos requeridos para probar la conexión',
                    life: 5000
                });
            }
            return;
        }

        try {
            if (toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Conexión SMTP probada exitosamente',
                    life: 5000
                });
            }
        } catch (error) {
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo establecer conexión con el servidor SMTP',
                    life: 5000
                });
            }
        }
    };

    const getDefaultPort = (security: string) => {
        switch (security) {
            case 'ssl': return 465;
            case 'tls': return 587;
            case 'none': return 25;
            default: return 587;
        }
    };

    if (loading) {
        return (
            <Card className="shadow-sm">
                <div className="container-fluid">
                    <div className="text-center p-4">Cargando configuración SMTP...</div>
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
        <>
            <Toast ref={toast} />
            <Card className="shadow-sm" title="Configuración SMTP" subTitle="Configura los parámetros de envío de correos electrónicos">
                <div className="container-fluid">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="smtp_server" className="form-label">
                                        Servidor SMTP <span className="text-danger">*</span>
                                    </label>
                                    <Controller
                                        name="smtp_server"
                                        control={control}
                                        rules={{
                                            required: 'El servidor SMTP es requerido',
                                            pattern: {
                                                value: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: 'Formato de servidor inválido'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <InputText
                                                {...field}
                                                id="smtp_server"
                                                className={`form-control ${errors.smtp_server ? 'is-invalid' : ''}`}
                                                placeholder="smtp.gmail.com"
                                            />
                                        )}
                                    />
                                    {errors.smtp_server && (
                                        <div className="invalid-feedback d-block">
                                            {errors.smtp_server.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="port" className="form-label">
                                        Puerto <span className="text-danger">*</span>
                                    </label>
                                    <Controller
                                        name="port"
                                        control={control}
                                        rules={{
                                            required: 'El puerto es requerido',
                                            min: { value: 1, message: 'Puerto inválido' },
                                            max: { value: 65535, message: 'Puerto inválido' }
                                        }}
                                        render={({ field }) => (
                                            <InputText
                                                {...field}
                                                id="port"
                                                type="number"
                                                className={`form-control ${errors.port ? 'is-invalid' : ''}`}
                                                placeholder={getDefaultPort(selectedSecurity).toString()}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        )}
                                    />
                                    {errors.port && (
                                        <div className="invalid-feedback d-block">
                                            {errors.port.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="security" className="form-label">
                                        Tipo de Seguridad <span className="text-danger">*</span>
                                    </label>
                                    <Controller
                                        name="security"
                                        control={control}
                                        rules={{ required: 'Seleccione el tipo de seguridad' }}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                id="security"
                                                options={securityOptions}
                                                placeholder="Seleccione seguridad"
                                                className={`w-100 ${errors.security ? 'is-invalid' : ''}`}
                                            />
                                        )}
                                    />
                                    {errors.security && (
                                        <div className="invalid-feedback d-block">
                                            {errors.security.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Correo Electrónico <span className="text-danger">*</span>
                                    </label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: 'El correo electrónico es requerido',
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
                                                placeholder="usuario@dominio.com"
                                            />
                                        )}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback d-block">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña <span className="text-danger">*</span>
                                    </label>
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{
                                            required: 'La contraseña es requerida',
                                            minLength: {
                                                value: 6,
                                                message: 'La contraseña debe tener al menos 6 caracteres'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <InputText
                                                {...field}
                                                id="password"
                                                type="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="••••••••"
                                            />
                                        )}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback d-block">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-12 d-flex gap-2">
                                <Button
                                    type="submit"
                                    label="Guardar Configuración"
                                    icon="pi pi-save"
                                    loading={isSubmitting}
                                    className="btn-primary"
                                />
                                <Button
                                    type="button"
                                    label="Probar Conexión"
                                    icon="pi pi-test-tube"
                                    className="btn-outline-secondary"
                                    onClick={handleTestConnection}
                                />
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="alert border">
                                    <h6 className="fw-bold mb-2">Configuraciones comunes:</h6>
                                    <div className="row small">
                                        <div className="col-md-4">
                                            <strong>Gmail:</strong><br />
                                            smtp.gmail.com<br />
                                            Puerto: 587<br />
                                            Seguridad: TLS
                                        </div>
                                        <div className="col-md-4">
                                            <strong>Outlook/Office365:</strong><br />
                                            smtp.office365.com<br />
                                            Puerto: 587<br />
                                            Seguridad: STARTTLS
                                        </div>
                                        <div className="col-md-4">
                                            <strong>Yahoo:</strong><br />
                                            smtp.mail.yahoo.com<br />
                                            Puerto: 465<br />
                                            Seguridad: SSL
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Card>
        </>
    );
};

export default SmtpConfigForm;