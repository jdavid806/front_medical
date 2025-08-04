// interfaces Depositos
export interface Deposito {
  id: number;
  name: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}



export interface DepositoForm {
  id?: number;
  name: string;
  notes: string;
}


//Interfaces Filtros

export interface FiltrosDepositos {
  nombre: string;
  fechaCreacion: Date[] | null;
}

export interface EstadoFiltroOption {
  label: string;
  value: string;
}