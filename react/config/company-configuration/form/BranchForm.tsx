import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Branch, BranchFormData } from '../types/consultorio';


interface BranchFormProps {
    branch?: Branch;
    onSubmit: (data: BranchFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

const BranchForm: React.FC<BranchFormProps> = ({ branch, onSubmit, onCancel, loading = false }) => {
    const [formData, setFormData] = useState<BranchFormData>({
        name: '',
        address: '',
        phone: '',
        email: '',
        city: '',
        country: '',
        is_main: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const countries = [
        { label: 'República Dominicana', value: 'RD' },
        { label: 'Colombia', value: 'CO' },
        { label: 'México', value: 'MX' },
        { label: 'Argentina', value: 'AR' },
        { label: 'Chile', value: 'CL' },
        { label: 'Perú', value: 'PE' }
    ];

    useEffect(() => {
        if (branch) {
            setFormData({
                name: branch.name,
                address: branch.address,
                phone: branch.phone,
                email: branch.email,
                city: branch.city,
                country: branch.country,
                is_main: branch.is_main
            });
        }
    }, [branch]);

    const handleInputChange = (field: keyof BranchFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre de la sede es requerido';
        if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
        if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
        if (!formData.email.trim()) newErrors.email = 'El correo electrónico es requerido';
        if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
        if (!formData.country) newErrors.country = 'El país es requerido';

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid">
                <div className="col-12">
                    <div className="field">
                        <label htmlFor="name" className="block">Nombre de la Sede *</label>
                        <InputText
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={errors.name ? 'p-invalid' : ''}
                            placeholder="Nombre de la sede"
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                </div>

                <div className="col-12">
                    <div className="field">
                        <label htmlFor="address" className="block">Dirección *</label>
                        <InputText
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className={errors.address ? 'p-invalid' : ''}
                            placeholder="Dirección completa"
                        />
                        {errors.address && <small className="p-error">{errors.address}</small>}
                    </div>
                </div>

                <div className="col-6">
                    <div className="field">
                        <label htmlFor="phone" className="block">Teléfono *</label>
                        <InputText
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={errors.phone ? 'p-invalid' : ''}
                            placeholder="+57 300 123 4567"
                        />
                        {errors.phone && <small className="p-error">{errors.phone}</small>}
                    </div>
                </div>

                <div className="col-6">
                    <div className="field">
                        <label htmlFor="email" className="block">Correo Electrónico *</label>
                        <InputText
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={errors.email ? 'p-invalid' : ''}
                            placeholder="sede@empresa.com"
                        />
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>
                </div>

                <div className="col-6">
                    <div className="field">
                        <label htmlFor="city" className="block">Ciudad *</label>
                        <InputText
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={errors.city ? 'p-invalid' : ''}
                            placeholder="Ciudad"
                        />
                        {errors.city && <small className="p-error">{errors.city}</small>}
                    </div>
                </div>

                <div className="col-6">
                    <div className="field">
                        <label htmlFor="country" className="block">País *</label>
                        <Dropdown
                            id="country"
                            value={formData.country}
                            options={countries}
                            onChange={(e) => handleInputChange('country', e.value)}
                            className={errors.country ? 'p-invalid' : ''}
                            placeholder="Seleccione un país"
                        />
                        {errors.country && <small className="p-error">{errors.country}</small>}
                    </div>
                </div>

                <div className="col-12">
                    <div className="field-checkbox">
                        <Checkbox
                            inputId="is_main"
                            checked={formData.is_main}
                            onChange={(e) => handleInputChange('is_main', e.checked || false)}
                        />
                        <label htmlFor="is_main" className="ml-2">Sede principal</label>
                    </div>
                </div>

                <div className="col-12 flex justify-content-end gap-2 mt-4">
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        className="p-button-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    />
                    <Button
                        label={branch ? 'Actualizar' : 'Crear'}
                        icon="pi pi-check"
                        loading={loading}
                        type="submit"
                    />
                </div>
                
            </div>
        </form>
    );
};

export default BranchForm;