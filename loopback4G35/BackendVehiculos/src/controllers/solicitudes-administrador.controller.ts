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
  Administrador,
} from '../models';
import {SolicitudesRepository} from '../repositories';

export class SolicitudesAdministradorController {
  constructor(
    @repository(SolicitudesRepository)
    public solicitudesRepository: SolicitudesRepository,
  ) { }

  @get('/solicitudes/{id}/administrador', {
    responses: {
      '200': {
        description: 'Administrador belonging to Solicitudes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Administrador)},
          },
        },
      },
    },
  })
  async getAdministrador(
    @param.path.string('id') id: typeof Solicitudes.prototype.id,
  ): Promise<Administrador> {
    return this.solicitudesRepository.administrador(id);
  }
}
