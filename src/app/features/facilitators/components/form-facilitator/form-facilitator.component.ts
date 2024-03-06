import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Facilitator } from '../../class/Facilitator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-form-facilitator',
  templateUrl: './form-facilitator.component.html',
  styleUrls: ['./form-facilitator.component.css']
})
export class FormFacilitatorComponent implements OnInit {

  formFacilitator!:FormGroup;
  isUpdate:boolean = false;

  constructor(private fb:FormBuilder,
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
    Id_card_facilitator,
    facilitator_name,
    facilitator_first_name,
    facilitator_last_name,
    facilitator_charge,
    facilitator_profesion,
  }:Facilitator){
    this.Id_card_facilitator.setValue(Id_card_facilitator)
    this.facilitator_name.setValue(facilitator_name)
    this.facilitator_first_name.setValue(facilitator_first_name)
    this.facilitator_last_name.setValue(facilitator_last_name)
    this.facilitator_charge.setValue(facilitator_charge)
    this.facilitator_profesion.setValue(facilitator_profesion)
  }

  createForm(){
    this.formFacilitator = this.fb.group({
      Id_card_facilitator:[null, [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      facilitator_name:[null,[Validators.required, Validators.maxLength(20)]],
      facilitator_first_name:[null,[Validators.required, Validators.maxLength(20)]],
      facilitator_last_name:[null,[Validators.required, Validators.maxLength(20)]],
      facilitator_charge:[null,[Validators.required, Validators.maxLength(20)]],
      facilitator_profesion:[null,[Validators.required, Validators.maxLength(25)]],
    })
  }

  get Id_card_facilitator(){
    return this.formFacilitator.controls['Id_card_facilitator'];
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
  }

}
