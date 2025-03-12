import { useState, useEffect } from 'react';
import { AppointmentTypeDto } from '../../models/models';
import { appointmentTypes } from '../../../services/commons';

export const useAppointmentTypesForSelect = () => {
    const [mappedAppointmentTypes, setMappedAppointmentTypes] = useState<{ value: string, label: string }[]>([]);

    const fetchAppointmentTypes = async () => {
        try {
            const data: AppointmentTypeDto[] = appointmentTypes;
            const mappedData = data.map(item => {
                return {
                    value: item.id.toString(),
                    label: item.name
                }
            })
            console.log('appointment types', data, mappedData);
            setMappedAppointmentTypes(mappedData);
        } catch (error) {
            console.error('Error fetching appointment types:', error);
        }
    };

    useEffect(() => {
        fetchAppointmentTypes();
    }, []);

    return { appointmentTypes: mappedAppointmentTypes };
}
