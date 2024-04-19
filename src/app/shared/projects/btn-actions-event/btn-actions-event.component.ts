import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormParticipantComponent } from '../../../features/projects/components/form-participant/form-participant.component';

import * as pdfMake from "pdfmake/build/pdfmake";  
import * as pdfFonts from "pdfmake/build/vfs_fonts"; 

import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';
import { EventProject } from '../../../features/projects/class/Event';
import { FormEventComponent } from '../form-event/form-event.component';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { BdService } from 'src/app/core/services/bd.service';
import { ReportAttendance } from '../../../features/projects/class/Report';
import { Attendance } from '../../../features/projects/class/Attendance';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import * as moment from "moment";
import { LocalService } from 'src/app/core/services/local.service';
import { FormFacilitatorComponent } from '../../facilitator/form-facilitator/form-facilitator.component';
import { ModalEvidenceComponent } from '../../modal-evidence/modal-evidence.component';
import { fileFooter, fileHeader } from 'src/app/helpers/tructureFileReport';
moment.locale('es');

(pdfMake.vfs as any) = pdfFonts.pdfMake.vfs;  


@Component({
  selector: 'app-btn-actions-event',
  templateUrl: './btn-actions-event.component.html',
  styleUrls: ['./btn-actions-event.component.css']
})
export class BtnActionsEventComponent {

  @Input() event!:EventProject;

  @Output() statusEvent = new EventEmitter<boolean>();
  @Output() statusFacilitador = new EventEmitter<boolean>();
  @Output() statusEventFormParticipant = new EventEmitter<boolean>();

  headerTable:any[] = [ 
  {
    text:'N°',
    bold:true,
    fontSize:10,
    fillColor: '#BFBFBF',
    margin:[0,6,0,0]
  },
  { 
    text: 'Apellidos y nombres', 
    bold: true,
    fontSize:10,
    fillColor: '#BFBFBF',
    margin:[0,6,0,0]
  },
  {
    text:'DNI',
    bold: true,
    fontSize:10,
    fillColor: '#BFBFBF',
    margin:[0,6,0,0]
  },
  {
    text:'Comunidad/Institución',
    bold:true,
    fontSize:10,
    fillColor: '#BFBFBF',
  },
  {
    text:'Cargo',
    bold:true,
    fontSize:10,
    fillColor: '#BFBFBF',
    margin:[0,6,0,0]
  },
  {
    text:'Correo electrónico',
    bold:true,
    fontSize:10,
    fillColor: '#BFBFBF',
    margin:[0,6,0,0]
  },
  {
    text:'Celular',
    bold:true,
    fontSize:10,
    fillColor: '#BFBFBF',
    margin:[0,6,0,0]
  }];

  constructor(private dialog:MatDialog,
              public _loadding:LoaddingService,
              private _local:LocalService,
              public _notify:NotificationService, 
              private _db:BdService) {}

  openDialogParticipant(){

    const data:DataDialog = { isUpdate:false, data:this.event };

    const dialogRefParticipant = this.dialog.open(FormParticipantComponent,{
      panelClass:'dialog-class',
      disableClose:true,
      data
    })

    dialogRefParticipant.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.statusEventFormParticipant.emit(result);
      }
    });

  }

  openDialogEditEvent(){

    const data:DataDialog = { isUpdate:true, data: this.event, id_parent:this.event.id_event };

    const dialogRefEditEvent = this.dialog.open(FormEventComponent,{
      panelClass:'dialog-class',
      disableClose:true,
      data
    })

    dialogRefEditEvent.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.statusEvent.emit(result)
      }
    });

  }

  async generatePDFAttendance({ evento, list, nameStation }:ReportAttendance) {  
    
    const fileDefinition = {  
      header: await fileHeader(nameStation),
      footer: fileFooter(),
      content: [  
        // Title project
        {
          text: "PROYECTO:",
          margin: [0, 0 ,0, 3],
          bold:true         
        }, 
        {
          text: evento.project?.project_name,
          margin: [0, 0 ,0, 5]          
        }, // Event and type Event
        {
          columns:[
            [
              {
                columns:[
                  {
                    text:'EVENTO:',
                    width:'auto',
                    alignment: 'left',
                    margin: [0,0,0, 3],
                    bold:true         
                  },
                  {
                    width:'auto',
                    text:evento.event_topic,
                    alignment:'left',
                    margin: [2,0,0, 3],
                  }
                ]
              }
            ],
            [
              {
                columns:[
                  {
                    text:'TIPO DE EVENTO:',
                    width:'auto',
                    alignment: 'left',
                    margin: [0,0,0, 3],
                    bold:true         
                  },
                  {
                    width:'auto',
                    text:evento.event_type.event_type_name,
                    alignment:'left',
                    margin: [2,0,0,3],
                  }
                ]
              }
            ]
          ]
        },
        { // Location
          columns: [  
            [  
              {  
                columns:[
                  {
                    width:'auto',
                    alignment: 'left',
                    text:`REGIÓN:`,
                    margin: [0,2,0,0],
                    bold:true
                  },
                  {
                    width:'auto',
                    alignment: 'left',
                    text: evento.event_region.toUpperCase(),
                    margin: [2,3,0,0],
                  }
                ]
              }  
            ],   
            [  
              {  
                columns:[
                  {
                    width:'auto',
                    alignment: 'left',
                    text:`PROVINCIA:`,
                    margin: [0,3,0,0],
                    bold:true
                  },
                  {
                    width:'auto',
                    alignment: 'left',
                    text: evento.event_provincie.toUpperCase(),
                    margin: [2,3,0,0],
                  }
                ]
              }  
            ],   
            [  
              {  
                columns:[
                  {
                    width:'auto',
                    alignment: 'left',
                    text:`DISTRITO:`,
                    margin: [0,4,0,0],
                    bold:true
                  },
                  {
                    width:'auto',
                    alignment: 'left',
                    text: evento.event_district.toUpperCase(),
                    margin: [2,3,0,0],
                  }
                ]
              }  
            ]
          ]
        }, // Date
        {
          columns:[
            {
              width:'auto',
              alignment: 'left',
              text:`FECHA:`,
              margin: [0,3,0,0],
              bold:true
            },
            {
              width:'auto',
              alignment: 'left',
              text: moment(evento.event_datetime_start).format('DD [de] MMMM [de] YYYY'),
              margin: [2,3,0,0],
            }
          ]
        }, // Facilitator
        {
          text:"FACILITADORES:",
          bold:true,
          margin: [0,3,0,0],
        }, 
        {
          ul:evento.facilitator_event.length>0?evento.facilitator_event.map( fa => {
            return `${fa.facilitator?.facilitator_first_name} ${fa.facilitator?.facilitator_last_name} ${fa.facilitator?.facilitator_name}`
          }):['No se registraron facilitadores'],
          fontSize: 11, 
          margin: [0,3, 0, 0]
        }, 
        // Body and table
        {  
          text: 'REGISTRO DE ASISTENCIA',  
          fontSize: 18,  
          alignment: 'center',  
          bold: true,
          color: '#000',
          margin:[0,0,0,5]
        },
        {
          table: {
            headerRows: 1,
            widths: [23, 220, 80, 80, 80, 150, 70, 80 ],
            body: [this.headerTable,...list]
          }
        }
        
      ],
      pageOrientation: 'landscape',
      pageMargins: [ 40, 65, 40, 60 ],
    }
   
    return new Promise((resolve) => {
      pdfMake.createPdf(fileDefinition as any).getDataUrl((dataUrl) => {
        resolve(dataUrl);
      })
    });
  } 

  openDialogFile(){

    this._loadding.setLoadding(true);

    this._db.getAllParticipantsFromEvent(this.event.id_event).subscribe({
      next:({ data }) => {

        if(data.length==0){
          this._notify.warning('Impresión de datos','Registre al menos un participante en el evento')
          this._loadding.setLoadding(false);
          return;
        }
        
        this.generateTableAndOpenFile(data);

      }
    })

  }

  generateTableAndOpenFile(data:Attendance[]){

    const tableBody = data.map((attendance:Attendance, index:number ) => [
      { text: (index+1).toString(), fontSize: 10 },
      { text: `${attendance.participant.participant_first_name} ${attendance.participant.participant_last_name} ${attendance.participant.participant_name}`, fontSize: 10 },
      { text: attendance.participant.id_card_participant, fontSize: 10 },
      { text: attendance.participant_attendance_location, fontSize: 10 },
      { text: attendance.charges?.charge_name, fontSize: 10 },
      { text: attendance.participant.participant_email, fontSize: 10 },
      { text: attendance.participant.participant_phone, fontSize: 10 }
    ]);

    const reportAttendance:ReportAttendance = {
      evento: this.event,
      list:tableBody,
      nameStation:this._local.getStation().name_inia_station
    };

    this.generatePDFAttendance(reportAttendance).then( url => {

      const data = { url };

      const dialogRefParticipant = this.dialog.open(ShowFileComponent,{
        panelClass:'dialog-class',
        data,
        disableClose:true
      })
  
      dialogRefParticipant.afterClosed().subscribe((result:any) => {
        console.log(`Dialog result: ${result}`);
      });

      this._loadding.setLoadding(false);
      
    })

  }

  addFacilitator(){
    const data:DataDialog = { isUpdate:false, data:this.event };
    const dialogRefRegister = this.dialog.open(FormFacilitatorComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data
    });

    dialogRefRegister.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.statusFacilitador.emit(result);
      }
    });

  }

  addEvidence(){
    const data:DataDialog = { isUpdate:false, data:this.event };
    const dialogRefRegister = this.dialog.open(ModalEvidenceComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data
    });

    dialogRefRegister.afterClosed().subscribe((result:boolean) => {
      if(result){
        // this.statusFacilitador.emit(result);
      }
    });

  }

}
