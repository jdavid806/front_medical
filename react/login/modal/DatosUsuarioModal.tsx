import React from 'react';
import { InputText } from 'primereact/inputtext';

interface DatosUsuarioStepProps {
    formData: {
        nombreCentro: string;
        nombreUsuario: string;
        codPais: string;
        phone: string;
        email: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        nombreCentro: string;
        nombreUsuario: string;
        codPais: string;
        phone: string;
        email: string;
    }>>;
}

export const DatosUsuarioModal: React.FC<DatosUsuarioStepProps> = ({
    formData,
    setFormData
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="mb-3">
                    <label htmlFor="nombreCentro" className="form-label">
                        Nombre del centro médico *
                    </label>
                    <InputText
                        id="nombreCentro"
                        name="nombreCentro"
                        value={formData.nombreCentro}
                        onChange={handleChange}
                        className="w-100"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="codPais" className="form-label">
                        Código de país *
                    </label>
                    <InputText
                        id="codPais"
                        name="codPais"
                        value={formData.codPais}
                        onChange={handleChange}
                        className="w-100"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Correo electrónico *
                    </label>
                    <InputText
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-100"
                    />
                </div>
            </div>

            {/* Columna derecha */}
            <div className="col-md-6">
                <div className="mb-3">
                    <label htmlFor="nombreUsuario" className="form-label">
                        Nombre de usuario *
                    </label>
                    <InputText
                        id="nombreUsuario"
                        name="nombreUsuario"
                        value={formData.nombreUsuario}
                        onChange={handleChange}
                        className="w-100"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">
                        Teléfono *
                    </label>
                    <InputText
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-100"
                    />
                </div>
            </div>
        </div>
    );
};