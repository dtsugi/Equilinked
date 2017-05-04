import { EstadoProvincia } from './estadoProvincia';

export class Propietario {
  ID: number;
  Nombre: string;
  Apellido: string;
  Mail: string;
  Celular: string;
  FechaNacimiento: Date;
  EstadoProvincia: EstadoProvincia;

  constructor() {}
}