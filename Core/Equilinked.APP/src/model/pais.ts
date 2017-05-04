import {EstadoProvincia} from './estadoProvincia';

export class Pais {
    public ID: number;
    public Descripcion: string;
    public EstadosProvincias: Array<EstadoProvincia>;

    constructor() {}
}