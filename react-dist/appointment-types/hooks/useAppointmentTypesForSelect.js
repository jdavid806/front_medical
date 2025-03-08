import { useState, useEffect } from 'react';
import { appointmentTypeService } from "../../../services/api/index.js";
export const useAppointmentTypesForSelect = () => {
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const fetchAppointmentTypes = async () => {
    try {
      const data = await appointmentTypeService.getAll();
      const mappedData = data.map(item => {
        return {
          value: item.id.toString(),
          label: item.name
        };
      });
      console.log('appointment types', data, mappedData);
      setAppointmentTypes(mappedData);
    } catch (error) {
      console.error('Error fetching appointment types:', error);
    }
  };
  useEffect(() => {
    fetchAppointmentTypes();
  }, []);
  return {
    appointmentTypes
  };
};