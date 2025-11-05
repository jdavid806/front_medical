import { invoiceService } from "../../../services/api"
import { usePRToast } from "../../hooks/usePRToast";

export const useStoreInvoiceSale = () => {

    const { showServerErrorsToast, toast } = usePRToast();

    const storeInvoiceSale = async (data: any) => {
        try {
            const response = await invoiceService.storeSale(data)
            return response
        } catch (error) {
            console.log(error)
            showServerErrorsToast(error)
            throw error
        }
    }

    return {
        storeInvoiceSale,
        toastRef: toast
    }
}
