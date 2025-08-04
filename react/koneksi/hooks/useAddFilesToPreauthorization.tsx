import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { addFilesToPreauthorization as koneksiAddFilesToPreauthorization } from '../../../services/koneksiService'
import { SwalManager } from '../../../services/alertManagerImported'

export const useAddFilesToPreauthorization = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const addFilesToPreauthorization = async (preauthorizationId: string, formData: FormData, urlParams: any) => {
        setLoading(true)
        try {
            const response = await koneksiAddFilesToPreauthorization({
                preauthorizationId: preauthorizationId,
                formData: formData,
                urlParams: urlParams
            })
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

    return { loading, addFilesToPreauthorization }
}
