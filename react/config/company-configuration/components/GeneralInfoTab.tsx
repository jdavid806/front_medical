import React, { useRef, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Company } from '../types/consultorio';
import { useCompany } from '../hooks/useCompanyGenralUpdate';
import { SwalManager } from '../../../../services/alertManagerImported';

interface GeneralInfoTabProps {
    company?: Company;
    onUpdate: (company: Company) => void;
    onValidationChange?: (isValid: boolean) => void;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({ company, onUpdate, onValidationChange }) => {
    const {
        guardarInformacionGeneral,
        mutationLoading,
        mutationError,
        mutationSuccess,
        resetMutation
    } = useCompany();

    const logoFileRef = useRef<HTMLInputElement>(null);
    const watermarkFileRef = useRef<HTMLInputElement>(null);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [watermarkPreview, setWatermarkPreview] = useState<string | null>(null);
    const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
    const [newWatermarkFile, setNewWatermarkFile] = useState<File | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
        watch
    } = useForm<Company>({
        defaultValues: company || {
            legal_name: '',
            document_type: '',
            document_number: '',
            phone: '',
            email: '',
            address: '',
            country: '',
            city: '',
            logo: '',
            watermark: ''
        },
        mode: 'onChange'
    });

    const logoValue = watch('logo');
    const watermarkValue = watch('watermark');
    const formValues = watch();

    // Validar campos requeridos para habilitar siguiente tab
    useEffect(() => {
        const hasRequiredFields = Boolean(
            formValues.legal_name &&
            formValues.document_type &&
            formValues.document_number &&
            formValues.phone &&
            formValues.email &&
            formValues.address &&
            formValues.country &&
            formValues.city
        );
        onValidationChange?.(hasRequiredFields);
    }, [formValues, onValidationChange]);

    useEffect(() => {
        if (company) {
            reset(company);

            if (company.logo) {
                loadImagePreview(company.logo, 'logo');
            }
            if (company.watermark) {
                loadImagePreview(company.watermark, 'watermark');
            }
        }
    }, [company, reset]);

    useEffect(() => {
        if (logoValue && !newLogoFile) {
            loadImagePreview(logoValue, 'logo');
        }
    }, [logoValue, newLogoFile]);

    useEffect(() => {
        if (watermarkValue && !newWatermarkFile) {
            loadImagePreview(watermarkValue, 'watermark');
        }
    }, [watermarkValue, newWatermarkFile]);

    const loadImagePreview = async (imagePath: string, type: 'logo' | 'watermark') => {
        try {
            // @ts-ignore - Usar la función global getUrlImage si existe
            if (typeof getUrlImage === 'function') {
                // @ts-ignore
                const imageUrl = await getUrlImage(imagePath.replaceAll("\\", "/"), true);
                if (type === 'logo') {
                    setLogoPreview(imageUrl);
                } else {
                    setWatermarkPreview(imageUrl);
                }
            } else {
                const baseUrl = 'https://dev.monaros.co';
                const imageUrl = `${baseUrl}/storage/${imagePath.replaceAll("\\", "/")}`;
                if (type === 'logo') {
                    setLogoPreview(imageUrl);
                } else {
                    setWatermarkPreview(imageUrl);
                }
            }
        } catch (error) {
            console.error(`Error loading ${type} preview:`, error);
        }
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewLogoFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setNewLogoFile(null);
            if (logoValue) {
                loadImagePreview(logoValue, 'logo');
            } else {
                setLogoPreview(null);
            }
        }
    };

    const handleWatermarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewWatermarkFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setWatermarkPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setNewWatermarkFile(null);
            if (watermarkValue) {
                loadImagePreview(watermarkValue, 'watermark');
            } else {
                setWatermarkPreview(null);
            }
        }
    };

    const removeLogo = () => {
        setNewLogoFile(null);
        setLogoPreview(null);
        if (logoFileRef.current) {
            logoFileRef.current.value = '';
        }
    };

    const removeWatermark = () => {
        setNewWatermarkFile(null);
        setWatermarkPreview(null);
        if (watermarkFileRef.current) {
            watermarkFileRef.current.value = '';
        }
    };

    const documentTypes = [
        { label: 'Rnc', value: 'RNC' },
        { label: 'Cedula De Entidad', value: 'CC' },
        { label: 'Pasaporte', value: 'PASSPORT' }
    ];

    const countries = [
        { label: 'República Dominicana', value: 'RD' },
        { label: 'Colombia', value: 'CO' },
        { label: 'México', value: 'MX' },
        { label: 'Argentina', value: 'AR' },
        { label: 'Chile', value: 'CL' },
        { label: 'Perú', value: 'PE' }
    ];

    const onSubmit = async (data: Company) => {
        try {
            resetMutation();
            await guardarInformacionGeneral(data, newLogoFile || undefined, newWatermarkFile || undefined);
            SwalManager.success('Informacion General se actualizo correctamente');

            if (mutationSuccess) {
                window["toast"].show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: "Se Actualizo informacion General",
                    life: 5000,
                });
                onUpdate(data);

                setNewLogoFile(null);
                setNewWatermarkFile(null);
                if (logoFileRef.current) logoFileRef.current.value = '';
                if (watermarkFileRef.current) watermarkFileRef.current.value = '';
            }
        } catch (error) {
            window["toast"].show({
                severity: "error",
                summary: "Error",
                detail: "Error Actualizar Informacion General",
                life: 5000,
            });
        }
    };

    return (
        <div className="container-fluid">
            {mutationError && (
                <Message
                    severity="error"
                    text={mutationError}
                    className="mb-3"
                />
            )}

            {mutationSuccess && (
                <Message
                    severity="success"
                    text="Información guardada correctamente"
                    className="mb-3"
                />
            )}

            <div className="row mb-3">
                <div className="col-12">
                    <div className="alert alert-info">
                        <small>
                            <i className="pi pi-info-circle mr-2"></i>
                            <strong>Nota:</strong> Complete todos los campos obligatorios para habilitar el siguiente módulo.
                        </small>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-4">
                    <div className="col-12">
                        <h5 className="fw-bold">Datos Consultorio</h5>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="legal_name" className="form-label">
                            Nombre Comercial <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="legal_name"
                            control={control}
                            rules={{ required: 'El nombre del Consultorio no puede estar vacío' }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="legal_name"
                                    className={`form-control ${errors.legal_name ? 'is-invalid' : ''}`}
                                    placeholder="Nombre Consultorio"
                                />
                            )}
                        />
                        {errors.legal_name && (
                            <div className="invalid-feedback d-block">
                                {errors.legal_name.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="address" className="form-label">
                            Dirección <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="address"
                            control={control}
                            rules={{ required: 'Ingrese una dirección válida' }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="address"
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    placeholder="Ej: Calle 123 #45-67, Bogotá"
                                />
                            )}
                        />
                        {errors.address && (
                            <div className="invalid-feedback d-block">
                                {errors.address.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="document_type" className="form-label">
                            Tipo Documento <span className="text-danger">*</span>
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
                            Documento <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="document_number"
                            control={control}
                            rules={{ required: 'El Documento no puede estar vacío' }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="document_number"
                                    className={`form-control ${errors.document_number ? 'is-invalid' : ''}`}
                                    placeholder="123456789"
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

                <div className="row mb-4">
                    <div className="col-12">
                        <h5 className="fw-bold">Configuración General</h5>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">
                            WhatsApp <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: 'Ingrese un número de WhatsApp válido',
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
                            Correo Electrónico <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Ingrese un correo electrónico válido',
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
                                />
                            )}
                        />
                        {errors.email && (
                            <div className="invalid-feedback d-block">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="country" className="form-label">
                            País <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="country"
                            control={control}
                            rules={{ required: 'Seleccione un país' }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    id="country"
                                    options={countries}
                                    placeholder="Seleccione un país"
                                    className={`w-100 ${errors.country ? 'is-invalid' : ''}`}
                                />
                            )}
                        />
                        {errors.country && (
                            <div className="invalid-feedback d-block">
                                {errors.country.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="city" className="form-label">
                            Ciudad <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="city"
                            control={control}
                            rules={{ required: 'Ingrese una ciudad válida' }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="city"
                                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                    placeholder="Ej: Medellín"
                                />
                            )}
                        />
                        {errors.city && (
                            <div className="invalid-feedback d-block">
                                {errors.city.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="logo" className="form-label">
                            Logo
                        </label>

                        {logoPreview && (
                            <div className="mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="img-thumbnail"
                                        style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                                    />
                                    <Button
                                        type="button"
                                        className="p-button-danger p-button-sm"
                                        onClick={removeLogo}
                                        tooltip="Eliminar logo"
                                    ><i className="fa-solid fa-trash"></i></Button>
                                </div>
                                <small className="text-muted">
                                    {newLogoFile ? 'Nueva imagen seleccionada' : 'Imagen actual'}
                                </small>
                            </div>
                        )}

                        <input
                            ref={logoFileRef}
                            type="file"
                            id="logo"
                            className="form-control"
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                        <small className="text-muted">
                            Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                        </small>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="watermark" className="form-label">
                            Marca de Agua
                        </label>

                        {watermarkPreview && (
                            <div className="mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={watermarkPreview}
                                        alt="Watermark preview"
                                        className="img-thumbnail"
                                        style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                                    />
                                    <Button
                                        type="button"
                                        className="p-button-danger p-button-sm"
                                        onClick={removeWatermark}
                                        tooltip="Eliminar marca de agua"
                                    > <i className="fa-solid fa-trash"></i> </Button>
                                </div>
                                <small className="text-muted">
                                    {newWatermarkFile ? 'Nueva imagen seleccionada' : 'Imagen actual'}
                                </small>
                            </div>
                        )}

                        <input
                            ref={watermarkFileRef}
                            type="file"
                            id="watermark"
                            className="form-control"
                            accept="image/*"
                            onChange={handleWatermarkChange}
                        />
                        <small className="text-muted">
                            Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                        </small>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 d-flex justify-content-between align-items-center">
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
                            label="Guardar"
                            icon="pi pi-save"
                            loading={mutationLoading}
                            disabled={mutationLoading}
                            className="btn-primary"
                        >
                            <i className="fas fa-save" style={{ marginLeft: "10px" }}></i>
                        </Button>
                    </div>
                </div>
            </form >
        </div >
    );
};

export default GeneralInfoTab;