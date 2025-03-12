import { useState, useEffect } from 'react';
import { appointmentTypes } from "../../../services/commons.js";
export const useAppointmentTypesForSelect = () => {
  const [mappedAppointmentTypes, setMappedAppointmentTypes] = useState([]);
  const fetchAppointmentTypes = async () => {
    try {
      const data = appointmentTypes;
      const mappedData = data.map(item => {
        return {
          value: item.id.toString(),
          label: item.name
        };
      });
      console.log('appointment types', data, mappedData);
      setMappedAppointmentTypes(mappedData);
    } catch (error) {
      console.error('Error fetching appointment types:', error);
    }
  };
  useEffect(() => {
    fetchAppointmentTypes();
  }, []);
  return {
    appointmentTypes: mappedAppointmentTypes
  };
};