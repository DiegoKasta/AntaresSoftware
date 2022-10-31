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
  Asesor,
  Solicitudes,
} from '../models';
import {AsesorRepository} from '../repositories';

export class AsesorSolicitudesController {
  constructor(
    @repository(AsesorRepository) protected asesorRepository: AsesorRepository,
  ) { }

  @get('/asesors/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Array of Asesor has many Solicitudes',
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
    return this.asesorRepository.solicitudes(id).find(filter);
  }

  @post('/asesors/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Asesor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solicitudes)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Asesor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitudes, {
            title: 'NewSolicitudesInAsesor',
            exclude: ['id'],
            optional: ['asesorId']
          }),
        },
      },
    }) solicitudes: Omit<Solicitudes, 'id'>,
  ): Promise<Solicitudes> {
    return this.asesorRepository.solicitudes(id).create(solicitudes);
  }

  @patch('/asesors/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Asesor.Solicitudes PATCH success count',
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
    return this.asesorRepository.solicitudes(id).patch(solicitudes, where);
  }

  @del('/asesors/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Asesor.Solicitudes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Solicitudes)) where?: Where<Solicitudes>,
  ): Promise<Count> {
    return this.asesorRepository.solicitudes(id).delete(where);
  }
}
