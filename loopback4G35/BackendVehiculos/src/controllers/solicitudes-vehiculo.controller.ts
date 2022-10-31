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
  Solicitudes,
  Vehiculo,
} from '../models';
import {SolicitudesRepository} from '../repositories';

export class SolicitudesVehiculoController {
  constructor(
    @repository(SolicitudesRepository) protected solicitudesRepository: SolicitudesRepository,
  ) { }

  @get('/solicitudes/{id}/vehiculo', {
    responses: {
      '200': {
        description: 'Solicitudes has one Vehiculo',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Vehiculo),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Vehiculo>,
  ): Promise<Vehiculo> {
    return this.solicitudesRepository.vehiculo(id).get(filter);
  }

  @post('/solicitudes/{id}/vehiculo', {
    responses: {
      '200': {
        description: 'Solicitudes model instance',
        content: {'application/json': {schema: getModelSchemaRef(Vehiculo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Solicitudes.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculo, {
            title: 'NewVehiculoInSolicitudes',
            exclude: ['id'],
            optional: ['solicitudesId']
          }),
        },
      },
    }) vehiculo: Omit<Vehiculo, 'id'>,
  ): Promise<Vehiculo> {
    return this.solicitudesRepository.vehiculo(id).create(vehiculo);
  }

  @patch('/solicitudes/{id}/vehiculo', {
    responses: {
      '200': {
        description: 'Solicitudes.Vehiculo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculo, {partial: true}),
        },
      },
    })
    vehiculo: Partial<Vehiculo>,
    @param.query.object('where', getWhereSchemaFor(Vehiculo)) where?: Where<Vehiculo>,
  ): Promise<Count> {
    return this.solicitudesRepository.vehiculo(id).patch(vehiculo, where);
  }

  @del('/solicitudes/{id}/vehiculo', {
    responses: {
      '200': {
        description: 'Solicitudes.Vehiculo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Vehiculo)) where?: Where<Vehiculo>,
  ): Promise<Count> {
    return this.solicitudesRepository.vehiculo(id).delete(where);
  }
}
