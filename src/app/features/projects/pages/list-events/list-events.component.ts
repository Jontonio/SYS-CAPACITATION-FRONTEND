import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormEventComponent } from '../../components/form-event/form-event.component';

const ELEMENT_DATA: any[] = [
  { Id_project:1, project_cui: 1552, project_name: 'Hydrogen',},
  { Id_project:2, project_cui: 2252, project_name: 'Helium', },
  { Id_project:3, project_cui: 3324, project_name: 'Proyecto de crianza y fortificación de cuyes distrito de Andahuaylas.', },
  { Id_project:4, project_cui: 4252, project_name: 'Beryllium', },
  { Id_project:5, project_cui: 5539, project_name: 'Boron',},
  { Id_project:6, project_cui: 6725, project_name: 'Carbon',},
  { Id_project:7, project_cui: 7355, project_name: 'Nitrogen',},
  { Id_project:8, project_cui: 8775, project_name: 'Oxygen',},
  { Id_project:9, project_cui: 9378, project_name: 'Fluorine',},
  { Id_project:10, project_cui: 1055, project_name: 'Neon', },
];

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.css']
})
export class ListEventsComponent implements OnInit {

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['Id_project','project_cui','project_name','action'];
  textTest:string = 'MEJORAMIENTO DE LOS SERVICIOS DE INVESTIGACIÓN Y TRANSFERENCIA DE TECNOLOGÍA EN GANADERÍA ALTO ANDINA EN LAS REGIONES DE: APURIMAC, AREQUIPA, AYACUCHO, CUSCO, HUANCAVELICA, JUNÍN, MOQUEGUA, PASCO, PUNO, Y TACNA, 33 DISTRITOS. CUI N°2491159 (PROGAN)MEJORAMIENTO DE LOS SERVICIOS DE INVESTIGACIÓN Y TRANSFERENCIA DE TECNOLOGÍA EN GANADERÍA ALTO ANDINA EN LAS REGIONES DE: APURIMAC, AREQUIPA, AYACUCHO, CUSCO, HUANCAVELICA, JUNÍN, MOQUEGUA, PASCO, PUNO, Y TACNA, 33 DISTRITOS. CUI N°2491159 (PROGAN)'
  showAllText:boolean = false;

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  addEvent(){
    
    const dialogRefRegister = this.dialog.open(FormEventComponent,{
      disableClose:true,
      panelClass:'dialog-class',
    });

    dialogRefRegister.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
