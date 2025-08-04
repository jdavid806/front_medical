import { useState } from 'react'
import { Tercero } from '../table/ThridPartiesTable'
import { thirdPartyService } from '../../../../services/api'
import { SwalManager } from '../../../../services/alertManagerImported'
import { ErrorHandler } from '../../../../services/errorHandler'

export const useThirdPartyCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createThirdParty = async (userData: Omit<Tercero, 'id'>) => {
        setLoading(true)
        try {
            const response = await thirdPartyService.create(userData)
            SwalManager.success()
            return response
        } catch (error) {
            console.log(error);
            ErrorHandler.generic(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createThirdParty }
}