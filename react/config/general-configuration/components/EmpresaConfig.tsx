import React from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';

export const EmpresaConfig: React.FC = () => {
    return (
        <Card title="Datos de la Empresa">
            <div className="p-fluid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="nombre">Nombre de la Empresa</label>
                    <InputText id="nombre" placeholder="Ingrese el nombre de la empresa" />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="rif">RIF</label>
                    <InputText id="rif" placeholder="Ingrese el RIF" />
                </div>
            </div>
        </Card>
    );
};