import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Administrador, Savecredenciales} from '../models';
import {AdministradorRepository} from '../repositories';

import {llaves} from '../repokeys/llaves';
import {AutenticacionService} from '../services';
const linkUrl=require("node-fetch");

export class AdministradorController {
  constructor(
    @repository(AdministradorRepository)
    public administradorRepository : AdministradorRepository,
    @service(AutenticacionService)
    public srvcioAutenticacion:AutenticacionService
  ) {}

  @post("/identifyadmin",{ // Metodo Post
    responses:{'200':{description:"Identificacion Administrador"
  }}
  })
  async identifyadmin(
    @requestBody()credencialesAlmacenadas:Savecredenciales
  ){
    const cred=await this.srvcioAutenticacion.identificarAdmin(credencialesAlmacenadas.usuario,credencialesAlmacenadas.clave);
    if (cred) {
      const tken=this.srvcioAutenticacion.genTokenAdmin(cred);
      return{
        datos:{
          id:cred.id,
          nombre:cred.nombre+" "+cred.apellidos,
          correo:cred.correo,
          rol:cred.rol
        },
          token:tken
        }
    } else {
      throw new HttpErrors[401]("Datos invalidos, Usuario no existe");
    }
  }

  @post('/administradors')
  @response(200, {
    description: 'Administrador model instance',
    content: {'application/json': {schema: getModelSchemaRef(Administrador)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {
            title: 'NewAdministrador',
            exclude: ['id'],
          }),
        },
      },
    })
    administrador: Omit<Administrador, 'id'>,
  ): Promise<Administrador> {
    const clve=this.srvcioAutenticacion.generarContrasena();
    const cifrar=this.srvcioAutenticacion.generarCifrado(clve);
    administrador.password=cifrar;
    administrador.rol="administrador";
    administrador.codigoEmpleado="ADMIN"+administrador.cedula;
    const addmon=await this.administradorRepository.create(administrador);
    const destino=administrador.correo;
    const asunto="Notificacion Administrador";
    const mensaje=`${administrador.nombre} ${administrador.apellidos}, ha sido agregado su correo con la contraseña " ${clve} ", para acceder a la plataforma tecnologica de Smart Vehicle como Administrador de la plataforma tecnologica.`;
    linkUrl(`${llaves.urlServicio}/envio-correo?correo_destino=${destino}&asunto=${asunto}&contenido=${mensaje}`);
    return addmon;
  }

  @get('/administradors/count')
  @response(200, {
    description: 'Administrador model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Administrador) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.administradorRepository.count(where);
  }

  @get('/administradors')
  @response(200, {
    description: 'Array of Administrador model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Administrador, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Administrador) filter?: Filter<Administrador>,
  ): Promise<Administrador[]> {
    return this.administradorRepository.find(filter);
  }

  @patch('/administradors')
  @response(200, {
    description: 'Administrador PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Administrador,
    @param.where(Administrador) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.administradorRepository.updateAll(administrador, where);
  }

  @get('/administradors/{id}')
  @response(200, {
    description: 'Administrador model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Administrador, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Administrador, {exclude: 'where'}) filter?: FilterExcludingWhere<Administrador>
  ): Promise<Administrador> {
    return this.administradorRepository.findById(id, filter);
  }

  @patch('/administradors/{id}')
  @response(204, {
    description: 'Administrador PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Administrador,
  ): Promise<void> {
    await this.administradorRepository.updateById(id, administrador);
  }

  @put('/administradors/{id}')
  @response(204, {
    description: 'Administrador PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() administrador: Administrador,
  ): Promise<void> {
    await this.administradorRepository.replaceById(id, administrador);
  }

  @del('/administradors/{id}')
  @response(204, {
    description: 'Administrador DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.administradorRepository.deleteById(id);
  }
}
