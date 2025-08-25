import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { UserAvailabilityFormInputs } from '../components/UserAvailabilityForm'
import { userAvailabilityService } from '../../../services/api'
import { convertDateToHHMM } from '../../../services/utilidades'

export const useUserAvailabilityCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createUserAvailability = async (userAvailabilityData: Omit<UserAvailabilityFormInputs, 'id'>) => {
        setLoading(true)
        try {
            const data = {
                ...userAvailabilityData,
                start_time: convertDateToHHMM(userAvailabilityData.start_time),
                end_time: convertDateToHHMM(userAvailabilityData.end_time),
                free_slots: userAvailabilityData.free_slots.map(slot => ({
                    ...slot,
                    start_time: convertDateToHHMM(slot.start_time),
                    end_time: convertDateToHHMM(slot.end_time)
                }))
            }
            await userAvailabilityService.createForParent(userAvailabilityData.user_id, data)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createUserAvailability }
}
