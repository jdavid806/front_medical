import React, { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { UserAvailabilityFormInputs } from '../components/UserAvailabilityForm';
import { userAvailabilityService } from '../../../services/api';
import { formatTime } from '../../../services/utilidades';

export const useUserAvailabilityUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateUserAvailability = async (id: string, data: UserAvailabilityFormInputs) => {
        setLoading(true);
        try {
            const newData = {
                ...data,
                start_time: formatTime(data.start_time),
                end_time: formatTime(data.end_time),
                free_slots: data.free_slots.map(slot => ({
                    ...slot,
                    start_time: formatTime(slot.start_time),
                    end_time: formatTime(slot.end_time)
                }))
            }
            await userAvailabilityService.update(id, newData);
            SwalManager.success();
        } catch (error) {
            ErrorHandler.generic(error);
            throw error
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUserAvailability,
        loading
    };
};
