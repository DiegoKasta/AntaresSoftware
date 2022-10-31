import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Solicitudes, SolicitudesRelations, Cliente, Administrador, Asesor, Vehiculo} from '../models';
import {ClienteRepository} from './cliente.repository';
import {AdministradorRepository} from './administrador.repository';
import {AsesorRepository} from './asesor.repository';
import {VehiculoRepository} from './vehiculo.repository';

export class SolicitudesRepository extends DefaultCrudRepository<
  Solicitudes,
  typeof Solicitudes.prototype.id,
  SolicitudesRelations
> {

  public readonly cliente: BelongsToAccessor<Cliente, typeof Solicitudes.prototype.id>;

  public readonly administrador: BelongsToAccessor<Administrador, typeof Solicitudes.prototype.id>;

  public readonly asesor: BelongsToAccessor<Asesor, typeof Solicitudes.prototype.id>;

  public readonly vehiculo: HasOneRepositoryFactory<Vehiculo, typeof Solicitudes.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>, @repository.getter('AdministradorRepository') protected administradorRepositoryGetter: Getter<AdministradorRepository>, @repository.getter('AsesorRepository') protected asesorRepositoryGetter: Getter<AsesorRepository>, @repository.getter('VehiculoRepository') protected vehiculoRepositoryGetter: Getter<VehiculoRepository>,
  ) {
    super(Solicitudes, dataSource);
    this.vehiculo = this.createHasOneRepositoryFactoryFor('vehiculo', vehiculoRepositoryGetter);
    this.registerInclusionResolver('vehiculo', this.vehiculo.inclusionResolver);
    this.asesor = this.createBelongsToAccessorFor('asesor', asesorRepositoryGetter,);
    this.registerInclusionResolver('asesor', this.asesor.inclusionResolver);
    this.administrador = this.createBelongsToAccessorFor('administrador', administradorRepositoryGetter,);
    this.registerInclusionResolver('administrador', this.administrador.inclusionResolver);
    this.cliente = this.createBelongsToAccessorFor('cliente', clienteRepositoryGetter,);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
  }
}
