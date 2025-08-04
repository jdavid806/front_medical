import React, { useState } from "react"
import { FixedAssetsFormInputs } from "../interfaces/FixedAssetsFormTypes"
import { assetsService } from "../../../../services/api"
import { SwalManager } from "../../../../services/alertManagerImported"
import { ErrorHandler } from "../../../../services/errorHandler"

export const useCreateAsset = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createAsset = async (userData: Omit<FixedAssetsFormInputs, 'id'>) => {
        setLoading(true)
        try {
            const response = await assetsService.create(userData)
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

    return { loading, createAsset }
} 