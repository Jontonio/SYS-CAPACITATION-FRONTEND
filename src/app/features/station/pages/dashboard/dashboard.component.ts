import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BdService } from 'src/app/core/services/bd.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { CacheProjectDash } from 'src/app/features/Interface/Cache';
import { ModalSearchProjectComponent } from 'src/app/features/dashboard/components/modal-search-project/modal-search-project.component';
import { ResReport } from 'src/app/features/dashboard/interfaces/ResReport';
import { fileFooter, fileHeader } from 'src/app/helpers/tructureFileReport';
import * as pdfMake from "pdfmake/build/pdfmake";  
import * as pdfFonts from "pdfmake/build/vfs_fonts"; 
import { ShowFileComponent } from 'src/app/shared/show-file/show-file.component';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { LocalService } from 'src/app/core/services/local.service';
import { ReportMain } from 'src/app/features/projects/class/Report';
var SvgSaver = require('svgsaver');                

(pdfMake.vfs as any) = pdfFonts.pdfMake.vfs;  

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: any;
  dataPieChart:ResReport[] = [];
  dataHorizonBarChart:ResReport[] = [];
  dataVerticalBarChart:ResReport[] =[];
  projectDash!:CacheProjectDash;

  /** var of graphics */
  g1Title:string = 'Cantidad de participantes por cargo';
  g2Title:string = 'Cantidad de hombres y mujeres';

  constructor(
    private dialog:MatDialog,
    private _db:BdService,
    private _loadding:LoaddingService,
    private authService: AuthenticationService,
    private _local:LocalService,
    private _cache:CacheService,
    private titleService: Title) {
      this.getReportCountProjectsOfYears();
  }

  ngOnInit() {

    this.currentUser = this.authService.getCurrentUser();
    this.titleService.setTitle('SIRDEV - dashboard');

    if(this._cache.projectDash){
      this.projectDash = this._cache.projectDash;
      this.getReportSexParticipants(this.projectDash.id_event);
      this.getReportChargesParticipants(this.projectDash.id_event);
    }
    
  }

  dialogSearch(){

    const dialogRefSearch = this.dialog.open(ModalSearchProjectComponent,{
      disableClose:false,
      panelClass:'dialog-class',
      width:'500px',
    })

    dialogRefSearch.afterClosed().subscribe((data:CacheProjectDash) => {
      if(!data) return;
      this.projectDash = data;
      const { id_event } = this.projectDash;
      this.getReportSexParticipants(id_event)
      this.getReportChargesParticipants(id_event);
    });

  }

  getReportSexParticipants(id_event:number){
    this._db.getReportSexParticipants(id_event).subscribe({
      next:({ data }) => {
        this.dataPieChart = data;
      }
    })
  }

  getReportChargesParticipants(id_event:number){
    this._db.getReportChargesParticipants(id_event).subscribe({
      next:({ data }) => {
        this.dataHorizonBarChart = data;
      }
    })
  }

  getReportCountProjectsOfYears(){
    this._db.getReportCountProjectsOfYears().pipe(
      map( (res) => {
        res.data = res.data.map((val:ResReport) => {
          val.name = val.name.toString()
          return val
        })
        return res;
      })
    ).subscribe({
      next:({ data }) => {
        this.dataVerticalBarChart = data;
      }
    })
  }

  saverLibraryIMG(id:string, donwload:boolean = false, fileName:string = 'IMG-SIRDEV') {

    const svgsaver = new SvgSaver();   
    console.log(svgsaver)                  
    const svg = document.querySelector(`#${id}`);  

    if(donwload){
      svgsaver.asPng(svg, `${fileName}.png`);  
      return;
    }   

    return svgsaver.getUri(svg);  
  }

  downloadImg(g:string){
    switch (g) {
      case 'g1':
        this.saverLibraryIMG(g, true, this.g1Title.replace(' ','-'))
        break;
      case 'g2':
        this.saverLibraryIMG(g,true, this.g2Title.replace(' ','-'))
        break;
      default:
        break;
    }
  }
  
  async generatePDFAllReport({ eventProject, nameStation }:ReportMain) {  
    
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
          text: eventProject.project?.project_name,
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
                    text:eventProject.event_topic,
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
                    text:eventProject.event_type.event_type_name,
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
                    text: eventProject.event_region.toUpperCase(),
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
                    text: eventProject.event_provincie.toUpperCase(),
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
                    text: eventProject.event_district.toUpperCase(),
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
              text: moment(eventProject.event_datetime_start).format('DD [de] MMMM [de] YYYY'),
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
          ul:eventProject.facilitator_event.length>0?eventProject.facilitator_event.map( fa => {
            return `${fa.facilitator?.facilitator_first_name} ${fa.facilitator?.facilitator_last_name} ${fa.facilitator?.facilitator_name}`
          }):['No se registraron facilitadores'],
          fontSize: 11, 
          margin: [0,3, 0, 0]
        },
        {  
          text: 'REPORTE DE DETALLADO',  
          fontSize: 13,  
          alignment: 'center',  
          bold: true,
          color: '#000',
          margin:[0,5,0,5]
        },
        {
          text:'Cantidad de participantes por cargo',
          fontSize:10
        }
      
      ],
      pageOrientation: 'portrait',
      pageMargins: [ 30, 65, 30, 50 ],
    }
   
    return new Promise((resolve) => {
      pdfMake.createPdf(fileDefinition as any).getDataUrl((dataUrl) => {
        resolve(dataUrl);
      })
    });
  } 

  openDialogFileReport(){

    if(!this.projectDash){
      return;
    }

    this._db.getEvent(this.projectDash.id_event, this._local.getStationID()).subscribe({
      next:({ data }) => {
        
        const mainReport:ReportMain = {
          eventProject:data,
          nameStation: this._local.getStation().name_inia_station
        }

        this.generatePDFAllReport(mainReport).then( url => {
    
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
    })
    
  }

}
