import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { UserFormInputs } from '../UserForm'
import { authService } from '../../../services/api'

export const useUserCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createUser = async (userData: Omit<UserFormInputs, 'id'>) => {
        setLoading(true)
        try {
            await authService.register(userData)
            SwalManager.success()
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        } catch (error) {
            console.log(error);
            ErrorHandler.generic(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createUser }
}
