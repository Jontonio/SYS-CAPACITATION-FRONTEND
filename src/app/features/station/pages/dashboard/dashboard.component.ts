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
import { tap } from 'rxjs';

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
      this.getReportEvents();
  }

  ngOnInit() {

    this.currentUser = this.authService.getCurrentUser();
    this.titleService.setTitle('SIRDAN - panel principal');

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
    this._db.getReportSexParticipants(id_event)
    .pipe(
      map( val => {
         let suma = 0;
         val.data.map((element: ResReport) => suma += Number(element.value));
         val.data = val.data.map((element: ResReport) => {
          const newItem = {...element, percentage: `${((element.value/suma)*100).toFixed(1)}%` } as ResReport;
          element = newItem;
          return element;
        })
        return val;
      })
    ) 
    .subscribe({
      next:({ data }) => {
        this.dataPieChart = data;
      }
    })
  }

  getReportChargesParticipants(id_event:number){
    this._db.getReportChargesParticipants(id_event)
      .pipe(
        map( val => {
           let suma = 0;
           val.data.map((element: ResReport) => suma += Number(element.value));
           val.data = val.data.map((element: ResReport) => {
            const newItem = {...element, percentage: `${((element.value/suma)*100).toFixed(1)}%` } as ResReport;
            element = newItem;
            return element;
          })
          return val;
        })
      )  
      .subscribe({
      next:({ data }) => {
        this.dataHorizonBarChart = data;
      }
    })
  }

  getReportEvents(){
    this._db.getReportEventsFromStation(this._local.getStationID()).pipe(
      map( (res) => {
        res.data = res.data.map((val:ResReport) => {
          val.name = val.name.charAt(0).toUpperCase() + val.name.slice(1).toLowerCase()
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

  getSvgAsBase64(id: string): Promise<string> {

    return new Promise((resolve, reject) => {
      const svgSaver = new SvgSaver();
      const svg = document.querySelector(`#${id}`) as HTMLElement;
      // Obtener el SVG clonado
      const clonedSvg = svgSaver.cloneSVG(svg);

      // Crear un contenedor div para el SVG clonado
      const container = document.createElement('div');
      container.appendChild(clonedSvg);

      // Crear una imagen temporal
      const img = new Image();

      // Cuando la imagen se cargue, la convertiremos a JPG y la codificaremos en base64
      img.onload = () => {
        // Crear un lienzo (canvas) para convertir la imagen a JPG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar la imagen en el lienzo
        ctx!.drawImage(img, 0, 0);

        // Obtener la imagen como un blob en formato JPG
        canvas.toBlob((blob) => {
          // Convertir el blob a base64
          const reader = new FileReader();
          reader.readAsDataURL(blob!);
          reader.onloadend = () => {
            // Resolver la promesa con la imagen en formato JPG codificada en base64
            const jpgBase64 = reader.result as string;
            resolve(jpgBase64);
          };
        }, 'image/png', 1); // 'image/jpeg' es el tipo MIME y 1 es la calidad (0-1)
      };

      // Establecer la URI de la imagen como la URI del SVG clonado
      img.src = svgSaver.getUri(container.firstChild as HTMLElement);
    });
  }

  saveImgAsPng(id:string, fileName:string = 'IMG-SIRDEV') {
    const svgsaver = new SvgSaver();
    const svg = document.querySelector(`#${id}`);
    const name = fileName.trim().toLowerCase().replace(' ','-');
    svgsaver.asPng(svg, `${name}.png`);  
  }

  downloadImg(g:string){
    switch (g) {
      case 'g1':
        this.saveImgAsPng(g, this.g1Title)
        break;
      case 'g2':
        this.saveImgAsPng(g, this.g2Title)
        break;
      default:
        break;
    }
  }
  
  async generatePDFAllReport({ eventProject, nameStation, dataGraphics}:ReportMain) {  
    
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
          columns:[
            {
              text:dataGraphics[0].tableTitle,
              fontSize:13,
              margin:[0,8,0,8],
            },
            {
              text:dataGraphics[0].imgTitle,
              fontSize:13,
              margin:[0,8,0,8],
            },
          ]
        },
        {
          columns:[
            {
              table: {
                headerRows: 1,
                widths: [150, 75, 75],
                body: [
                  [
                    {
                      text:'Cargo',
                      bold:true,
                      fillColor: '#BFBFBF',
                    }, 
                    {
                      text:'Número de asistentes',
                      bold:true,
                      fillColor: '#BFBFBF',
                    },
                    {
                      text:'Porcentaje',
                      bold:true,
                      fillColor: '#BFBFBF',
                    }
                  ],
                  ...dataGraphics[0].tableData.map(data => {
                    return [ data.name, data.value, data.percentage ]
                  })
                ]
              },
              bodyStyles: {
                valign: 'middle',
              }
            },
            {
              image:dataGraphics[0].img,
              fit: [320, 320],
              alignment: 'center',
            }
          ]
        },
        { text: '\n', pageBreak: 'after' },
        {
          columns:[
            {
              text:dataGraphics[1].tableTitle,
              fontSize:13,
              margin:[0,8,0,8],
            },
            {
              text:dataGraphics[1].imgTitle,
              fontSize:13,
              margin:[0,8,0,8],
            },
          ]
        },
        {
          columns:[
            {
              table: {
                headerRows: 1,
                widths: [150, 75, 75],
                body: [
                  [
                    {
                      text:'Género',
                      bold:true,
                      fillColor: '#BFBFBF',
                    }, 
                    {
                      text:'Cantidad total',
                      bold:true,
                      fillColor: '#BFBFBF',
                    },
                    {
                      text:'Porcentaje',
                      bold:true,
                      fillColor: '#BFBFBF',
                    }
                  ],
                  ...dataGraphics[1].tableData.map(data => {
                    return [ data.name, data.value, data.percentage ]
                  })
                ]
              },
              bodyStyles: {
                valign: 'middle',
              }
            },
            {
              image:dataGraphics[1].img,
              fit: [350, 350],
              alignment: 'center',
            }
          ]
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

  async openDialogFileReport(){

    if(!this.projectDash){
      return;
    }

    const g1 = await this.getSvgAsBase64('g1');
    const g2 = await this.getSvgAsBase64('g2');

    this._db.getEvent(this.projectDash.id_event, this._local.getStationID()).subscribe({
      next:({ data }) => {
        const mainReport:ReportMain = {
          eventProject:data,
          nameStation: this._local.getStation().name_inia_station,
          dataGraphics:[
            {
              tableTitle: this.g1Title,
              tableDescription:'',
              img: g1,
              imgTitle:'Gráfica de ' + this.g1Title.toLowerCase(),
              imgDescription:'',
              tableData:this.dataHorizonBarChart
            },
            {
              tableTitle: this.g2Title,
              tableDescription:'',
              img: g2,
              imgTitle:'Gráfica de ' + this.g2Title.toLowerCase(),
              imgDescription:'',
              tableData:this.dataPieChart
            }
          ]
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
