import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../class/Project';

@Component({
  standalone:false,
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.css']
})
export class FormProjectComponent implements OnInit {

  formProject!:FormGroup;
  isUpdate:boolean=false;

  constructor(private fb:FormBuilder, 
              private dialogRef: MatDialogRef<FormProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data:Project) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data){
      this.isUpdate = true;
      this.initializeForm(this.data);
    }
  }

  createForm(){
    this.formProject = this.fb.group({
      project_cui:[null, [Validators.required, Validators.maxLength(15)]],
      project_name:[null, [Validators.required, Validators.maxLength(250)]]
    })
  }

  initializeForm({project_cui, project_name}:Project){
    this.project_name.setValue( project_name );
    this.project_cui.setValue( project_cui );
  }

  get project_cui(){
    return this.formProject.controls['project_cui']    
  }

  get project_name(){
    return this.formProject.controls['project_name'] 
  }

  save(){

    if(this.formProject.invalid){
      Object.keys( this.formProject.controls )
            .forEach( input => this.formProject.controls[input].markAsTouched() )
      return;
    }

    if(this.isUpdate){
      console.log("Datos actualizados")
      this.formProject.reset();
      this.dialogRef.close();
      return;
    }

    this.formProject.reset();
    this.dialogRef.close();
    console.table("Datos guardados")

  }


}
