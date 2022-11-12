import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Administrador} from './administrador.model';
import {Asesor} from './asesor.model';
import {Vehiculo} from './vehiculo.model';

@model()
export class Solicitudes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  @property({
    type: 'string',
    required: true,
  })
  valor: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaSolicitud: string;

  @property({
    type: 'string',
    required: true,
  })
  comentarios: string;

  @belongsTo(() => Cliente)
  clienteId: string;

  @belongsTo(() => Administrador)
  administradorId: string;

  @belongsTo(() => Asesor)
  asesorId: string;

  @hasOne(() => Vehiculo)
  vehiculo: Vehiculo;

  constructor(data?: Partial<Solicitudes>) {
    super(data);
  }
}

export interface SolicitudesRelations {
  // describe navigational properties here
}

export type SolicitudesWithRelations = Solicitudes & SolicitudesRelations;
