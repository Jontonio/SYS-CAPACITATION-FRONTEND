import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormChargeComponent } from '../form-charge/form-charge.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

export interface Charge {
  Id_charge?: number;
  charge_name: string;
}

const ELEMENT_DATA: Charge[] = [
  {Id_charge: 1, charge_name: 'Hydrogen hola mundo como estas??'},
  {Id_charge: 2, charge_name: 'cargo nuevo'},
  {Id_charge: 3, charge_name: 'Lithium'},
  {Id_charge: 4, charge_name: 'Beryllium'},
  {Id_charge: 5, charge_name: 'Boron'},
];

@Component({
  selector: 'app-list-charges',
  templateUrl: './list-charges.component.html',
  styleUrls: ['./list-charges.component.css']
})
export class ListChargesComponent {

  displayedColumns: string[] = ['Id_charge', 'charge_name', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(private dialog:MatDialog,
              private dialogRef: MatDialogRef<ListChargesComponent>) { }

  edit(charge:Charge){
    
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

  delete(charge:Charge){
    
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

  openDialog({ charge_name }:Charge){
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
