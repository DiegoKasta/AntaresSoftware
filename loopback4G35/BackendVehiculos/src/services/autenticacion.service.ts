import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const genPass=require("password-generator");
const cifrar=require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(/* Add @inject to inject parameters */) {}

  generarContrasena(){
    let pass=genPass(8,true);
    return pass;
  }

  generarCifrado(clave:string){
    let cifrado=cifrar.MD5(clave).toString();
    return cifrado;
  }


}
