import { url } from '../globalMedical.js'; // Ruta relativa
import { httpClient } from "./httpClient.js";
export async function getPatients() {
    try {
        const response = await fetch(`${url}patients`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }

        const data = await response.json();      
        return data;  
    } catch (error) {
        console.error("Error al obtener los pacientes:", error);
        return [];
    }
}

export async function getPatientByID(id) {
    try {
        const response = await fetch(`${url}patients/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }

        const data = await response.json();       
        return data;  
    } catch (error) {
        console.error("Error al obtener el paciente:", error);
        return null;
    }
}


export async function postPatient(patient) {
    try {
        const response = await fetch(`${url}patients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            mode: "cors",
            body: JSON.stringify(patient),
        });

        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Paciente creado:", data);
        return data;  
    } catch (error) {
        console.error("Error al crear el paciente:", error);
        return null; 
    }
}  

export async function postclinicalRecord(id) {
    try {
        return await httpClient.post(`patients/${id}/clinical-records`);
    } catch (error) {
        return null;
    }
}
