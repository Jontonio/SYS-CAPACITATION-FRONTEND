import { FacilitatorEvent } from "../../admin/class/FacilitatorEvent";
import { EventType } from "./EventType";
import { Project } from "./Project";

interface EventProject {
  id_event_type: number;
  id_inia_station: number;
  event_topic: string;
  event_region: string;
  event_provincie: string;
  event_district: string;
  event_location: string;
  event_datetime_start: string;
  event_datetime_end: string;
  id_project: number;
  id_event_region: string;
  id_event_provincie: string;
  id_event_district: string;
  event_type:EventType;
  updated_at: string;
  created_at: string;
  id_event: number;
  project?:Project;
  facilitator_event:FacilitatorEvent[]
}

export {
    EventProject
}