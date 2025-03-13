import { useState, useEffect } from 'react';
import { userAvailabilityService } from '../../../services/api';
import { daysOfWeek } from '../../../services/commons';
import { UserAvailability, UserAvailabilityTableItem } from '../../models/models';

export const useUserAvailabilitiesTable = () => {
    const [availabilities, setAvailabilities] = useState<UserAvailabilityTableItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const data = await userAvailabilityService.active() as UserAvailability[]
        console.log(data);

        const mappedData: UserAvailabilityTableItem[] = data.map(availability => {
            let daysOfWeekArray: string[];
            if (typeof availability.days_of_week === 'string') {
                daysOfWeekArray = JSON.parse(availability.days_of_week);
            } else {
                daysOfWeekArray = availability.days_of_week;
            }

            return {
                id: availability.id.toString(),
                doctorName: `${availability.user.first_name} ${availability.user.last_name}`,
                appointmentType: availability.appointment_type.name,
                branchName: availability.branch?.address || '',
                daysOfWeek: daysOfWeekArray.map(day => daysOfWeek[day]).join(', '),
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
