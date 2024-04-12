import { Attendance } from "src/app/features/projects/class/Attendance";

interface DataDialog{
    id_parent?:number,
    data?:any | Attendance;
    isUpdate:boolean;
}

export {
    DataDialog
}