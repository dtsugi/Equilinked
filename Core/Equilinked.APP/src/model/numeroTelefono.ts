import { TipoNumero } from './tipoNumero';

export class NumeroTelefono {
    public ID: number;
    public Numero: string;
    public Tipo: TipoNumero;

    constructor() {
    	this.Tipo = new TipoNumero();
    }
}