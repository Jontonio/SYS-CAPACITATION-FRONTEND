import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormParticipantComponent } from '../form-participant/form-participant.component';

import * as pdfMake from "pdfmake/build/pdfmake";  
import * as pdfFonts from "pdfmake/build/vfs_fonts"; 
import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';
import { EventProject } from '../../class/Event';
import { FormEventComponent } from '../form-event/form-event.component';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { BdService } from 'src/app/core/services/bd.service';
import { ReportAttendance } from '../../class/ReportAttendance';
import { Attendance } from '../../class/Attendance';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import * as moment from "moment";
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
  },
  {
    text:'Firma',
    bold:true,
    fontSize:10,
    fillColor: '#BFBFBF',
    margin:[0,6,0,0]
  }];

  constructor(private dialog:MatDialog,
              public _loadding:LoaddingService, 
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

  getBase64ImageFromURL(url: string) {
    
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
    
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);
    
        var dataURL = canvas.toDataURL("image/png");
    
        resolve(dataURL);
      };
    
      img.onerror = error => {
        reject(error);
      };
    
      img.src = url;
  })}

  async generatePDF({ evento, list }:ReportAttendance) {  

    let docDefinition = {  
      header:
      {  
        columns: [  
            [  
              {  
                image: await this.getBase64ImageFromURL('./assets/logo-pdf/minagri-inia.png'),
                width: 300, 
                height: 40,
                margin: [30,10,0,0]
              },  
            ],  
            [  
              {  
                image: await this.getBase64ImageFromURL('./assets/logo-pdf/punche-peru.jpg'),
                width: 150, 
                height: 40,
                margin: [0,10,10,0],
                alignment: 'right' 
              },  
            ]  
        ],
        margin:[0,0,0,40] 
      },
      content: [  
        {
          text: "PROYECTO:",
          margin: [0, 0 ,0, 3],
          bold:true         
        }, 
        {
          text: evento.project?.project_name,
          margin: [0, 0 ,0, 5]          
        }, 
        {
          text: "EVENTO:",
          margin: [0,0,0, 3],
          bold:true         
        }, 
        {
          text: evento.event_name,
          margin: [0,0,0, 10]          
        }, 
        {
          columns: [  
            [  
              {  
                text:`REGIÓN: ${evento.event_region}`
              },  
            ],   
            [  
              {  
                text:`PROVINCIA: ${evento.event_provincie}`
              },  
            ],   
            [  
              {  
                text:`DISTRITO: ${evento.event_district}`
              },  
            ],   
          ],
        },
        {
          text: `FECHA: ${moment().format('llll')}`,
          margin: [0,10, 0, 10]          
        }, 
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
            widths: [23, 180, 55, 65, 70, 150, 60, 80 ],
            body: [this.headerTable,...list]
          }
        }
      ],
      pageOrientation: 'landscape',
      pageMargins: [ 40, 65, 40, 60 ],
    }
   
    return new Promise((resolve) => {
      pdfMake.createPdf(docDefinition as any).getDataUrl((dataUrl) => {
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
      { text: attendance.participant.participant_phone, fontSize: 10 },
      { text: ' ', fontSize: 20 }
    ]);

    const reportAttendance:ReportAttendance = {
      evento: this.event,
      list:tableBody
    };

    this.generatePDF(reportAttendance).then( url => {

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

}
