import { httpClient } from "./httpClient.js";

export async function getAppointment(id) {
    try {
        return await httpClient.get(`appointments/${id}`);
    } catch (error) {
        return [];
    }
}

export async function getAppointments() {
    try {
        return await httpClient.get('appointments');
    } catch (error) {
        return [];
    }
}

export async function postAppointment(appointment) {
    try {
        return await httpClient.post('appointments', appointment);
    } catch (error) {
        return null;
    }
}

export async function getAppointmentByUser(idPatient) {
    try {
        return await httpClient.get(`appointments/patient/${idPatient}`);
    } catch (error) {
        return [];
    }
}

export async function getTypeAppointment() {
    try {
        return await httpClient.get('appointments/types');
    } catch (error) {
        return [];
    }
}