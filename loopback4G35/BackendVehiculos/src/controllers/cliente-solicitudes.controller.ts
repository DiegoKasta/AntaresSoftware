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
  Cliente,
  Solicitudes,
} from '../models';
import {ClienteRepository} from '../repositories';

export class ClienteSolicitudesController {
  constructor(
    @repository(ClienteRepository) protected clienteRepository: ClienteRepository,
  ) { }

  @get('/clientes/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Array of Cliente has many Solicitudes',
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
    return this.clienteRepository.solicitudes(id).find(filter);
  }

  @post('/clientes/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Cliente model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solicitudes)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Cliente.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitudes, {
            title: 'NewSolicitudesInCliente',
            exclude: ['id'],
            optional: ['clienteId']
          }),
        },
      },
    }) solicitudes: Omit<Solicitudes, 'id'>,
  ): Promise<Solicitudes> {
    return this.clienteRepository.solicitudes(id).create(solicitudes);
  }

  @patch('/clientes/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Cliente.Solicitudes PATCH success count',
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
    return this.clienteRepository.solicitudes(id).patch(solicitudes, where);
  }

  @del('/clientes/{id}/solicitudes', {
    responses: {
      '200': {
        description: 'Cliente.Solicitudes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Solicitudes)) where?: Where<Solicitudes>,
  ): Promise<Count> {
    return this.clienteRepository.solicitudes(id).delete(where);
  }
}
