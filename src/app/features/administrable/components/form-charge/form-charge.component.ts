import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListChargesComponent } from '../list-charges/list-charges.component';
import { Charges } from 'src/app/features/projects/class/Attendance';

@Component({
  selector: 'app-form-charge',
  templateUrl: './form-charge.component.html',
  styleUrls: ['./form-charge.component.css']
})
export class FormChargeComponent implements OnInit {

  formCharge!:FormGroup;
  isUpdate:boolean = false;

  constructor(private fb:FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data:Charges,
              private dialogRefFormChage: MatDialogRef<FormChargeComponent>,
              private dialogCharges: MatDialog) {
    this.createForm();
  }

  ngOnInit(): void {
    if(this.data){
      this.isUpdate = true;
      this.initializeForm(this.data);
    }
  }

  createForm(){
    this.formCharge = this.fb.group({
      charge_name:[null, [Validators.required, Validators.maxLength(25)]]
    })
  }

  
  get charge_name(){
    return this.formCharge.controls['charge_name'];
  }
  
  initializeForm({charge_name}:Charges){
    this.charge_name.setValue( charge_name );
  }

  save(){

    if(this.formCharge.invalid){
      Object.keys( this.formCharge.controls ).forEach( input => this.formCharge.controls[input].markAllAsTouched() );
      return;
    }

    if(this.isUpdate){
      this.dialogRefFormChage.close(true);
      this.openDialogCharges();
      return;
    }

    console.log(this.formCharge.value);
    this.dialogRefFormChage.close(true);
  }

  openDialogCharges(){

    const dialogRefCharges = this.dialogCharges.open(ListChargesComponent,{
      panelClass:'dialog-class-b',
      width:'700px'
    })

    dialogRefCharges.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });

  }

  cancelDialogFormCharges(){

    this.dialogRefFormChage.close(false);
    
    if(this.isUpdate){
      this.openDialogCharges();
    }

  }


}
