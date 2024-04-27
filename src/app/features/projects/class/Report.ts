import { ResReport } from "../../dashboard/interfaces/ResReport";
import { EventProject } from "./Event";

interface DataGraphics {
    tableTitle:string,
    tableDescription?:string,
    imgTitle:string;
    img:string,
    imgDescription?:string,
    tableData:ResReport[]
}

class ReportAttendance{
    constructor(public evento:EventProject, public nameStation:string, public list:any[]){}
}

class ReportMain{
    constructor(public eventProject:EventProject, public nameStation:string, public dataGraphics:DataGraphics[]){}
}

export{
    ReportAttendance,
    ReportMain
}