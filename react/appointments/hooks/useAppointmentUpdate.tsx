import React, { useState } from 'react';
import { appointmentService } from '../../../services/api';
import { SwalManager } from '../../../services/alertManagerImported';
import { ErrorHandler } from '../../../services/errorHandler';

export const useAppointmentUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateAppointment = async (id: string, data: any) => {
        setLoading(true);
        try {
            const response = await appointmentService.update(id, data);
            SwalManager.success();
            return response;
        } catch (error) {
            ErrorHandler.generic(error);
            throw error
        } finally {
            setLoading(false);
        }
    };

    return {
        updateAppointment,
        loading
    };
};
