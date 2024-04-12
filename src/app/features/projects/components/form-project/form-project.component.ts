import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../class/Project';
import { BdService } from 'src/app/core/services/bd.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';

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
              private dbService:BdService,
              private _notify:NotificationService,
              public _loadding:LoaddingService,
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
      project_cui:[null, [Validators.required, Validators.maxLength(15), Validators.pattern(/^([0-9])*$/)]],
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
      this.editProject();
      return;
    }
    
    this.createProject();
    
  }
  
  createProject(){

    this._loadding.setLoadding(true);

    this.dbService.createProject(this.formProject.value).subscribe({
      next:({ message }) => {
        this.formProject.reset();
        this.dialogRef.close(true);
        this._notify.success('Registro de proyecto', message)
        this._loadding.setLoadding(false);
      }
    })
  }

  editProject(){

    this._loadding.setLoadding(true);
    const { id_project } = this.data;
    this.dbService.editProject(id_project!, this.formProject.value).subscribe({
      next:({ message }) => {
        this.formProject.reset();
        this.dialogRef.close(true);
        this._notify.success('Registro de proyecto', message)
        this._loadding.setLoadding(false);
      }
    })
  }


}
