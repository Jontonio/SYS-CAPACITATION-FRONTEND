import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Permission, Role, UserDB } from 'src/app/core/interface/User';
import { BdService } from 'src/app/core/services/bd.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-modal-permissions',
  templateUrl: './modal-permissions.component.html',
  styleUrls: ['./modal-permissions.component.css']
})
export class ModalPermissionsComponent implements OnInit {

  formPermission!:FormGroup;
  listPermissions:Permission[] = [];
  listPermissionsCache:Permission[] = [];
  permissionSelected:Permission[] =[];
  loadding:boolean = false;
  isSelectedRole:boolean = false;

  roles:Role[] = [];

  constructor(private _db:BdService, 
              private fb:FormBuilder,
              private _notify:NotificationService,
              public dialogModalPerRef: MatDialogRef<ModalPermissionsComponent>,
              @Inject(MAT_DIALOG_DATA) public userDB:UserDB, ) {
    this.getRoles();
    this.getPermissions();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.formPermission = this.fb.group({
      role:[null, Validators.required],
      permissions: this.fb.array([])
    })
  }

  get role(){
    return this.formPermission.controls['role'];
  }

  get permissions(){
    return this.formPermission.controls['permissions'] as FormArray;
  }

  getPermissions(){
    this.loadding = true;
    this._db.getPermissions().subscribe({
      next:({ data }) => {
        this.listPermissions = data;
        this.listPermissionsCache = [...this.listPermissions];

        this.listPermissions.forEach( per => {
          if(this.userDB.roles.length!=0){
            const id = this.userDB.roles[0].permissions?.find(val => per.id==val.id )
            if(id){
              this.permissions.push(new FormControl(true))
              this.permissionSelected.push(per);
            }else{
              this.permissions.push(new FormControl(false))
            }
          }else{
            this.permissions.push(new FormControl(false))
          }
        })
        this.loadding = false;

        const role = this.userDB.roles.length!=0?this.userDB.roles[0].name:'';

        if(role){
          this.role.setValue(role);
          this.isSelectedRole = true;
          this.filteredPermisions(role)
        }

      }
    })
  }

  getRoles(){
    this._db.getRoles().subscribe({
      next:({ data }) => {
        this.roles = data;
      }
    })
  }

  save(){

    if(this.formPermission.invalid){
      Object.keys( this.formPermission.controls )
            .forEach( label => this.formPermission.controls[label].markAllAsTouched())
      return;
    }

    const data = {
      "role":this.role.value,
      "permissions":this.permissionSelected.map(per =>{ return { 'id': per.id, 'name': per.name } })
    }

    this._db.updateRoleAndPermission(this.userDB.id, data).subscribe({
      next:({ message }) => {
        this._notify.success("Asignación de roles y permisos", message);
        this.dialogModalPerRef.close(true);
      }
    })
    
  }

  itemPermission(per:Permission, index:number){

    if(this.permissions.get(String(index))?.value==false || this.permissions.get(String(index))?.value==null){
      if(!this.permissionSelected.find(p => p.id==per.id)){
        this.permissionSelected.push(per);
      }
      return;
    }

    this.permissionSelected = this.permissionSelected.filter(p=> p.id!=per.id)

  }

  selectRol($vent:MatSelectChange): void {
    
    const { value } = $vent;
    this.isSelectedRole = true;
    // Reset other permision choose
    this.permissionSelected = [];
    this.permissions.reset();
    // filter permision by role
    this.filteredPermisions(value);

  }

  filteredPermisions(role:string){

    role = role.toLowerCase();

    // Si es ADMIN listar todo.
    // Si es USER listar todo menos delete.
    // Si es VIEWER listar solo list.

    if(role=='admin'){
      this.listPermissions = this.listPermissionsCache;
    }

    if(role=='user'){
      this.listPermissions = this.listPermissionsCache.filter(per => per.name.includes('create') || per.name.includes('edit') || per.name.includes('list'))
    }

    if(role=='viewer'){
      this.listPermissions = this.listPermissionsCache.filter(per => per.name.includes('list'))
    }

  }

}
