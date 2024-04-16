
class Station {
  
  id_inia_station: number;
  name_inia_station: string;
  id_departament_inia_station: number;
  departament_inia_station: string;
  id_district_inia_station: number;
  district_inia_station: string;
  id_provincie_inia_station: number;
  provincie_inia_station: string;
  status: string;
  created_at: string;
  updated_at: string;
  
  constructor(){
    this.id_inia_station = 0;
    this.name_inia_station = "";
    this.id_departament_inia_station = 0;
    this.departament_inia_station = "";
    this.id_district_inia_station = 0;
    this.district_inia_station = "";
    this.id_provincie_inia_station = 0;
    this.provincie_inia_station = "";
    this.status = "";
    this.created_at = "";
    this.updated_at = "";
  }

  setId(id:number){
    this.id_inia_station = id;
  }
  
}

export { Station }