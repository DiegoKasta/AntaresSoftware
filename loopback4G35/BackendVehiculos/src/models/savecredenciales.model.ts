import {Model, model, property} from '@loopback/repository';

@model()
export class Savecredenciales extends Model {
  @property({
    type: 'string',
    required: true,
  })
  usuario: string;

  @property({
    type: 'string',
    required: true,
  })
  clave: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // rol: string;

  constructor(data?: Partial<Savecredenciales>) {
    super(data);
  }
}

export interface SavecredencialesRelations {
  // describe navigational properties here
}

export type SavecredencialesWithRelations = Savecredenciales & SavecredencialesRelations;
