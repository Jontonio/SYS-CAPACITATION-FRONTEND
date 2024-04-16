import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Facilitator } from 'src/app/features/facilitators/class/Facilitator';

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
              @Inject(MAT_DIALOG_DATA) public data:Facilitator) { 
    this.createForm();
  }

  ngOnInit(): void {
    if(this.data){
      console.log(this.data)
      this.isUpdate = true;
      this.initializateForm(this.data);
    }
  }

  initializateForm({
    id_card_facilitator,
    facilitator_name,
    facilitator_first_name,
    facilitator_last_name,
    facilitator_charge,
    facilitator_profesion,
  }:Facilitator){
    this.id_card_facilitator.setValue(id_card_facilitator)
    this.facilitator_name.setValue(facilitator_name)
    this.facilitator_first_name.setValue(facilitator_first_name)
    this.facilitator_last_name.setValue(facilitator_last_name)
    this.facilitator_charge.setValue(facilitator_charge)
    this.facilitator_profesion.setValue(facilitator_profesion)
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

    if(this.isUpdate){
      this.editFacilitator(data);
      return;
    }

    this.createFacilitator(data);

  }

  createFacilitator(data:Facilitator){
    this._loadding.setLoadding(true);
    this._db.createFacilitadors(data).subscribe({
      next:({ message }) => {
        this._notify.success('Registro facilitador', message);
        this.dialogRef.close(true);
        this._loadding.setLoadding(false);
      }
    })
  }

  editFacilitator(data:Facilitator){
    this._loadding.setLoadding(true);
    const { id_card_facilitator } = data;
    this._db.editFacilitadors(id_card_facilitator, data).subscribe({
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
