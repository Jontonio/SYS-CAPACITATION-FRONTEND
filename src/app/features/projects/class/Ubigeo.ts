interface Region{
    id_departamento:number
    nombre_departamento:string;
    etiqueta_ubigeo:string;
    codigo_ubigeo:number;
    buscador_ubigeo:string;
    numero_hijos_ubigeo:number;
    nivel_ubigeo:string;
    id_padre_ubigeo:number
}

interface District{
    id_distrito:number;
    nombre_distrito:string;
    etiqueta_ubigeo:string;
    codigo_ubigeo:number;
    buscador_ubigeo:string;
    numero_hijos_ubigeo:number;
    nivel_ubigeo:string;
    id_padre_ubigeo:number;
}

interface Provincie{
    id_provincia:number;
    nombre_provincia:string;
    etiqueta_ubigeo:string;
    codigo_ubigeo:string;
    buscador_ubigeo:string;
    numero_hijos_ubigeo:number;
    nivel_ubigeo:string;
    id_padre_ubigeo:number;
}

export {
    Region,
    District,
    Provincie
}
