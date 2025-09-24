interface PaymentMethodModalProps {
  isVisible: boolean;
  onSave: (data: any) => Promise<void> | void;
  initialData?: {
    name: string;
    category: string;
    account: {
      id: number;
      name: string;
    } | null;
    additionalDetails: string;
  };
  onClose: () => void;
  closable?: boolean;
  accounts: {
    id: number;
    name: string;
  }[];
  loading?: boolean;

}