export type MakePaymentOption = {
  id: number;
  name: string;
};

export type typeProduct = {
  id: string;
  name: string;
  code: string;
  label?: string;
};

export type Product = {
  id: string;
  name: string;
  code: string;
  fixedAssetInfo: string;
};

export type PaymentMethod = {
  id: string;
  method: string | MakePaymentOption;
  authorizationNumber: string;
  value: any;
};

export type InvoiceProduct = {
  id: string;
  description: string;
  typeProduct: string;
  product: string;
  quantity: number;
  price: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  iva: any;
  tax?: any;
  depositId?: any;
  fixedAssetInfo?: any;
  taxAccountingAccountId?: number | null;
  taxChargeId?: number | null;
};
