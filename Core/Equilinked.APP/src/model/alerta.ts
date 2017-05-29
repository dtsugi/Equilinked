export class Alerta {
    public ID: number;
    public Titulo: string;
    public FechaNotificacion: string;
    public FechaNotificacionToString: string;
    public HoraNotificacion: string;
    public Tipo: number;
    public Activa: boolean;
    public Descripcion: string;
    public CaballosList;
    public NombreProfesional: string;

    constructor() { }
}

export class DateObject {
    public YEAR: number;
    public MONTH: number;
    public DAY: number;

    ToString() {
        var df = this.YEAR + "-" + this.addZeroDate(this.MONTH) + "-" + this.addZeroDate(this.DAY);
        console.log("ToString:" + df);
        return df;
    }

    addZeroDate(date) {
        if (date < 10) {
            return "0" + date;
        }
        return date;
    }
}