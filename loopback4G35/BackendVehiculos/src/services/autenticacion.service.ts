import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ClienteSolicitudesController} from '../controllers';
import {Cliente} from '../models';
import {llaves} from '../repokeys/llaves';
import {ClienteRepository} from '../repositories';
const genPass=require("password-generator");
const cifrar=require("crypto-js");
const webToken=require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(ClienteRepository)
    public clienteRepositorio: ClienteRepository
  ) {}

  generarContrasena(){
    let pass=genPass(8,false);
    return pass;
  }

  generarCifrado(clave:string){
    let cifrado=cifrar.MD5(clave).toString();
    return cifrado;
  }

  identificarCliente(usuario:string, clave:string){
    try {
      const clients= this.clienteRepositorio.findOne({
        where:{
          correo:usuario,
          password:clave
        }
      });
      if (clients) {
        return clients;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  genToken(cliente:Cliente){
    let tken=webToken.sign({
      data:{
        id:cliente.id,
        correo:cliente.correo,
        nombre:cliente.nombre+" "+cliente.apellidos
      }
    },llaves.claveWeb);
    return tken;
  }
}
