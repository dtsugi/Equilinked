import { Genero } from './genero';
import { Pelaje } from './pelaje';
import { EstadoProvincia } from './estadoProvincia';
import { Grupo } from './grupo';
import { Pedigree } from './pedigree';
import { Propietario } from './propietario';
import { Criador } from './criador';
import { OtrasMarcas } from './otrasMarcas';
import { Establecimiento } from './establecimiento';
import { PersonaACargo } from './personaACargo';

export class Caballo {
  ID: number;  
  Nombre: string;
  FechaNacimiento?: Date;
  NumeroId: number;
  NumeroChip: string;
  NumeroFEI: number;
  EstadoFEI: boolean;
  NumeroFEN: number;
  EstadoFEN: boolean;
  Protector: string;
  Embocadura: string;
  ExtrasDeCabezada: string;
  ADN: boolean;
  Genero: Genero;
  Pelaje: Pelaje;
  EstadoProvincia: EstadoProvincia;
  Grupo: Grupo;
  Pedigree: Pedigree;
  Propietario: Propietario;
  Criador: Criador;
  OtrasMarcas: OtrasMarcas;
  Establecimiento: Establecimiento;
  Alimentacion: string;
  PersonaACargo: PersonaACargo;

  constructor() {
    this.Genero = new Genero();
    this.Pelaje = new Pelaje();
    this.EstadoProvincia = new EstadoProvincia();
    this.Grupo = new Grupo();
    this.Pedigree = new Pedigree();
    this.Propietario = new Propietario();
    this.Criador = new Criador();
    this.OtrasMarcas = new OtrasMarcas();
    this.Establecimiento = new Establecimiento();
    this.PersonaACargo = new PersonaACargo();
  }
}