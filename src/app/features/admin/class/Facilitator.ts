class Facilitator{
    id_card_facilitator:number;
    facilitator_name:string;
    facilitator_first_name:string;
    facilitator_last_name:string;
    facilitator_profesion:string;

    constructor(
        id_card_facilitator:number,
        facilitator_name:string,
        facilitator_first_name:string,
        facilitator_last_name:string,
        facilitator_profesion:string,
    ){
        this.id_card_facilitator = id_card_facilitator;
        this.facilitator_name = facilitator_name;
        this.facilitator_first_name = facilitator_first_name;
        this.facilitator_last_name = facilitator_last_name;
        this.facilitator_profesion = facilitator_profesion;
    }
}

export { Facilitator }