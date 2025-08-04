export interface PurchaseOrderProduct {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
  total_taxes: number;
}

export interface PurchaseOrderPayment {
  payment_method_id: string;
  authorization_number?: string;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  type: string;
  third_party: {
    id: string;
    name: string;
  };
  third_id: any;
  cost_center_id: string;
  centre_cost?: {
    id: string;
    name: string;
  };
  buyer_id: string;
  user?: {
    id: string;
    full_name: string;
  };
  created_at: string;
  due_date: string;
  total_amount: number;
  status: string;
  details?: PurchaseOrderProduct[];
  payments?: PurchaseOrderPayment[];
}

export interface PurchaseBillingProps {
  purchaseOrder?: PurchaseOrder;
  onClose: () => void;
}

export interface Deposit {
  type: string;
  id: string;
  attributes: {
    name: string;
    notes: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  links: {
    self: string;
  };
}
