import { useState, useEffect } from 'react';
import { AppointmentTypeDto } from '../../models/models';
import AppointmentTypeService from '../../../services/api/classes/appointmentTypeService';

export const useAppointmentTypesForSelect = () => {
    const [mappedAppointmentTypes, setMappedAppointmentTypes] = useState<{ value: string, label: string }[]>([]);

    const fetchAppointmentTypes = async () => {
        try {
            const service = new AppointmentTypeService();
            const data: AppointmentTypeDto[] = await service.getAll();
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
