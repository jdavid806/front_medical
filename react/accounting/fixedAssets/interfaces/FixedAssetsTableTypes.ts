export interface FixedAsset {
  type: string;
  id: number;
  attributes: {
    description: null | string;
    brand: null | string;
    model: null | string;
    serial_number: null | string;
    internal_code: null | string;
    status: null | string;
    user_id: number;
  };
  relationships: {
    category: {
      data: {
        type: string;
        id: null | number;
      };
      links: {
        self: string;
      };
    };
    accountingAccount: {
      data: {
        type: string;
        id: null;
      };
      links: {
        self: string;
      };
    };
    invoices: {
      data: {
        type: string;
        id: any[];
      };
    };
  };
  includes: {
    invoices: any[];
    category: any | null;
  };
  links: {
    self: string;
  };
}

export type FixedAssetsFormInputs = {
  id?: string;
  assetName: string;
  assetCategory: string;
  brand: string;
  model: string;
  serialNumber: string;
  internalCode: string;
  description: string;
  acquisitionDate: Date;
  purchaseValue: number;
  currentValue: number;
  status: string;
  location: string;
  assignedTo: string;
};

// Definir las props del modal
export type FixedAssetsModalProps = {
  isVisible: boolean;
  onHide: () => void;
  asset: FixedAsset | null;
  onSave: (asset: FixedAssetsFormInputs) => void;
};

export type Filters = {
  assetName: string;
  assetCategory: string | null;
  brand: string;
  internalCode: string;
  status: string | null;
  dateRange: Date[] | null;
};