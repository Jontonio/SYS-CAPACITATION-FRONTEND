import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Facilitator } from 'src/app/features/admin/class/Facilitator';
import { FacilitatorEvent } from 'src/app/features/admin/class/FacilitatorEvent';

@Component({
  selector: 'app-form-facilitator',
  templateUrl: './form-facilitator.component.html',
  styleUrls: ['./form-facilitator.component.css']
})
export class FormFacilitatorComponent implements OnInit {

  formFacilitator!:FormGroup;
  isUpdate:boolean = false;

  constructor(private fb:FormBuilder,
              private _db:BdService,
              public _loadding:LoaddingService,
              private _notify:NotificationService,
              private dialogRef: MatDialogRef<FormFacilitatorComponent>,
              @Inject(MAT_DIALOG_DATA) public dataDialog:DataDialog) { 
    this.createForm();
  }

  ngOnInit(): void {
    if(this.dataDialog.isUpdate){
      console.log(this.dataDialog)
      this.isUpdate = true;
      this.initializateForm(this.dataDialog.data);
    }
  }

  initializateForm({ facilitator_charge, facilitator }:FacilitatorEvent){
    this.id_card_facilitator.setValue(facilitator!.id_card_facilitator);
    this.facilitator_name.setValue(facilitator!.facilitator_name);
    this.facilitator_first_name.setValue(facilitator!.facilitator_first_name);
    this.facilitator_last_name.setValue(facilitator!.facilitator_last_name);
    this.facilitator_profesion.setValue(facilitator!.facilitator_profesion);
    // facilitador event
    this.facilitator_charge.setValue(facilitator_charge);
  }

  createForm(){
    this.formFacilitator = this.fb.group({
      id_card_facilitator:[null, [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      facilitator_name:[null,[Validators.required, Validators.maxLength(20)]],
      facilitator_first_name:[null,[Validators.required, Validators.maxLength(20)]],
      facilitator_last_name:[null,[Validators.required, Validators.maxLength(20)]],
      facilitator_charge:[null,[Validators.required, Validators.maxLength(20)]],
      facilitator_profesion:[null,[Validators.required, Validators.maxLength(25)]],
    })
  }

  completeForm({ facilitator_name, facilitator_first_name, facilitator_last_name }:Facilitator){
    this.facilitator_name.setValue( facilitator_name )
    this.facilitator_first_name.setValue( facilitator_first_name )
    this.facilitator_last_name.setValue( facilitator_last_name )
  }

  get id_card_facilitator(){
    return this.formFacilitator.controls['id_card_facilitator'];
  }
  get facilitator_name(){
    return this.formFacilitator.controls['facilitator_name'];
  }
  get facilitator_first_name(){
    return this.formFacilitator.controls['facilitator_first_name'];
  }
  get facilitator_last_name(){
    return this.formFacilitator.controls['facilitator_last_name'];
  }
  get facilitator_charge(){
    return this.formFacilitator.controls['facilitator_charge'];
  }
  get facilitator_profesion(){
    return this.formFacilitator.controls['facilitator_profesion'];
  }

  save(){

    if(this.formFacilitator.invalid){
      Object.keys( this.formFacilitator.controls ).forEach( input => this.formFacilitator.controls[input].markAllAsTouched());
      return;
    }

    const data = this.formFacilitator.value;

    if(this.dataDialog.isUpdate){
      this.editFacilitator(data, { facilitator_charge: this.facilitator_charge.value } as FacilitatorEvent);
      return;
    }

    this.createFacilitator(data);
  }

  createFacilitator(facilitador:Facilitator){
    this._loadding.setLoadding(true);
    this._db.getFacilitator(facilitador.id_card_facilitator).subscribe({
      next:({ data }) => {
        if(data){
          // update data facilitator
          this._db.editFacilitador(this.id_card_facilitator.value, data)
          .pipe(
            // assign facilitator to event 
            switchMap(({ data }) => {
              const dataAssing:FacilitatorEvent = {
                'id_card_facilitator':this.id_card_facilitator.value,
                'id_event':(!this.dataDialog.isUpdate && this.dataDialog.data)?this.dataDialog.data.id_event:0,
                'facilitator_charge':this.facilitator_charge.value
              }
              return this._db.assignFacilitadorToEvent(dataAssing)
            })
          )
          .subscribe({
            next:({ message }) => {
              this._notify.success('Asignación de facilitador', message);
              this.dialogRef.close(true);
              this._loadding.setLoadding(false);
            }
          })
        }else{
          // register facilitator and assign to event
          this._db.createFacilitador(facilitador)
          .pipe(
            switchMap(({ data }) => {
              const dataAssing:FacilitatorEvent = {
                'id_card_facilitator':data.id_card_facilitator,
                'id_event':(!this.dataDialog.isUpdate && this.dataDialog.data)?this.dataDialog.data.id_event:0,
                'facilitator_charge':this.facilitator_charge.value
              }
              return this._db.assignFacilitadorToEvent(dataAssing)
            })
          )
          .subscribe({
            next:({ message }) => {
              this._notify.success('Asignación de facilitador', message);
              this.dialogRef.close(true);
              this._loadding.setLoadding(false);
            }
          })
        }
      }
    })
  }

  editFacilitator(dataFacilitador:Facilitator, dataFacilitadorEvent:FacilitatorEvent){
    this._loadding.setLoadding(true);
    this._db.editFacilitador(this.id_card_facilitator.value, dataFacilitador)
    .pipe(
      switchMap((res) => this._db.updateFacilitadorToEvent(this.dataDialog.data.id_facilitator_event, dataFacilitadorEvent))
    )
    .subscribe({
      next:({ message }) => {
        this._notify.success('Actualización de datos facilitador', message);
        this.dialogRef.close(true);
        this._loadding.setLoadding(false);
      }
    })
  }

  queryAPI(){
    
    if(this.id_card_facilitator.invalid) return;
    this._loadding.setLoadding(true);
    this._db.apiReniec(this.id_card_facilitator.value).subscribe({
      next:({message, data}) => {
        
        const faciltador = {
          id_card_facilitator:data.id_card,
          facilitator_name:data.name,
          facilitator_first_name:data.first_name,
          facilitator_last_name:data.last_name
        }

        this.completeForm(faciltador as Facilitator);
        this._loadding.setLoadding(false);
        this._notify.success('Consulta de datos API', message);
      }
    })
  }

}
