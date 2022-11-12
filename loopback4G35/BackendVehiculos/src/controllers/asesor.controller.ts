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
import {Asesor, Savecredenciales} from '../models';
import {AsesorRepository} from '../repositories';

import {llaves} from '../repokeys/llaves';
import {AutenticacionService} from '../services';
const linkUrl=require("node-fetch");

export class AsesorController {
  constructor(
    @repository(AsesorRepository)
    public asesorRepository : AsesorRepository,
    @service(AutenticacionService)
    public srvcioAutenticacion:AutenticacionService
  ) {}

  @post("/identifyasesr",{//Metodo Post
    responses:{
      '200':{
        description:"Identificacion Cliente"
      }
    }
  })
  async identifyasesr(
    @requestBody()credenciales:Savecredenciales
  ){
    const cred=await this.srvcioAutenticacion.identificarAsesor(credenciales.usuario, credenciales.clave);
    if (cred) {
      const tken=this.srvcioAutenticacion.genTokenAssor(cred);
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

  @post('/asesors')
  @response(200, {
    description: 'Asesor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Asesor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {
            title: 'NewAsesor',
            exclude: ['id'],
          }),
        },
      },
    })
    asesor: Omit<Asesor, 'id'>,
  ): Promise<Asesor> {
    const clve=this.srvcioAutenticacion.generarContrasena();
    const cifrar=this.srvcioAutenticacion.generarCifrado(clve);
    asesor.password=cifrar;
    asesor.rol="asesor";
    asesor.codigoEmpleado="ASS"+asesor.cedula;
    const Assor = await this.asesorRepository.create(asesor);
    const destino=asesor.correo;
    const asunto="Notificacion Asesor";
    const mensaje=`${asesor.nombre} ${asesor.apellidos}, ha sido agregado su correo con la contraseña " ${clve} ", para acceder a la plataforma tecnologica de Smart Vehicle como Asesor Comercial de nuestra compañia.`;
    linkUrl(`${llaves.urlServicio}/envio-correo?correo_destino=${destino}&asunto=${asunto}&contenido=${mensaje}`);
    return Assor;
  }

  @get('/asesors/count')
  @response(200, {
    description: 'Asesor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Asesor) where?: Where<Asesor>,
  ): Promise<Count> {
    return this.asesorRepository.count(where);
  }

  @get('/asesors')
  @response(200, {
    description: 'Array of Asesor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Asesor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Asesor) filter?: Filter<Asesor>,
  ): Promise<Asesor[]> {
    return this.asesorRepository.find(filter);
  }

  @patch('/asesors')
  @response(200, {
    description: 'Asesor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {partial: true}),
        },
      },
    })
    asesor: Asesor,
    @param.where(Asesor) where?: Where<Asesor>,
  ): Promise<Count> {
    return this.asesorRepository.updateAll(asesor, where);
  }

  @get('/asesors/{id}')
  @response(200, {
    description: 'Asesor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Asesor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Asesor, {exclude: 'where'}) filter?: FilterExcludingWhere<Asesor>
  ): Promise<Asesor> {
    return this.asesorRepository.findById(id, filter);
  }

  @patch('/asesors/{id}')
  @response(204, {
    description: 'Asesor PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {partial: true}),
        },
      },
    })
    asesor: Asesor,
  ): Promise<void> {
    await this.asesorRepository.updateById(id, asesor);
  }

  @put('/asesors/{id}')
  @response(204, {
    description: 'Asesor PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() asesor: Asesor,
  ): Promise<void> {
    await this.asesorRepository.replaceById(id, asesor);
  }

  @del('/asesors/{id}')
  @response(204, {
    description: 'Asesor DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.asesorRepository.deleteById(id);
  }
}
