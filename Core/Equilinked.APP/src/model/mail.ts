import { TipoMail } from './tipoMail';

export class Mail {
    public ID: number;
    public MailDesc: string;
    public Tipo: TipoMail;

    constructor() {
    	this.Tipo = new TipoMail();
    }
}