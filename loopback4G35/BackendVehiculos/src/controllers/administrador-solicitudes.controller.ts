import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Administrador,
  Solicitudes,
} from '../models';
import {AdministradorRepository} from '../repositories';

export class AdministradorSolicitudesController {
  constructor(
    @repository(AdministradorRepository) protected administradorRepository: AdministradorRepository,
  ) { }

  @get('/administradors/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Array of Administrador has many Solicitudes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Solicitudes)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Solicitudes>,
  ): Promise<Solicitudes[]> {
    return this.administradorRepository.solicitudes(id).find(filter);
  }

  @post('/administradors/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Administrador model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solicitudes)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Administrador.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitudes, {
            title: 'NewSolicitudesInAdministrador',
            exclude: ['id'],
            optional: ['administradorId']
          }),
        },
      },
    }) solicitudes: Omit<Solicitudes, 'id'>,
  ): Promise<Solicitudes> {
    return this.administradorRepository.solicitudes(id).create(solicitudes);
  }

  @patch('/administradors/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Administrador.Solicitudes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitudes, {partial: true}),
        },
      },
    })
    solicitudes: Partial<Solicitudes>,
    @param.query.object('where', getWhereSchemaFor(Solicitudes)) where?: Where<Solicitudes>,
  ): Promise<Count> {
    return this.administradorRepository.solicitudes(id).patch(solicitudes, where);
  }

  @del('/administradors/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Administrador.Solicitudes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Solicitudes)) where?: Where<Solicitudes>,
  ): Promise<Count> {
    return this.administradorRepository.solicitudes(id).delete(where);
  }
}
