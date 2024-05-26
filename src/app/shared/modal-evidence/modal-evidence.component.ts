import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { BdService } from 'src/app/core/services/bd.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LoaddingService } from 'src/app/core/services/Loadding.service';

@Component({
  selector: 'app-modal-evidence',
  templateUrl: './modal-evidence.component.html',
  styleUrls: ['./modal-evidence.component.css']
})
export class ModalEvidenceComponent {

  selectedFile: any = null;
  id_event!:number;
  formEvidencie!:FormGroup;
  evidences:any[] = [];

  constructor(private fb:FormBuilder, 
              private _notify:NotificationService,
              private dialog:MatDialog,
              public _loading:LoaddingService,
              private _db:BdService, @Inject(MAT_DIALOG_DATA) 
              public data: DataDialog, ) { 
    this.createForm();
    if(this.data.data){
      this.id_event = this.data.data.id_event;
      // get evidence
      this.getEvidences(this.id_event);
    }
  }

  createForm(){
    this.formEvidencie = this.fb.group({
      evidence_title:[null, Validators.required],
      evidence_description:[null],
      file:[null, Validators.required]
    })
  }

  get evidence_title(){
    return this.formEvidencie.controls['evidence_title'];
  }
  get evidence_description(){
    return this.formEvidencie.controls['evidence_description'];
  }
  get file(){
    return this.formEvidencie.controls['file'];
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  save(){

    if(this.formEvidencie.invalid){
      Object.keys( this.formEvidencie.controls ).forEach(label => {
        this.formEvidencie.controls[ label ].markAllAsTouched()
      })
      return;
    }

    const formData = new FormData();
    formData.append("evidence_title", this.evidence_title.value );
    formData.append("evidence_description", this.evidence_description.value?this.evidence_description.value:"Sin descripción" );
    formData.append("file",  this.selectedFile);
    formData.append("id_event", this.id_event.toString());
    this._loading.setLoadding(true);
    this._db.addEvidence(formData).subscribe({
      next:({ message }) => {
        this._notify.success('Registro de evidencia', message);   
        this.formEvidencie.reset();
        this.getEvidences(this.id_event);
        this._loading.setLoadding(false);
      }
    })
  }

  getEvidences(id_event:number){
    this._loading.setLoadding(true);
    this._db.getEvidenceFromEvent(id_event).subscribe({
      next:({ data }) => {
        this._loading.setLoadding(false);
        this.evidences = data;
      }
    })
  }

  
  openDialogDelete(id_evidence:number){
    const dialogRefAttendance = this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      data:{
        title:'Eliminar evidencia',
        message:`¿Esta seguro de eliminar la evidencia?`
      }
    });

    dialogRefAttendance.afterClosed().subscribe((result:boolean) => {
      if(result){
        this._loading.setLoadding(true);
        this._db.deleteEvidence(id_evidence).subscribe({
          next:({ message }) => {
            this._notify.success('Eliminación de datos', message)
            this._loading.setLoadding(false);
            this.getEvidences(this.id_event);
          }
        })
      }
    });
  }

}
