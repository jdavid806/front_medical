import { useState, useEffect } from 'react';
import { userAbsenceService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { UserAbsenceDto } from '../../models/models';

export const useUserAbsences = () => {
    const [userAbsences, setUserAbsences] = useState<UserAbsenceDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUserAbsences = async () => {
        try {
            const data = await userAbsenceService.active();
            setUserAbsences(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAbsences();
    }, []);

    return {
        userAbsences,
        fetchUserAbsences,
        loading
    };
};
