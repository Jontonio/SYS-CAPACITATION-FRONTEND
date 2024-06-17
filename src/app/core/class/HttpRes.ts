import { Facilitator } from "src/app/features/admin/class/Facilitator";
import { Project } from "src/app/features/projects/class/Project";

class HttpRes {
    
    data:any | Project | Facilitator;
    error:boolean;
    message:string;
    status:number;

    constructor(data:any, message:string, error:boolean, status:number){
        this.data = data;
        this.error = error;
        this.message = message;
        this.status = status;
    }
}

export {
    HttpRes
}