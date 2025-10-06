import { useState } from "react"
import FarmaciaService from "../../../../services/api/classes/farmaciaService"
import { ProductDto } from "../../../models/models"

export type MedicationVerificationStatus = 'PRODUCT_VERIFIED' | 'STOCK_NOT_ENOUGH' | 'PRODUCT_NOT_FOUND' | 'EMPTY_STOCK'

export interface MedicationVerification {
    available_stock: number,
    message: string, product?:
    ProductDto,
    status: MedicationVerificationStatus
}

export interface VerifyMedicationBulkResponse {
    [key: string]: MedicationVerification
}

export const useVerifyMedicationsBulk = () => {
    const [result, setResult] = useState<VerifyMedicationBulkResponse>()

    const verifyMedicationsBulk = async (products: { identifier: string, name: string, concentration: string, quantity_to_verify: number }[]) => {
        try {
            const service = new FarmaciaService()
            const response: VerifyMedicationBulkResponse = await service.verifyProductsBulk({ products })
            setResult(response)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    return {
        result,
        verifyMedicationsBulk
    }
}
