import React, { useState } from "react";
import { useEffect } from "react";
import { cashRecipes } from "../../../services/api";

interface PurchaseOrderPaymentsResponse {
    data: {
        type: string;
        id: number;
        attributes: {
            id: number;
            type: string;
            status: string;
            subtotal: string;
            discount: string;
            iva: string;
            total_amount: string;
            observations: string;
            due_date: string;
            paid_amount: string;
            remaining_amount: string;
            quantity_total: number;
            user_id: string;
            deleted_at: null;
            created_at: string;
            updated_at: string;
            third_party_id: number;
            action: string;
            purchase_order_id: number;
        };
        links: {
            self: string;
        };
        relationships: {
            payments: Payments;
            third_party: Payments;
        };
        includes: {
            payments: {
                id: number;
                payment_method_id: number;
                payment_method_name: string;
                payment_date: string;
                amount: string;
                credit_card_or_bank: null;
                credit_card_or_check_number: null;
                account_number: null;
                notes: null;
                created_at: string;
                updated_at: string;
            }[];
            third_party: {
                '0': string;
                '1': null;
                id: number;
                external_id: string;
                full_name: string;
                name: string;
                type: string;
                document_type: string;
                document_number: string;
                email: null;
                phone: null;
                address: string;
                first_name: string;
                middle_name: string;
                last_name: string;
                second_last_name: string;
                date_of_birth: string;
                created_at: string;
                updated_at: string;
            };
            purchase_order: {
                id: number;
                third_id: number;
                status: string;
                total_amount: string;
                total_taxes: string;
                deleted_at: null;
                created_at: string;
                updated_at: string;
                type: string;
                due_date: string;
                cost_center_id: number;
                buyer_id: string;
                total_discount: string;
                invoice_id: null;
                total_products: number;
                details: {
                    id: number;
                    purchase_order_id: number;
                    product_id: number;
                    price: number;
                    quantity: number;
                    subtotal: number;
                    total_taxes: number;
                    deleted_at: null;
                    created_at: string;
                    updated_at: string;
                    discount: number;
                }[];
            };
        }
    }[];
    message: string;
    status: number;
}

interface Payments {
    data: {
        type: string;
        id: number;
    }
}

export const usePurchaseOrderPayments = () => {
    const [purchaseOrderPayments, setPurchaseOrderPayments] = useState<PurchaseOrderPaymentsResponse>({
        data: [],
        message: '',
        status: 0
    });

    async function fetchPurchaseOrderPayments({ purchaseOrderId }): Promise<PurchaseOrderPaymentsResponse> {
        try {
            const data = await cashRecipes.getAdvancePaymentsOfPurchaseOrder(purchaseOrderId);
            setPurchaseOrderPayments(data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    return {
        purchaseOrderPayments,
        fetchPurchaseOrderPayments
    };
};