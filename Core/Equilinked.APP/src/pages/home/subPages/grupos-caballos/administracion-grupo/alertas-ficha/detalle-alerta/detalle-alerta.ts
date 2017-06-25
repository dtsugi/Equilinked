import { Component, OnInit } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { AlertaGrupoService } from "../../../../../../../services/alerta-grupo.service";
import { CommonService } from "../../../../../../../services/common.service";
import { EdicionAlertaPage } from "../edicion-alerta/edicion-alerta";
import moment from "moment";
import "moment/locale/es";

@Component({
    templateUrl: "detalle-alerta.html",
    providers: [AlertaGrupoService, CommonService],
    styles: [`
    .col {
        font-size: 1.5rem;
    }
    `]
})
export class DetalleAlertaPage implements OnInit {

    private grupoId: number;
    private alertaGrupoId: number;

    alertaGrupo: any;

    constructor(
        private alertaGrupoService: AlertaGrupoService,
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams
    ) {
    }

    ngOnInit(): void {
        moment.locale("es"); //Espaniol!!!!

        this.grupoId = this.navParams.get("grupoId");
        this.alertaGrupoId = this.navParams.get("alertaGrupoId");

        this.getAlerta(true); //consulta la informacion de la alerta
        this.registredEvents();
    }

    getAlerta(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading("Procesando...");
        this.alertaGrupoService.getAlertaById(this.grupoId, this.alertaGrupoId)
            .then(alerta => {
                console.info("Alerta consultada");
                if (alerta != null) {
                    alerta.Fecha = moment(alerta.Alerta.FechaNotificacion).format("dddd, D [de] MMMM [de] YYYY");
                    alerta.Fecha = alerta.Fecha.charAt(0).toUpperCase() + alerta.Fecha.slice(1);
                    alerta.Hora = moment(alerta.Alerta.HoraNotificacion, "HH:mm").format("hh:mm");
                    alerta.Meridiano = moment(alerta.Alerta.HoraNotificacion, "HH:mm").format("a").toUpperCase();
                    this.alertaGrupo = alerta;
                    console.info(alerta);
                }
                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar");
            });
    }

    edit(alertaGrupo: any): void {
        let params: any = {
            grupoId: this.grupoId,
            tipoAlerta: alertaGrupo.Alerta.Tipo,
            alertaGrupo: JSON.parse(JSON.stringify(alertaGrupo))
        };
        this.navController.push(EdicionAlertaPage, params);
    }

    private registredEvents(): void {
        this.events.subscribe("alerta:updated", () => {
            this.getAlerta(false); //Refrescamo la info de la alarta!
            this.events.publish("alerta:saved"); //mandamos a refrescar también la lista de lapantalla de atr+as!
        });
    }
}