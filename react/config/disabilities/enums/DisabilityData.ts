
import { Patient, UserDto } from "../../../models/models";

export interface DisabilityData {
  id: number;
  patient_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clinical_record_id: number;
  patient: Patient;
  user: UserDto;
}


