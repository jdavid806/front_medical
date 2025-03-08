import { useState, useEffect } from 'react';
import { userAvailabilityService } from "../../../services/api/index.js";
import { daysOfWeek } from "../../../services/commons.js";
export const useUserAvailabilitiesTable = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    const data = await userAvailabilityService.active();
    console.log(data);
    const mappedData = data.map(availability => {
      return {
        doctorName: `${availability.user.first_name} ${availability.user.last_name}`,
        appointmentType: availability.appointment_type.name,
        branchName: availability.branch?.address || '',
        daysOfWeek: JSON.parse(availability.days_of_week).map(day => daysOfWeek[day]).join(', '),
        endTime: availability.end_time,
        startTime: availability.start_time
      };
    });
    setAvailabilities(mappedData);
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);
  return {
    availabilities,
    fetchData,
    loading
  };
};