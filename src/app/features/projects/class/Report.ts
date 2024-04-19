import { EventProject } from "./Event";

class ReportAttendance{
    constructor(public evento:EventProject, public nameStation:string, public list:any[]){}
}

class ReportMain{
    constructor(public eventProject:EventProject, public nameStation:string){}
}

export{
    ReportAttendance,
    ReportMain
}