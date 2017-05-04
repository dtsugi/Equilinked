import { Caballo } from './caballo';

export class Grupo {
    public ID: number;
    public Descripcion: string;
    public Caballos: Array<Caballo>;

    constructor () {
        this.Caballos = new Array<Caballo>();
    }
}