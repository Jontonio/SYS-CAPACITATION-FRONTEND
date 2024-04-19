import * as moment from "moment"
import { getBase64ImageFromURL } from "./convertFileToBase64"

const fileHeader = async (nameHeader:string = '') => {  
  return { 
    columns: [  
      [  
        {
          columns: [
            {
              image: await getBase64ImageFromURL('./assets/logo-pdf/minagri-inia-1.png'),
              width: 300, 
              height: 40,
              margin: [30,10,10,0]
            },
            {
              width:"*",
              text: nameHeader,
              alignment: 'center',
              color:"#09351E",
              bold:true,
              italics:true,
              margin:[8,20,0,0]
            }
          ]
        }
      ],  
      [  
        {  
          image: await getBase64ImageFromURL('./assets/logo-pdf/punche-peru.jpg'),
          width: 150, 
          height: 40,
          margin: [0,10,10,0],
          alignment: 'right' 
        }
      ]  
    ],
    margin:[0,0,0,40]
  }
}

const fileFooter = () => {

  return {
    columns: [
      { 
        text: 'FECHA:' + moment().format('DD [de] MMMM [de] YYYY h:mm:ss a'),
        fontSize: 10, 
        color:'#2B2B2B',
        alignment: 'left', 
        margin: [40,0,0,0],
      },
      { 
        text: 'Reporte generado por SIRDEV',
        fontSize: 10, 
        color:'#2B2B2B',
        alignment: 'right', 
        margin: [0,0,40,0],
      }
    ]
  }

}

export {
  fileHeader,
  fileFooter
}