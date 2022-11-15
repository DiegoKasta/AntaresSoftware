
// Validamos el ROL de Administrador

import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBTken from 'parse-bearer-token';
import {AutenticacionService} from '../services';

export class EstrategiaAdministrador implements AuthenticationStrategy{
  name='admin';
  constructor(
    @service(AutenticacionService)
    public srvAutenticacion:AutenticacionService
  ){}
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const ttken = parseBTken(request);
    if (ttken) {
      const datos = this.srvAutenticacion.validarToken(ttken);
      if (datos) {
        console.log("Contenido ROL: ",datos.infoData.rol);
////////////
        if (datos.infoData.rol=="administrador"||datos.infoData.rol=="asesor") {
          const perfil: UserProfile = Object.assign({
            nombre: datos.infoData.nombre
          });
          
          return perfil;

        } else {
          console.log("Rol Invalido");
        }
/////////////

// ///////////////////////////////////////////////////////////////////////////
//         switch (datos.infoData.rol) {
//           case 'administrador':{
//             this.name='admin';
//             console.log("Label_Administrador",datos.infoData.rol);
//             const perfil:UserProfile=Object.assign(
//               {nombre:datos.infoData.nombre});
//             return perfil;
//           }
//           case 'asesor':{
//             this.name='assor';
//             console.log("Label_Asesor",datos.infoData.rol);
//             const perfil:UserProfile=Object.assign(
//               {nombre:datos.infoData.nombre});
//             return perfil;
//           }
//           case 'cliente':{
//             this.name='clnte';
//             console.log("Label_Cliente",datos.infoData.rol);
//             const perfil:UserProfile=Object.assign(
//               {nombre:datos.infoData.nombre});
//             return perfil;
//           }
//           // default:
//             // throw new HttpErrors[401]("El Token no es valido")
//         }
///////////////////////////////////////////////////////////
      } else{
        throw new HttpErrors[401]("El Token no es valido")
      }
    } else {
      throw new HttpErrors[401]("No se ha incluido un token en la solicitud")
    }
  }
}
