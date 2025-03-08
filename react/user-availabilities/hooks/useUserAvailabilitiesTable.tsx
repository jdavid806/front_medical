import { useState, useEffect } from 'react';
import { UserAvailabilityDto, UserAvailabilityTableItem } from '../../models/models';
import { userAvailabilityService } from '../../../services/api';
import { daysOfWeek } from '../../../services/commons';

export const useUserAvailabilitiesTable = () => {
    const [availabilities, setAvailabilities] = useState<UserAvailabilityTableItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const data = await userAvailabilityService.active() as UserAvailabilityDto[]
        console.log(data);

        const mappedData: UserAvailabilityTableItem[] = data.map(availability => {
            return {
                doctorName: `${availability.user.first_name} ${availability.user.last_name}`,
                appointmentType: availability.appointment_type.name,
                branchName: availability.branch?.address || '',
                daysOfWeek: (JSON.parse(availability.days_of_week) as number[]).map(day => daysOfWeek[day]).join(', '),
                endTime: availability.end_time,
                startTime: availability.start_time
            }
        })
        setAvailabilities(mappedData);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    return { availabilities, fetchData, loading };
};
