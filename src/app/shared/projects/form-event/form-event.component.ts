import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventProject } from '../../../features/projects/class/Event';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { District, Provincie, Region } from '../../../features/projects/class/Ubigeo';
import { LocalService } from 'src/app/core/services/local.service';
import { debounceTime, map } from "rxjs/operators";
import { Facilitator } from 'src/app/features/facilitators/class/Facilitator';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { FormProjectComponent } from '../../../features/projects/components/form-project/form-project.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import * as moment from "moment";
import { Subject } from 'rxjs';
import { Project } from '../../../features/projects/class/Project';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectionListChange } from '@angular/material/list';
import { EventType } from '../../../features/projects/class/EventType';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.css']
})
export class FormEventComponent implements OnInit {

  formEvent!:FormGroup;
  isUpdate:boolean = false;
  regions:Region[] = [];
  provincies:Provincie[] = [];
  districts:District[] = [];
  projects:Project[] = [];
  projectOptions:Project[] = [];
  eventTypes:EventType[] = [];
  projectSelected!:Project;

  debouncer = new Subject();

  constructor(private fb:FormBuilder,
              private _localService:LocalService,
              private _db:BdService,
              public _loadding:LoaddingService,
              public _notify:NotificationService,
              private dialogFormEventRef: MatDialogRef<FormEventComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog:DataDialog) {
    this.getEventTypes();
    this.createForm();
    this.getRegions();
  }
  
  ngOnInit(): void {
    
    if(this.dataDialog.isUpdate){
      this.isUpdate = true;
      this.initializateForm(this.dataDialog.data);
    }

    // auto complete data if not update but is help
    if(this.dataDialog.data && !this.dataDialog.isUpdate){
      this.projectSelected = this.dataDialog.data;
      this.id_project.setValue(this.dataDialog.data)
    }

    this.debouncer
    .pipe(
      debounceTime(300)
    ).subscribe({
      next: (cui) => {
        this.searchProject(cui as string);
      }
    })

  }

  displayFn(project: Project):string {
    return project && project.project_cui.toString() ? project.project_cui.toString() : '';
  }

  searchProject(cuuid:string){
    this._db.searchProjectsBycui(cuuid).subscribe({
      next:({ data }) => this.projectOptions = data
    })
  }

  onOptionSelectedProject(event: MatAutocompleteSelectedEvent): void {
    this.projectSelected = event.option.value as Project;
  }

  optionSelectedEvent(event: MatSelectionListChange): void {
    console.log(event.options[0].value);
  }

  getEventTypes(){
    this._db.getEventType().subscribe({
      next:({ data }) => {
        this.eventTypes = data.data;
      }
    })
  }

  getRegions(){
    this._localService.getRegions().subscribe({
      next:(value) => {
        this.regions = value;

        if(this.dataDialog.isUpdate){
          this.initializateSelectRegion(this.dataDialog.data)
        }

      },
      error:(e) => console.log(e),
    })
  }

  getProvincies(id_padre_ubigeo:number){
    this._localService.getProvincie()
    .pipe(
      map( provincies => provincies.filter( val => val.id_padre_ubigeo == id_padre_ubigeo ))
    )
    .subscribe({
      next:(value) => {
        this.provincies = value;
        if(this.dataDialog.isUpdate){
          this.initializateSelectProvincie(this.dataDialog.data)
        }
      },
      error:(e) => console.log(e),
    })
  }

  getDistricts(id_padre_ubigeo:number){
    this._localService.getDistrict()
    .pipe(
      map( districts => districts.filter( val => val.id_padre_ubigeo == id_padre_ubigeo ))
    )
    .subscribe({
      next:(value) => {
        this.districts = value
        if(this.dataDialog.isUpdate){
          this.initializateSelectDistrict(this.dataDialog.data)
        }
      },
      error:(e) => console.log(e),
    })
  }

  createForm(){
    this.formEvent = this.fb.group({
      event_topic:[null,[Validators.required, Validators.maxLength(500)]],
      event_region:[null,[Validators.required, Validators.maxLength(20)]],
      event_provincie:[null,[Validators.required, Validators.maxLength(20)]],
      event_district:[null,[Validators.required, Validators.maxLength(20)]],
      id_event_region:[null, Validators.required],
      id_event_type:[null, Validators.required],
      id_event_provincie:[null, Validators.required],
      id_event_district:[null, Validators.required],
      event_location:[null,[Validators.required, Validators.maxLength(20)]],
      event_datetime_start:[null,[Validators.required]],
      event_datetime_end:[null,[Validators.required]],
      id_project:[null,[Validators.required]],
    })
  }

  initializateSelectRegion(data:EventProject){
    if(!data) return;
    const region = this.getRegionByID(data.id_event_region);
    this.id_event_region.setValue(region);
  }

  initializateSelectProvincie(data:EventProject){
    if(!data) return;
    const region = this.getProvincieByID(data.id_event_provincie);
    this.id_event_provincie.setValue(region);
  }

  initializateSelectDistrict(data:EventProject){
    if(!data) return;
    const region = this.getDistrictByID(data.id_event_district);
    this.id_event_district.setValue(region);
  }

  get id_event_type(){
    return this.formEvent.controls['id_event_type'];
  }
  get id_event(){
    return this.formEvent.controls['id_event'];
  }
  get event_topic(){
    return this.formEvent.controls['event_topic'];
  }
  get event_region(){
    return this.formEvent.controls['event_region'];
  }
  get event_provincie(){
    return this.formEvent.controls['event_provincie'];
  }
  get event_district(){
    return this.formEvent.controls['event_district'];
  }
  get event_location(){
    return this.formEvent.controls['event_location'];
  }
  get event_datetime_start(){
    return this.formEvent.controls['event_datetime_start'];
  }
  get event_datetime_end(){
    return this.formEvent.controls['event_datetime_end'];
  }
  get id_event_region(){
    return this.formEvent.controls['id_event_region'];
  }
  get id_event_provincie(){
    return this.formEvent.controls['id_event_provincie'];
  }
  get id_event_district(){
    return this.formEvent.controls['id_event_district'];
  }
  get id_project(){
    return this.formEvent.controls['id_project'];
  }

  initializateForm({
    event_topic,
    event_datetime_end,
    event_datetime_start,
    event_location,
    event_region,
    event_provincie,
    event_district,
    id_event_type,
    id_project
  }:EventProject){
    this.formEvent.disable()
    this.id_event_type.setValue(id_event_type);
    this.event_topic.setValue(event_topic)
    this.event_region.setValue(event_region)
    this.event_provincie.setValue(event_provincie)
    this.event_district.setValue(event_district)
    this.event_location.setValue(event_location)
    this.event_datetime_start.setValue(event_datetime_start)
    this.event_datetime_end.setValue(event_datetime_end);
    this.getProject(id_project)
  }

  regionSelected(region:Region){
    if(!region) return;
    this.getProvincies(region.id_departamento)
    this.event_region.setValue(region.nombre_departamento);
    this.id_event_provincie.setValue(null);
    this.id_event_district.setValue(null);
  }

  provincieSelected(provincie:Provincie){
    if(!provincie) return;
    this.getDistricts(provincie.id_provincia);
    this.id_event_district.setValue(null);
    this.event_provincie.setValue(provincie.nombre_provincia);
  }

  districtSelected(district:District){
    if(!district) return;
    this.event_district.setValue(district.nombre_distrito);
  }

  save(){
  
    if(this.formEvent.invalid){
      Object.keys( this.formEvent.controls ).forEach( input => this.formEvent.controls[ input ].markAllAsTouched())
      return;
    }

    if(!this.projectSelected){
      this.id_project.reset();
      this.id_project.markAllAsTouched();
      return;
    }

    // TODO: el ID de inia station solo completa si el usario tiene un station
    const data:EventProject = this.formEvent.value as EventProject;
    data.id_inia_station = this._localService.getStation().id_inia_station;
    data.id_project = this.projectSelected.id_project;
    data.id_event_region = this.id_event_region.value.id_departamento;
    data.id_event_provincie = this.id_event_provincie.value.id_provincia;
    data.id_event_district = this.id_event_district.value.id_distrito;
    data.event_datetime_start = moment(data.event_datetime_start).format('YYYY-MM-DD\THH:mm');
    data.event_datetime_end = moment(data.event_datetime_end).format('YYYY-MM-DD\THH:mm');
    
    if(this.isUpdate){
      data.id_event = this.dataDialog.data.id_event;
      this.updateEvent(data.id_event, data);
      return;
    }
    
    this.createEvent(data);
    
  }

  getProvincieByID(id:number|string){
    return this.provincies.find(val => val.id_provincia==id);
  }

  getRegionByID(id:number|string){
    return this.regions.find(val => val.id_departamento==id);
  }

  getDistrictByID(id:number|string){
    return this.districts.find(val => val.id_distrito==id);
  }

  createEvent(event:EventProject){
    this._loadding.setLoadding(true);
    this._db.createEvent(event).subscribe({
      next:({ message }) => {
        this.dialogFormEventRef.close(true);
        this._loadding.setLoadding(false);
        this._notify.success('Creación de evento',message);
      }
    })
  }

  updateEvent(id_event:number, event:EventProject){
    this._loadding.setLoadding(true);
    this._db.editEvent(id_event, event).subscribe({
      next:({ message }) => {
        this.dialogFormEventRef.close(true);
        this._loadding.setLoadding(false);
        this._notify.success('Actualización de evento', message);
      }
    })
  }

  searchValue(data:string){
    this.debouncer.next( data );
  }

  getProject(id_project:number){
    this._loadding.setLoadding(true);
    this._db.getProject(id_project).subscribe({
      next:({ data }) => {
        this.id_project.setValue( data );
        this.projectSelected = data;
        this._loadding.setLoadding(false);
        this.formEvent.enable();
      }
    })
  }

}
