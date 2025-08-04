import { useState, useEffect } from 'react';
import { UserSpecialtyDto } from '../../models/models';
import { userSpecialtyService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';

export const useUserSpecialties = () => {
    const [userSpecialties, setUserSpecialties] = useState<UserSpecialtyDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUserSpecialties = async () => {
        try {
            const data = await userSpecialtyService.getAll();
            const mappedData = data.map((item: UserSpecialtyDto) => {
                return {
                    ...item,
                    label: item.name,
                };
            })
            setUserSpecialties(mappedData);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserSpecialties();
    }, []);

    return {
        userSpecialties,
        fetchUserSpecialties,
        loading
    };
};