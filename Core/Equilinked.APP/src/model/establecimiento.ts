import { Mail } from './mail';
import { NumeroTelefono } from './numeroTelefono';

export class Establecimiento {
  ID: number;  
  Nombre: string;
  Propietario: string;
  Ubicacion: string;
  DescUbicacion: string;
  Mails: Array<Mail>;
  Numeros: Array<NumeroTelefono>;

  constructor() {
    this.Mails = new Array<Mail>();
    this.Numeros = new Array<NumeroTelefono>();
  }
}