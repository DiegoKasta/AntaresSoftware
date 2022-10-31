import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Asesor, AsesorRelations, Solicitudes} from '../models';
import {SolicitudesRepository} from './solicitudes.repository';

export class AsesorRepository extends DefaultCrudRepository<
  Asesor,
  typeof Asesor.prototype.id,
  AsesorRelations
> {

  public readonly solicitudes: HasManyRepositoryFactory<Solicitudes, typeof Asesor.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('SolicitudesRepository') protected solicitudesRepositoryGetter: Getter<SolicitudesRepository>,
  ) {
    super(Asesor, dataSource);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudesRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
  }
}
