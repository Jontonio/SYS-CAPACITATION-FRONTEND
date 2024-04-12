import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiReniec } from "src/app/features/projects/class/ApiReniec";
import { District, Provincie, Region } from "src/app/features/projects/class/Ubigeo";
import { environment } from '../../../environments/environment';
import { HttpRes } from "../class/HttpRes";
import { Project } from "src/app/features/projects/class/Project";
import { EventProject } from "src/app/features/projects/class/Event";

@Injectable({
    providedIn:'root'
})
export class LocalService{

    URL:string;
    years:number[] = [];
    project!:Project;
    event!:EventProject;

    constructor(private http:HttpClient){

        this.URL = environment.URL_BASE;

        this.getYearsReports().subscribe({
            next:({ data }) => {
                this.years = data;
            }
        })

    }

    setProject(project:Project){
        this.project = project;
    }

    getProject(){
        return this.project;
    }

    setEvent(event:EventProject){
        this.event = event;
    }

    getEvent(){
        return this.event;
    }

    getYears(){
        return this.years;
    }

    getRegions(){
        return this.http.get<Region[]>('assets/resources/departamento.json');
    }
    getProvincie(){
        return this.http.get<Provincie[]>('assets/resources/provincia.json');
    }
    getDistrict(){
        return this.http.get<District[]>('assets/resources/distrito.json');
    }

    getYearsReports(){
        return this.http.get<HttpRes>(`${this.URL}/get-years-report`);
    }

    getFacilitatorsAssignEvent(){
        return this.http.get<HttpRes>(`${this.URL}/get-list-to-assign-event`);
    }
}