import { FixedAssetsFormInputs } from "../../../accounting/fixedAssets/interfaces/FixedAssetsFormTypes";

export type TypeOption = {
  id: number;
  name: string;
  code?: string;
};

export type Supplier = {
  id: number;
  fullName: string;
};

export type CostCenterOption = {
  id: number;
  name: string;
};

export type MakePaymentOption = {
  id: number;
  name: string;
};

export type TypeProduct = {
  id: string;
  name: string;
};

export type Product = {
  name: string;
  code: string;
};

export type PaymentMethod = {
  id: string;
  method: string;
  authorizationNumber: string;
  value: any;
};

export interface LotInfo {
  lotNumber: string;
  expirationDate: Date | null;
  deposit: string;
  quantity: number;
}

export type InvoiceProduct = {
  id: string;
  description: string;
  typeProduct: string | null;
  product: string | null;
  quantity: number;
  price: number;
  discount: number;
  discountType?: 'percentage' | 'fixed';
  tax: any;
  depositId?: any;
  lotInfo: LotInfo[];
  productName?: string;
  fixedAssetInfo?: FixedAssetsFormInputs;
  showLotForm?: boolean;
  isExpanded?: boolean;
  taxChargeId?: number | null;
  accountingAccount?: any;
};

export interface ProductColumnBodyProps {
  rowData: InvoiceProduct;
  type: string | null;
  onChange: (value: string) => void;
  products?: any[]; // Añade esta línea
}
