import { useState } from 'react'
import { packagesService } from '../../../services/api'
import { usePRToast } from '../../hooks/usePRToast'
import { PrescriptionPackagesFormData } from '../PrescriptionPackagesForm'

export const useCreatePrescriptionPackage = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const { toast, showSuccessToast, showServerErrorsToast } = usePRToast();

    const createPrescriptionPackage = async (data: Omit<PrescriptionPackagesFormData, 'id'>) => {
        setLoading(true)
        try {
            const response = await packagesService.createPackages(data)
            showSuccessToast({
                title: "Paquete creado",
                message: "Paquete creado exitosamente"
            })
            return response
        } catch (error) {
            console.log(error);
            showServerErrorsToast(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createPrescriptionPackage, toast }
}

