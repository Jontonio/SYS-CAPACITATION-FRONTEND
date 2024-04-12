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

@Injectable({
  providedIn: 'root'
})
export class BdService {

  URL:string;
  cachePageProject:CachePageProject;
  cachePageFacilitator:CachePageFacilitator;

  constructor(private http:HttpClient,
              @Inject('LOCALSTORAGE') private localStorage: Storage) { 
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
   * Events endpoint
   * 
  */

  createEvent(data:EventProject){
    return this.http.post<HttpRes>(`${this.URL}/event`, data);
  }

  getEventsByProject(id:number, page=1){
    return this.http.get<HttpRes>(`${this.URL}/get-events-by-project/${id}?page=${page}`);
  }

  getParticipantsFromEvent(id:number, page=1){
    return this.http.get<HttpRes>(`${this.URL}/get-participants-from-event/${id}?page=${page}`);
  }

  getAllParticipantsFromEvent(id:number){
    return this.http.get<HttpRes>(`${this.URL}/get_all_participant_from_event/${id}`);
  }

  getEvent(id:number){
    return this.http.get<HttpRes>(`${this.URL}/event/${id}`);
  }

  deleteEvent(id:number){
    return this.http.delete<HttpRes>(`${this.URL}/event/${id}`);
  }

  editEvent(id:number, data:EventProject){
    return this.http.patch<HttpRes>(`${this.URL}/event/${id}`, data);
  }

  searchProjectsReports(cuiid:string){
    return this.http.get<HttpRes>(`${this.URL}/search-project_report?cui=${cuiid}`);
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
   * Facilitator endpoints
   * 
  */

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

  getFacilitators(page=1){
    return this.http.get<any>(`${this.URL}/facilitator?page=${page}`).pipe(
      tap(res => {
        this.cachePageFacilitator.currentPage = page;        
        this.saveLocalStorage('cachePageFacilitator', JSON.stringify(this.cachePageFacilitator));
      })
    )
  }


  createFacilitadors(data:Facilitator):Observable<HttpRes>{
    return this.http.post<HttpRes>(`${this.URL}/facilitator`, data);
  }

  editFacilitadors(id:number, data:Facilitator):Observable<HttpRes>{
    return this.http.patch<HttpRes>(`${this.URL}/facilitator/${id}`, data);
  }

  deleteFacilitador(id:number):Observable<HttpRes>{
    return this.http.delete<HttpRes>(`${this.URL}/facilitator/${id}`);
  }

  saveLocalStorage(key:string, data:string){
    this.localStorage.setItem(key, data);
  }

  removeLocalStorage(key:string){
    this.localStorage.removeItem(key);
  }

  getLocalStorage(key:string){
    if(this.localStorage.getItem(key)){
      return JSON.parse(this.localStorage.getItem(key)!);
    }
    return null;
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

}
