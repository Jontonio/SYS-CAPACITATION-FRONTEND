import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CachePageFacilitator, CachePageProject } from '../interface/Cache';
import { Project } from 'src/app/features/projects/class/Project';
import { Observable } from 'rxjs';
import { HttpRes } from '../class/HttpRes';
import { Facilitator } from 'src/app/features/facilitators/class/Facilitator';
import { EventProject } from 'src/app/features/projects/class/Event';
import { Participant } from 'src/app/features/projects/class/Participant';
import { Attendance } from 'src/app/features/projects/class/Attendance';
import { User } from '../interface/User';
import { FacilitatorEvent } from 'src/app/features/facilitators/class/FacilitatorEvent';

@Injectable({
  providedIn: 'root'
})
export class BdService {

  URL:string;
  cachePageProject:CachePageProject;
  cachePageFacilitator:CachePageFacilitator;

  constructor(private http:HttpClient) { 
    this.URL = environment.URL_BASE;
    this.cachePageProject = { currentPage:1, year: new Date().getFullYear(), startPage:0 }
    this.cachePageFacilitator = { currentPage:1 }
  }

  /**
   * 
   *  Projects endpoints
   * 
   */

  getProjects(page=1, startPage = 0, year = new Date().getFullYear()){
    return this.http.get<any>(`${this.URL}/project?page=${page}&year=${year}`).pipe(
      tap(res => {
        this.cachePageProject.currentPage = page;
        this.cachePageProject.startPage = startPage; 
        this.cachePageProject.year = year; 
        this.saveLocalStorage('cachePageProject', JSON.stringify(this.cachePageProject));
      })
    )
  }

  getProjectsFromIniaStation(id_inia_station:number, page=1, startPage = 0, year = new Date().getFullYear()){
    return this.http.get<any>(`${this.URL}/projects-from-inia-station/${id_inia_station}?page=${page}&year=${year}`).pipe(
      tap(res => {
        this.cachePageProject.currentPage = page;
        this.cachePageProject.startPage = startPage; 
        this.cachePageProject.year = year; 
        this.saveLocalStorage('cachePageProject', JSON.stringify(this.cachePageProject));
      })
    )
  }

  getProject(id:number):Observable<HttpRes>{
    return this.http.get<HttpRes>(`${this.URL}/project/${id}`);
  }

  createProject(data:Project):Observable<HttpRes>{
    return this.http.post<HttpRes>(`${this.URL}/project`, data);
  }

  editProject(id:number, data:Project):Observable<HttpRes>{
    return this.http.patch<HttpRes>(`${this.URL}/project/${id}`, data);
  }

  deleteProject(id:number):Observable<HttpRes>{
    return this.http.delete<HttpRes>(`${this.URL}/project/${id}`);
  }

    
  /**
   * 
   * Events type endpoint
   * 
  */

  createEventType(data:EventProject){
    return this.http.post<HttpRes>(`${this.URL}/event-type`, data);
  }

  getEventType(){
    return this.http.get<HttpRes>(`${this.URL}/event-type`);
  }

  /**
   * 
   * Events endpoint
   * 
  */

  createEvent(data:EventProject){
    return this.http.post<HttpRes>(`${this.URL}/event`, data);
  }

  getEventsByProject(id_station:number, id_project:number, page=1){
    return this.http.get<HttpRes>(`${this.URL}/get-events-by-project-station/${id_station}/${id_project}?page=${page}`);
  }

  getParticipantsFromEvent(id:number, page=1){
    return this.http.get<HttpRes>(`${this.URL}/get-participants-from-event/${id}?page=${page}`);
  }

  getAllParticipantsFromEvent(id:number){
    return this.http.get<HttpRes>(`${this.URL}/get-all-participant-from-event/${id}`);
  }

  getEvent(id_event:number, id_inia_station?:number){
    return this.http.get<HttpRes>(`${this.URL}/event/${id_event}?id_inia_station=${id_inia_station}`);
  }

  deleteEvent(id:number){
    return this.http.delete<HttpRes>(`${this.URL}/event/${id}`);
  }

  editEvent(id_event:number, data:EventProject){
    return this.http.patch<HttpRes>(`${this.URL}/event/${id_event}`, data);
  }

  searchProjectsBycui(cuiid:string, id_inia_station:number){
    return this.http.get<HttpRes>(`${this.URL}/search-project-by-cui-inia-station?cui=${cuiid}&id_inia_station=${id_inia_station}`);
  }

  searchProjectsBycuiAll(cuiid:string){
    return this.http.get<HttpRes>(`${this.URL}/search-project-by-cui-all?cui=${cuiid}`);
  }

  /**
   * 
   * Reports endpoint
   * 
  */
 
  apiReniec(dni:number):Observable<HttpRes>{
    return this.http.post<HttpRes>(`${this.URL}/api-query-reniec`,{ dni });
  }

  getReportSexParticipants(id_event:number){
    return this.http.get<HttpRes>(`${this.URL}/sex-graph-from-event/${id_event}`);
  }

  getReportChargesParticipants(id_event:number){
    return this.http.get<HttpRes>(`${this.URL}/charge-graph-from-event/${id_event}`);
  }

  getReportCountProjectsOfYears(){
    return this.http.get<HttpRes>(`${this.URL}/count-projects-of-year`);
  }

  getReportEventsFromStation(id_inia_station:number){
    return this.http.get<HttpRes>(`${this.URL}/graph-event-month/${id_inia_station}`);
  }

  searchTable(table:string, term:string, id:number = 1){
    return this.http.get<HttpRes>(`${this.URL}/search-table?table=${table}&term=${term}&id=${id}`);
  }


  /**
   * 
   *  Participant endpoints
   * 
  */

  createParticipant(data:Participant){
    return this.http.post<HttpRes>(`${this.URL}/create-participant`, data);
  }

  updateParticipant(id_card_participant:string, data:Participant){
    return this.http.patch<HttpRes>(`${this.URL}/update-participant/${id_card_participant}`, data);
  }

  existParticipantPreviewAttendance(id_card_participant:number|string){
    return this.http.get<HttpRes>(`${this.URL}/exist-participant-preview-attendance/${id_card_participant}`);
  }

  /**
   * 
   * Station endpoints
   * 
  */
  getStation(id_inia_station:number){
    return this.http.get<HttpRes>(`${this.URL}/inia-station/${id_inia_station}`);
  }

  /**
   * 
   * Attendance endpoints
   * 
  */

  createAttendance(data:any){
    return this.http.post<HttpRes>(`${this.URL}/attendance`, data);
  }

  updateAttendance(id_attendance:number, data:Attendance){
    return this.http.patch<HttpRes>(`${this.URL}/attendance/${id_attendance}`, data);
  }

  deleteAttendance(id_attendance:number){
    return this.http.delete<HttpRes>(`${this.URL}/attendance/${id_attendance}`);
  }

  /**
   * 
   * Facilitator endpoints
   * 
  */

  getFacilitators(page=1){
    return this.http.get<any>(`${this.URL}/facilitator?page=${page}`).pipe(
      tap(res => {
        this.cachePageFacilitator.currentPage = page;        
        this.saveLocalStorage('cachePageFacilitator', JSON.stringify(this.cachePageFacilitator));
      })
    )
  }

  getFacilitator(id_card_facilitator:number){
    return this.http.get<HttpRes>(`${this.URL}/facilitator/${id_card_facilitator}`);
  }

  createFacilitador(data:Facilitator):Observable<HttpRes>{
    return this.http.post<HttpRes>(`${this.URL}/facilitator`, data);
  }

  editFacilitador(id_card_facilitator:number, data:Facilitator):Observable<HttpRes>{
    return this.http.patch<HttpRes>(`${this.URL}/facilitator/${id_card_facilitator}`, data);
  }

  deleteFacilitador(id:number):Observable<HttpRes>{
    return this.http.delete<HttpRes>(`${this.URL}/facilitator/${id}`);
  }

  saveLocalStorage(key:string, data:string){
    sessionStorage.setItem(key, data);
  }

  removeLocalStorage(key:string){
    sessionStorage.removeItem(key);
  }

  getLocalStorage(key:string){
    if(sessionStorage.getItem(key)){
      return JSON.parse(sessionStorage.getItem(key)!);
    }
    return null;
  }

  /**
   * 
   *  Endpoint facilitadors event
   * 
  */ 

  assignFacilitadorToEvent(data:FacilitatorEvent):Observable<HttpRes>{
    return this.http.post<HttpRes>(`${this.URL}/facilitator-event`, data);
  }

  updateFacilitadorToEvent(id_facilitador_event:number, data:FacilitatorEvent){
    return this.http.patch<HttpRes>(`${this.URL}/facilitator-event/${id_facilitador_event}`, data);
  }

  deleteFacilitadorToEvent(id_facilitator_event:number):Observable<HttpRes>{
    return this.http.delete<HttpRes>(`${this.URL}/facilitator-event/${id_facilitator_event}`);
  }



  /**
   * 
   *  Endpoint Charges
   * 
  */

  getCharges(page=1){
    return this.http.get<HttpRes>(`${this.URL}/charge?page=${page}`);
  }

  /**
   * 
   *  Endpoint user
   * 
  */

  addUser(data:User){
    return this.http.post<HttpRes>(`${this.URL}/register-user`, data);
  }

  updateRoleAndPermission(id:number, data:any){
    return this.http.post<HttpRes>(`${this.URL}/assign-user-role/${id}`, data);
  }

  getUsers(page = 1){
    return this.http.get<HttpRes>(`${this.URL}/get-users?page=${page}`);
  }

  getPermissions(){
    return this.http.get<HttpRes>(`${this.URL}/get-permissions`);
  }

  getRoles(){
    return this.http.get<HttpRes>(`${this.URL}/get-roles`);
  }

    /**
   * 
   *  Endpoint Evidence
   * 
  */
  addEvidence(data:FormData){
    return this.http.post<HttpRes>(`${this.URL}/evidence`, data);
  }

  deleteEvidence(id_evidence:number){
    return this.http.delete<HttpRes>(`${this.URL}/evidence/${id_evidence}`);
  }

  getEvidenceFromEvent(id_event:number){
    return this.http.get<HttpRes>(`${this.URL}/evidence-from-event/${id_event}`);
  }

}
