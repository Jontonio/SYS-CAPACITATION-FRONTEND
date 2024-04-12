import { Participant } from "./Participant";

interface Attendance {
  id_attendance: number;
  participant_attendance_location?: string;
  participant_attendance_institution?: string;
  status: string;
  id_event: number;
  id_card_participant: string;
  id_charge: number;
  created_at?: Date;
  updated_at?: Date;
  participant: Participant;
  charges?: Charges;
}

interface Charges {
  id_charge: number;
  charge_name: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

export {
    Attendance,
    Charges
}
