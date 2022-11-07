import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Console} from 'console';
import {Administrador, Asesor, Cliente} from '../models';
import {llaves} from '../repokeys/llaves';
import {AdministradorRepository, AsesorRepository, ClienteRepository} from '../repositories';
const genPass=require("password-generator");
const cifrar=require("crypto-js");
const webToken=require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(ClienteRepository)
    public clienteRepositorio: ClienteRepository,
    @repository(AdministradorRepository)
    public admonRepositorio:AdministradorRepository,
    @repository(AsesorRepository)
    public asesorRepo:AsesorRepository
  ) {}

  generarContrasena(){ //Genero una contraseña dinamica de 8 caracteres
    const pass=genPass(8,false);
    return pass;
  }

  generarCifrado(clave:string){ //Genera el cifrado a la contraseña
    const cifrado=cifrar.MD5(clave).toString();
    return cifrado;
  }


  validarToken(ttoken:string){ //Valido el Token generado
    try {
      const datos=webToken.verify(ttoken, llaves.claveWeb);
      console.log("Label_1",datos);
      return datos;
    } catch {
      return false;
    }
  }


//////////////////////// Cliente /////////////////////////////
  identificarCliente(usuario:string, clave:string){ //Identifica el cliente
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

  genTokenCliente(cliente:Cliente){ //Genero un Token
    const tken=webToken.sign({
      data:{
        id:cliente.id,
        correo:cliente.correo,
        nombre:cliente.nombre+" "+cliente.apellidos,
        rol:cliente.rol
      }
    },llaves.claveWeb);
    return tken;
  }


//////////////////////// Administrador /////////////////////////////
  identificarAdmin(usuario:string, clave:string){ //Identifica el administrador
    try {
      const admon= this.admonRepositorio.findOne({
        where:{
          correo:usuario,
          password:clave
        }
      });
      if (admon) {
        return admon;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  genTokenAdmin(admon:Administrador){ //Genero un Token
    const tken=webToken.sign({
      data:{
        id:admon.id,
        correo:admon.correo,
        nombre:admon.nombre+" "+admon.apellidos,
        rol:admon.rol
      }
    },llaves.claveWeb);
    return tken;
  }

  //////////////////////// Asesor /////////////////////////////
  identificarAsesor(usuario:string, clave:string){ //Identifica el Asesor
    try {
      const assr= this.asesorRepo.findOne({
        where:{
          correo:usuario,
          password:clave
        }
      });
      if (assr) {
        return assr;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  genTokenAssor(asser:Asesor){ //Genero un Token
    const tken=webToken.sign({
      data:{
        id:asser.id,
        correo:asser.correo,
        nombre:asser.nombre+" "+asser.apellidos,
        rol:asser.rol
      }
    },llaves.claveWeb);
    return tken;
  }



  // identificarPersona(usuario:string, clave:string, rol:string){
  //   try {
  //     switch (rol) {
  //       case "cliente":{
  //         const  clients= this.clienteRepositorio.findOne({
  //           where:{
  //             correo:usuario,
  //             password:clave
  //           }
  //         });
  //         if (clients) return clients;
  //         else return false;
  //       }
  //       case "administrador":{
  //         const  admon= this.admonRepositorio.findOne({
  //           where:{
  //             correo:usuario,
  //             password:clave
  //           }
  //         });
  //         if (admon) return admon;
  //         else return false;
  //       }

  //       default:
  //         break;
  //     }

  //   } catch {
  //     return false;
  //   }
  // }
}
