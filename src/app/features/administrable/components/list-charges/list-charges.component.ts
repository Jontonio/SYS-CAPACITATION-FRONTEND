import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormChargeComponent } from '../form-charge/form-charge.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Charges } from 'src/app/features/projects/class/Attendance';



@Component({
  selector: 'app-list-charges',
  templateUrl: './list-charges.component.html',
  styleUrls: ['./list-charges.component.css']
})
export class ListChargesComponent {

  dataSource:Charges[] = []
  displayedColumns: string[] = ['Id_charge', 'charge_name', 'symbol'];

  constructor(private dialog:MatDialog,
              private dialogRef: MatDialogRef<ListChargesComponent>) { }

  edit(charge:Charges){
    
    this.dialogRef.close();

    const dialogRefCharges = this.dialog.open(FormChargeComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:charge,
      width:'500px'
    })

    dialogRefCharges.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  delete(charge:Charges){
    
    this.dialogRef.close();

    const dialogRefDelete = this.openDialog(charge);

    dialogRefDelete.afterClosed().subscribe((result:boolean) => {
      console.log(`Dialog result: ${result}`);
      this.openDialogCharges();
    });

  }

  openDialogCharges(){

    const dialogRefCharges = this.dialog.open(ListChargesComponent,{
      panelClass:'dialog-class-b',
      width:'700px'
    })

    dialogRefCharges.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });

  }

  openDialog({ charge_name }:Charges){
    return this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:{
        title:'Eliminar proyecto',
        message:`¿Esta seguro de eliminar el cargo de ${charge_name}?`
      }
    });
  }


}
