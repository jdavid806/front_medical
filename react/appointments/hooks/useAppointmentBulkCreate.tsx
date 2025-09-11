import { useState } from 'react'
import { appointmentService } from '../../../services/api'

export const useAppointmentBulkCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createAppointmentBulk = async (appointments: Omit<any, 'id'>, patientId: string) => {
        setLoading(true)
        try {
            await appointmentService.bulkCreate(appointments, patientId)
        } catch (error) {
            console.log(error);
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createAppointmentBulk }
}
