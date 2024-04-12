import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Participant } from '../../class/Participant';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { switchMap } from 'rxjs';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { Attendance, Charges } from '../../class/Attendance';

@Component({
  selector: 'app-form-participant',
  templateUrl: './form-participant.component.html',
  styleUrls: ['./form-participant.component.css']
})
export class FormParticipantComponent implements OnInit {

  sexs:any[] = [
    {
      id:1, 
      name:'MASCULINO'
    },
    {
      id:0, 
      name:'FEMENINO'
    }
  ]

  charges:Charges[] = [];
  existParticipantOnDB:boolean = false;

  constructor(private fb:FormBuilder, 
              private _db:BdService,
              public _loadding:LoaddingService,
              private _notify:NotificationService,
              private dialogRef:MatDialogRef<FormParticipantComponent>,
              @Inject(MAT_DIALOG_DATA) private dataDialog:DataDialog) { 
    this.getCharges();
  }
  
  formParticipant!:FormGroup;
  isUpdate:boolean = false;
  
  ngOnInit(): void {

    this.createForm();

    if(this.dataDialog.isUpdate){
      this.isUpdate =  true;
      this.completeForm(this.dataDialog.data);
    }

  }

  createForm(){
    this.formParticipant = this.fb.group({
      id_card_participant:[null,[Validators.required, Validators.maxLength(8), Validators.minLength(8), Validators.pattern(/^[0-9]*$/)]],
      participant_name:[null,[Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      participant_first_name:[null,[Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      participant_last_name:[null,[Validators.required, Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      participant_sex:[null,[Validators.required]],
      id_charge:['',[Validators.required]],
      participant_location:[null],
      participant_email:[null,Validators.email],
      participant_phone:[null, Validators.pattern(/^([0-9])*$/)],
    })
  }

  completeForm(attendance:Attendance){

    const { participant } = attendance;

    this.id_card_participant.setValue(participant.id_card_participant)
    this.participant_name.setValue(participant.participant_name)
    this.participant_first_name.setValue(participant.participant_first_name)
    this.participant_last_name.setValue(participant.participant_last_name)
    this.participant_sex.setValue(this.sexs.find((val) => val.id===participant.participant_sex))
    this.participant_email.setValue(participant.participant_email)
    this.participant_phone.setValue(participant.participant_phone)
    // atthendance information
    this.participant_location.setValue(attendance.participant_attendance_location);
  }

  get id_card_participant(){
    return this.formParticipant.controls['id_card_participant'];
  }
  get participant_name(){
    return this.formParticipant.controls['participant_name'];
  }
  get participant_first_name(){
    return this.formParticipant.controls['participant_first_name'];
  }
  get participant_last_name(){
    return this.formParticipant.controls['participant_last_name'];
  }
  get participant_sex(){
    return this.formParticipant.controls['participant_sex'];
  }
  get participant_location(){
    return this.formParticipant.controls['participant_location'];
  }
  get participant_email(){
    return this.formParticipant.controls['participant_email'];
  }
  get participant_phone(){
    return this.formParticipant.controls['participant_phone'];
  }
  get id_charge(){
    return this.formParticipant.controls['id_charge'];
  }

  completeInfoPartifipant(participant:Participant){

    this.participant_name.setValue(participant.participant_name)
    this.participant_first_name.setValue(participant.participant_first_name)
    this.participant_last_name.setValue(participant.participant_last_name)
    this.participant_email.setValue(participant.participant_email)
    this.participant_phone.setValue(participant.participant_phone)
    this.participant_sex.setValue(this.sexs.find((val) => val.id===participant.participant_sex))
  
    this.participant_name.updateValueAndValidity();
    this.participant_first_name.updateValueAndValidity();
    this.participant_last_name.updateValueAndValidity();
    this.participant_email.updateValueAndValidity();
    this.participant_phone.updateValueAndValidity();
    this.participant_sex.updateValueAndValidity();

    this.participant_name.markAsPristine();
    this.participant_first_name.markAsPristine();
    this.participant_last_name.markAsPristine();
    this.participant_email.markAsPristine();
    this.participant_phone.markAsPristine();
    this.participant_sex.markAsPristine();
  }

  getCharges(){
    this._db.getCharges().subscribe({
      next:({ data }) => {
        this.charges = data.data;
        if(this.dataDialog.isUpdate){
          const { charges } = this.dataDialog.data;
          this.id_charge.setValue(this.getChargeByID(charges.id_charge));
        }
      }
    })
  }

  queryDBInformation(){

    if(this.dataDialog.isUpdate){
      return;
    }

    if(this.id_card_participant.invalid){
      return;
    }

    const dni = this.id_card_participant.value;

    this._loadding.setLoadding(true);

    this._db.existParticipantPreviewAttendance(dni).subscribe({
      next:({ data, message }) => {
        if(data){
          this.existParticipantOnDB = true;
          this.completeInfoPartifipant(data as Participant);
          this._notify.success('Consulta de datos API', message);
          this._loadding.setLoadding(false);
        }else{
          this.existParticipantOnDB = false;
          this.queryAPI();
        }
      }
    })
  }

  queryAPI(){

    if(this.id_card_participant.invalid){
      return;
    }

    const dni = this.id_card_participant.value;

    this._loadding.setLoadding(true);
    this._db.apiReniec(dni).subscribe({
      next:({ message, data }) => {

        this._loadding.setLoadding(false);

        const participant = {
          participant_name: data.name,
          participant_first_name:data.first_name,
          participant_last_name:data.last_name
        }

        this.completeInfoPartifipant(participant as Participant);
        this._notify.success('Consulta de datos API', message);
      }
    })
  }

  save(){

    if(this.formParticipant.invalid){
      Object.keys(this.formParticipant.controls)
            .forEach( input => this.formParticipant.controls[ input ].markAllAsTouched()
      )
      return;
    }

    this._loadding.setLoadding(true);

    if(this.isUpdate){
      // actualizar datos participante
      const participant = this.formParticipant.value as Participant;
      participant.participant_sex = this.participant_sex.value.id;

      const data:Attendance = {
        id_attendance:this.dataDialog.data.id_attendance,
        id_charge: this.id_charge.value.id_charge,
        id_event: this.dataDialog.data.id_event,
        id_card_participant:this.id_card_participant.value,
        participant:this.formParticipant.value,
        participant_attendance_location:this.participant_location.value,
        status: this.dataDialog.data.status
      }

      this.updateParticipant(data);

      return;
    }

    const attendance = {
      id_card_participant: this.id_card_participant.value,
      "id_charge": this.id_charge.value.id_charge,
      "id_event": this.dataDialog.data.id_event,
      "participant_attendance_location":this.participant_location.value,
      "participant_attendance_institution":null,
    }

    // registrar solos asistencia
    if(this.existParticipantOnDB){

      this._db.createAttendance(attendance).subscribe({
        next:({ message }) => {
          this._notify.success('Registro de asistente', message);
          this.dialogRef.close(true);
          this._loadding.setLoadding(false);
        }
      })

      return;
    }

    // registrar participante
    const participant = this.formParticipant.value as Participant;
    participant.participant_sex = this.participant_sex.value.id;

    this._db.createParticipant(participant)
      .pipe(
        switchMap( () => this._db.createAttendance(attendance) )
      )
      .subscribe({
        next:({message}) => {
          this._notify.success('Registro de asistente', message);
          this.dialogRef.close(true);
          this._loadding.setLoadding(false);
        }
    })

  }

  updateParticipant(attendance:Attendance){

    this._db.updateParticipant(attendance.id_card_participant, attendance.participant)
      .pipe( 
        switchMap(() => {
          return this._db.updateAttendance(attendance.id_attendance, attendance);
        })
      )
      .subscribe({
      next:({ message }) =>{
        this._notify.success('Actualización de datos', message);
        this.dialogRef.close(true);
        this._loadding.setLoadding(false);
      }
    })
  }

  getChargeByID(id_charge:number|string){
    return this.charges.find(val => val.id_charge==id_charge);
  }

}
