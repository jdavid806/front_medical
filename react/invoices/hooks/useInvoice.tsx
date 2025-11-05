import React, { useState } from "react";
import { invoiceService } from "../../../services/api";

export const useInvoice = () => {

    const [invoice, setInvoice] = useState<any | null>(null);

    const fetchInvoice = async (invoiceId: string) => {
        try {
            const response = await invoiceService.get(invoiceId);
            setInvoice(response.data);
        } catch (error) {
            console.error("Error fetching invoice:", error);
        }
    };

    return {
        invoice,
        fetchInvoice
    };
}
