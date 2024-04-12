import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventProject } from '../../class/Event';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { District, Provincie, Region } from '../../class/Ubigeo';
import { LocalService } from 'src/app/core/services/local.service';
import { map } from "rxjs/operators";
import { Facilitator } from 'src/app/features/facilitators/class/Facilitator';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { FormProjectComponent } from '../form-project/form-project.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import * as moment from "moment";

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
  facilitators:Facilitator[] = [];

  constructor(private fb:FormBuilder,
              private localService:LocalService,
              private _db:BdService,
              public _loadding:LoaddingService,
              public _notify:NotificationService,
              private dialogRef: MatDialogRef<FormProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog:DataDialog) {
    this.createForm();
    this.getRegions();
  }
  
  ngOnInit(): void {
    
    if(this.dataDialog.isUpdate){
      this.isUpdate = true;
      this.initializateForm(this.dataDialog.data);
    }

    this.getFacilitators();

  }

  getFacilitators(){
    this.localService.getFacilitatorsAssignEvent().subscribe({
      next:({ data }) => {
        this.facilitators = data as Facilitator[];
        if(this.dataDialog.isUpdate){
          this.initializateSelectFacilitador(this.dataDialog.data)
        }
      }
    })
  }

  getRegions(){
    this.localService.getRegions().subscribe({
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
    this.localService.getProvincie()
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
    this.localService.getDistrict()
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
      event_name:[null,[Validators.required, Validators.maxLength(500)]],
      event_topic:[null,[Validators.required, Validators.maxLength(500)]],
      event_region:[null,[Validators.required, Validators.maxLength(20)]],
      event_provincie:[null,[Validators.required, Validators.maxLength(20)]],
      event_district:[null,[Validators.required, Validators.maxLength(20)]],
      id_event_region:[null, Validators.required],
      id_event_provincie:[null, Validators.required],
      id_event_district:[null, Validators.required],
      event_location:[null,[Validators.required, Validators.maxLength(20)]],
      event_datetime_start:[null,[Validators.required]],
      event_datetime_end:[null,[Validators.required]],
      id_card_facilitator:[null,[Validators.required]],
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

  initializateSelectFacilitador(data:EventProject){
    const facilitator = this.getFacilitatorByID(data.id_card_facilitator);
    this.id_card_facilitator.setValue(facilitator);
  }

  get Id_event(){
    return this.formEvent.controls['Id_event'];
  }
  get event_name(){
    return this.formEvent.controls['event_name'];
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
  get id_card_facilitator(){
    return this.formEvent.controls['id_card_facilitator'];
  }

  initializateForm({
    event_name,
    event_topic,
    event_datetime_end,
    event_datetime_start,
    event_location,
    event_region,
    event_provincie,
    event_district,
    id_card_facilitator
  }:EventProject){
    this.event_name.setValue(event_name)
    this.event_topic.setValue(event_topic)
    this.event_region.setValue(event_region)
    this.event_provincie.setValue(event_provincie)
    this.event_district.setValue(event_district)
    this.event_location.setValue(event_location)
    this.event_datetime_start.setValue(event_datetime_start)
    this.event_datetime_end.setValue(event_datetime_end)
    this.id_card_facilitator.setValue(id_card_facilitator);
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

    const data:EventProject = this.formEvent.value as EventProject;

    data.id_project = this.dataDialog.id_parent;
    data.id_event_region = this.id_event_region.value.id_departamento;
    data.id_event_provincie = this.id_event_provincie.value.id_provincia;
    data.id_event_district = this.id_event_district.value.id_distrito;
    data.id_card_facilitator = this.id_card_facilitator.value.id_card_facilitator;
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

  getFacilitatorByID(id:number|string){
    return this.facilitators.find(val => val.id_card_facilitator==id);
  }

  createEvent(event:EventProject){
    this._loadding.setLoadding(true);
    this._db.createEvent(event).subscribe({
      next:({ message }) => {
        this.dialogRef.close(true);
        this._loadding.setLoadding(false);
        this._notify.success('Creación de evento',message);
      }
    })
  }

  updateEvent(id_event:number, event:EventProject){
    this._loadding.setLoadding(true);
    this._db.editEvent(id_event, event).subscribe({
      next:({ message }) => {
        this.dialogRef.close(true);
        this._loadding.setLoadding(false);
        this._notify.success('Actualización de evento', message);
      }
    })
  }

}
