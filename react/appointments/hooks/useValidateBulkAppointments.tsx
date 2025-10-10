import { useState } from 'react'
import { appointmentService } from '../../../services/api'

export const useValidateBulkAppointments = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const validateBulkAppointments = async (appointments: Omit<any, 'id'>) => {

        setLoading(true)

        try {

            return await appointmentService.bulkValidate({ appointments })

        } catch (error) {

            console.error(error);

            throw error;

        } finally {

            setLoading(false)
        }
    }

    return { loading, validateBulkAppointments }
}
