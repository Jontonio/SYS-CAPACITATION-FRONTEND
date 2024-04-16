interface PayloadToken{
    email:string;
    exp:number;
    iat:number;
    id_inia_station:number | null
    iss:string;
    jti:string;
    name:string;
    nbf:number;
    prv:string;
    sub:string;
}
export {
    PayloadToken
}