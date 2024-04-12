import { EventProject } from "./Event";

export interface Project {
    id_project?:number;
    project_name: string;
    project_cui: number;
    status?:boolean;
    events:EventProject[];
}