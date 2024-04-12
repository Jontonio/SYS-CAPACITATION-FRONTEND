import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { BdService } from 'src/app/core/services/bd.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit {

  formUser!:FormGroup;
  loadding:boolean = false;

  constructor(private fb:FormBuilder, 
              private _db:BdService,
              public _loading:LoaddingService, 
              public dialogModalUserRef: MatDialogRef<FormUserComponent>,
              private _notify:NotificationService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.formUser = this.fb.group({
      name:['', Validators.required],
      email: ['', [Validators.required, Validators.email ]],
      password:['', Validators.required],
    });
  }

  get name(){
    return this.formUser.controls['name'];
  }
  get email(){
    return this.formUser.controls['email'];
  }
  get password(){
    return this.formUser.controls['password'];
  }

  save(){

    if(this.formUser.invalid){
      Object.keys( this.formUser.controls ).forEach( label => this.formUser.controls[ label ].markAllAsTouched() )
      return;
    }

    const data = this.formUser.value;
    this.loadding = true;

    this._db.addUser(data).subscribe({
      next:({ message }) => {
        this.formUser.reset();
        this._notify.success('Registro de usuario', message);
        this.loadding = false;
        this.dialogModalUserRef.close(true);
      },
      error:() => this.loadding = false
    })

  }

}
