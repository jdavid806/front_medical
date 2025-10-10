import { useState } from 'react'
import { appointmentService } from '../../../services/api'

export const useAppointmentBulkCreateGroup = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createAppointmentBulkGroup = async (appointments: Omit<any, 'id'>) => {
        setLoading(true)
        try {
            await appointmentService.bulkCreateGroup(appointments)
        } catch (error) {
            console.log(error);
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createAppointmentBulkGroup }
}