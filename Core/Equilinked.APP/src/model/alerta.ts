export class Alerta {
    public ID: number;
    public Titulo: string;
    public FechaNotificacion: string;
    public FechaNotificacionToString: string;
    public FechaNotificacionToCurrentCulture: string;
    public HoraNotificacion: string;
    public FechaFinal: string;
    public HoraFinal: string;
    public Tipo: number;
    public Activa: boolean;
    public Descripcion: string;
    public CaballosList;
    public NombreProfesional: string;
    public Ubicacion: string;
    public AlertaCaballo: Array<any>;
    public AlertaGrupo: Array<any>;
    public AlertaRecordatorio: Array<any>;
    public Resultado: string;
    public Propietario_ID: number;
    
    constructor() {
        this.AlertaCaballo = new Array<any>();
        this.AlertaGrupo = new Array<any>();
        this.AlertaRecordatorio = new Array<any>();
    }
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