export interface CitaTelemedicina {
  id: number;
  doctor: string;
  fecha: string;
  paciente: string;
  telefono: string;
  correo: string;
  motivo: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
}

export interface SalaVideo {
  roomId: string;
  estado: 'abierta' | 'cerrada';
  apertura: string;
  doctor: string;
  paciente: string;
}

