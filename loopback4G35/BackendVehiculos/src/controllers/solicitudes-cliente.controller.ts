import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Solicitudes,
  Cliente,
} from '../models';
import {SolicitudesRepository} from '../repositories';

export class SolicitudesClienteController {
  constructor(
    @repository(SolicitudesRepository)
    public solicitudesRepository: SolicitudesRepository,
  ) { }

  @get('/solicitudes/{id}/cliente', {
    responses: {
      '200': {
        description: 'Cliente belonging to Solicitudes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cliente)},
          },
        },
      },
    },
  })
  async getCliente(
    @param.path.string('id') id: typeof Solicitudes.prototype.id,
  ): Promise<Cliente> {
    return this.solicitudesRepository.cliente(id);
  }
}
