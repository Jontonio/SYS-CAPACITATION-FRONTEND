import { Facilitator } from "./Facilitator";

interface FacilitatorEvent {
  id_facilitator_event?:number;
  id_card_facilitator: string;
  id_event: number;
  facilitator_charge: string;
  facilitator?:Facilitator;
}

export {
    FacilitatorEvent
}