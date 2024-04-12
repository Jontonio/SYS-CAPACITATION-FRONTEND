import { Facilitator } from "../../facilitators/class/Facilitator";
import { Project } from "./Project";

class EventProject{
    id_event:number;
    event_name:string;
    event_topic:string;
    event_region:string;
    event_provincie:string;
    event_district:string;
    id_event_region:number;
    id_event_provincie:number;
    id_event_district:number;
    event_location:string;
    event_datetime_start:Date|string;
    event_datetime_end:Date|string;
    id_project?:number;
    id_card_facilitator:number;
    facilitator?:Facilitator;
    project?:Project;

    constructor(
        id_event:number,
        event_name:string,
        event_topic:string,
        event_region:string,
        event_provincie:string,
        event_district:string,
        event_location:string,
        id_event_provincie:number,
        id_event_district:number,
        id_event_region:number,
        event_datetime_start:Date,
        event_datetime_end:Date,
        id_card_facilitator:number,
        id_project?:number,
        facilitator?:Facilitator,
        project?:Project
    ){
        this.id_event = id_event;
        this.event_name = event_name;
        this.event_topic = event_topic;
        this.event_region = event_region;
        this.event_provincie = event_provincie;
        this.event_district = event_district;
        this.id_event_region = id_event_region;
        this.id_event_provincie = id_event_provincie;
        this.id_event_district = id_event_district;
        this.event_location = event_location;
        this.event_datetime_start = event_datetime_start;
        this.event_datetime_end = event_datetime_end;
        this.id_project = id_project;
        this.id_card_facilitator = id_card_facilitator;
        this.facilitator = facilitator;
        this.project = project;
    }
}

export {
    EventProject
}