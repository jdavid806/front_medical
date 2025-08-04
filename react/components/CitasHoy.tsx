import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Cita {
    Nombre: string;
    "Numero de documento": string;
    "Fecha Consulta": string;
    "Hora Consulta": string;
    "Profesional asignado": string;
    Entidad: string;
    Estado: string;
}

const CitasHoy = () => {
    const [citas, setCitas] = useState<Cita[]>([]);

    useEffect(() => {
        // Replace this with actual data fetching from your API or data source
        const data = [
            {
                "Nombre": "Juan Pérez",
                "Numero de documento": "108574152",
                "Fecha Consulta": "2025-10-18",
                "Hora Consulta": "08:00 AM",
                "Profesional asignado": "Camilo Villacorte",
                "Entidad": "Entidad 1",
                "Estado": "Pendiente"
            }
        ];
        setCitas(data);
    }, []);

    const header = "Citas de Hoy";

    return (
        <div className="card">
            <DataTable value={citas} header={header}>
                <Column field="Nombre" header="Nombre" />
                <Column field="Numero de documento" header="Número de Documento" />
                <Column field="Fecha Consulta" header="Fecha Consulta" />
                <Column field="Hora Consulta" header="Hora Consulta" />
                <Column field="Profesional asignado" header="Profesional Asignado" />
                <Column field="Entidad" header="Entidad" />
                <Column field="Estado" header="Estado" />
            </DataTable>
        </div>
    );
}

export default CitasHoy;