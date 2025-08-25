// interfaceCashRecipe.ts
export interface FormData {
  idFactura: number;
  cliente: string;
  tipo: "Ingreso" | "Egreso" | "Anticipo";
  clientes: string;
  realizarUn: "abono" | "anticipo" | "pago_completo";
  metodoPagoId: string;
  origenDinero: string;
  numeroRecibo: string;
  numeroFactura: string;
  fechaElaboracion: Date | null;
  centroCosto: string;
  valorPagado: number;
  observaciones: string;
  archivo: File | null;
}

export interface MetodoPago {
  id: string;
  method: string;
  category: string;
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
  receiptType?: "advance" | "purchase" | "quotation";
  initialData?: {
    cliente?: string;
    idFactura?: number;
    numeroRecibo?: string;
    numeroFactura?: string;
    fechaElaboracion?: Date;
    valorPagado?: number;
    centreCost?: {
      id: number;
      name: string;
    };
    invoiceType?: "purchase" | "quotation";
    isAdvancePayment?: boolean;
  };
}

// Tipos para la respuesta de la API
export interface CashReceiptResponse {
  id: number;
  type: string;
  status: string;
  subtotal: number;
  discount: number;
  iva: number;
  total_amount: number;
  observations?: string;
  due_date: string;
  paid_amount: number;
  remaining_amount: number;
  quantity_total: number;
  created_at: string;
  updated_at: string;
  third_party_id: number;
  user_id: number;
  includes?: {
    third_party?: ThirdParty;
    payments?: Payment[];
    details?: Detail[];
    invoices?: Invoice[];
  };
}

export interface ThirdParty {
  id: number;
  name: string;
  document_type?: string;
  document_number?: string;
  phone?: string;
  email?: string;
}

export interface Payment {
  id: number;
  payment_method_id: number;
  payment_date: string;
  amount: number;
  credit_card_or_bank?: string;
  credit_card_or_check_number?: string;
  account_number?: string;
  notes?: string;
}

export interface Detail {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  amount: number;
  discount: number;
  subtotal: number;
}

export interface Invoice {
  id: number;
  invoice_id: number;
  applied_amount: number;
  invoice_number?: string;
}

// Tipos para los filtros (si los necesitas)
export interface ReceiptFilters {
  tipoRecibo?: "Ingreso" | "Egreso" | "Anticipo";
  fechaDesde?: Date;
  fechaHasta?: Date;
  cliente?: string;
  estado?: "pendiente" | "pagado" | "anulado";
}