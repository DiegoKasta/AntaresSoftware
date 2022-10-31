import {Entity, model, property, hasMany} from '@loopback/repository';
import {Solicitudes} from './solicitudes.model';

@model()
export class Asesor extends Entity {
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
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  apellidos: string;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @property({
    type: 'string',
    required: true,
  })
  sucursal: string;

  @property({
    type: 'string',
    required: true,
  })
  codigo_empleado: string;

  @hasMany(() => Solicitudes)
  solicitudes: Solicitudes[];

  constructor(data?: Partial<Asesor>) {
    super(data);
  }
}

export interface AsesorRelations {
  // describe navigational properties here
}

export type AsesorWithRelations = Asesor & AsesorRelations;
