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
  Asesor,
} from '../models';
import {SolicitudesRepository} from '../repositories';

export class SolicitudesAsesorController {
  constructor(
    @repository(SolicitudesRepository)
    public solicitudesRepository: SolicitudesRepository,
  ) { }

  @get('/solicitudes/{id}/asesor', {
    responses: {
      '200': {
        description: 'Asesor belonging to Solicitudes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Asesor)},
          },
        },
      },
    },
  })
  async getAsesor(
    @param.path.string('id') id: typeof Solicitudes.prototype.id,
  ): Promise<Asesor> {
    return this.solicitudesRepository.asesor(id);
  }
}
