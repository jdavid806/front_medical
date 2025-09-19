export interface FormData {
  id?: number;
  idFactura: number;
  cliente: string;
  tipo: string;
  clientes: string;
  realizarUn: string;
  metodoPagoId: string;
  origenDinero: string;
  numeroRecibo: string;
  numeroFactura: any;
  fechaElaboracion: Date | null;
  centroCosto: string;
  valorPagado: number;
  observaciones: string;
  archivo: File | null;
  type?: string;
  subtotal?: number;
  discount?: number;
  iva?: number;
  total_amount?: number;
  due_date?: any;
  quantity_total?: number;
  third_party_id?: number;
  user_id?: number;
}

export interface MetodoPago {
  id: string;
  nombre: string;
}
export interface DropdownOption {
  label: string;
  value: string;
}

export interface NewReceiptBoxModalProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (formData: FormData) => void;
  onSave?: (formData: FormData) => void;
  onSaveAndDownload?: (formData: FormData) => void;
  initialData?: {
    cliente?: string;
    idFactura?: number;
    numeroRecibo?: string;
    numeroFactura?: string;
    fechaElaboracion?: Date;
    valorPagado?: number;
    thirdParty?: {
      id: number;
      name: string;
      document_type?: string;
      document_number?: string;
      phone?: string;
      email?: string;
    };
    centreCost?: {
      id: number;
      name: string;
      code: string;
      description: string;
    };
    invoiceType?: "sale-invoice" | "sale-order" | "purchase-order" | "purchase-invoice" | "quote_of" | "entity";
    subtotal?: number;
    discount?: number;
    iva?: number;
    total_amount?: number;
    due_date?: Date;
    quantity_total?: number;
    third_party_id?: number;
    user_id?: number;
  };
}

export interface ReciboCaja {
  id: string;
  numeroRecibo: string;
  tipoRecibo: string;
  cliente: string;
  identificacion: string;
  origenDinero: string;
  fechaElaboracion: Date;
  centroCosto: string;
  valor: number;
  estado: string;
  numeroFactura: string | null;
}

export interface FiltrosRecibos {
  type: string | null;
  action: string | null;
  thirdParty: any;
  createdAt: (Date | null)[] | null;
  status: string | null;
}

export interface CashReceipt {
  id: number;
  type: "ingreso" | "egreso";
  status: "pendiente" | "pagado" | "anulado";
  subtotal: string;
  discount: string;
  iva: string;
  total_amount: string;
  paid_amount: string;
  remaining_amount: string;
  due_date: string;
  observations: string;
  quantity_total: number;
  created_at: string;
  updated_at: string;
  details: CashReceiptDetail[];
  payments: CashReceiptPayment[];
  invoices: any[]; // Si después agregas estructura para invoices, se puede tipar
  third_party: ThirdParty | null;
}

export interface CashReceiptDetail {
  id: number;
  cash_receipt_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  amount: string;
  discount: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

export interface CashReceiptPayment {
  id: number;
  payment_method_id: number;
  payment_date: string;
  amount: string;
  credit_card_or_bank: string | null;
  credit_card_or_check_number: string | null;
  account_number: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  payable_id: number;
  payable_type: string;
}

export interface ThirdParty {
  id: number;
  name: string;
}
