import { Component, OnInit } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { AlertaGrupoService } from "../../../../../../services/alerta-grupo.service";
import { CommonService } from "../../../../../../services/common.service";
import { SecurityService } from "../../../../../../services/security.service";
import { UserSessionEntity } from "../../../../../../model/userSession";
import { EdicionAlertaPage } from "./edicion-alerta/edicion-alerta";
import { DetalleAlertaPage } from "./detalle-alerta/detalle-alerta";
import { ConstantsConfig } from "../../../../../../app/utils"
import moment from "moment";
import "moment/locale/es";

@Component({
    templateUrl: "./alertas-ficha.html",
    providers: [AlertaGrupoService, CommonService, SecurityService],
    styles: [`
     * .title-form{
        font-weight: bold;
    }

    hr{    
        text-align: center;
        width: 100%;
    }
    `]
})
export class AlertasFicha implements OnInit {

    private grupoId: number;
    private tipoAlerta: number;
    private session: UserSessionEntity;

    labels: any;
    proximasAlertas: Array<any>;
    historicoAlertas: Array<any>;

    constructor(
        private alertaGrupoService: AlertaGrupoService,
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService
    ) {
        this.labels = {};
    }

    ngOnInit(): void {
        moment.locale("es"); //Espaniol!!!!

        this.session = this.securityService.getInitialConfigSession();
        this.grupoId = this.navParams.get("grupoId");
        this.tipoAlerta = this.navParams.get("tipoAlerta");

        this.applyLabels(); //Ajustar las leyendas según el tipo de alerta
        this.getAlertasByGrupo(true);
        this.registredEvents();
    }

    create(): void {
        let alertaGrupo: any = { //Ya cremos la alerta!
            Grupo_ID: this.grupoId,
            Alerta: {
                Tipo: this.tipoAlerta
            }
        };

        let params: any = {
            grupoId: this.grupoId,
            tipoAlerta: this.tipoAlerta,
            alertaGrupo: alertaGrupo
        };
        this.navController.push(EdicionAlertaPage, params);
    }

    viewNextAlert(alertaGrupo: any): void {
        console.info(alertaGrupo);
        let params: any = { grupoId: this.grupoId, alertaGrupoId: alertaGrupo.ID };
        this.navController.push(DetalleAlertaPage, params);
    }

    private applyLabels(): void {
        switch (this.tipoAlerta) {
            case ConstantsConfig.ALERTA_TIPO_DENTISTA:
                this.labels.title = "Dentista";
                this.labels.titleNextAlertas = "PRÓXIMA CITA CON DENTISTA";
                break;
            case ConstantsConfig.ALERTA_TIPO_HERRAJE:
                this.labels.title = "Herraje / Desvasado";
                this.labels.titleNextAlertas = "PRÓXIMO HERRAJE / DESVASADO";
                break;
            case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
                this.labels.title = "Desparasitación";
                this.labels.titleNextAlertas = "PRÓXIMA DESPARASITACIÓN";
                break;
        }
    }

    private getAlertasByGrupo(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading("Procesando...");

        this.alertaGrupoService.getAlertasByGrupo(this.grupoId, this.tipoAlerta, ConstantsConfig.ALERTA_FILTER_NEXT)
            .then(alertas => { //Primero las proximas!
                this.proximasAlertas = alertas.map(a => {
                    a.Fecha = moment(a.Alerta.FechaNotificacion).format("D [de] MMMM [de] YYYY");
                    a.Hora = moment(a.Alerta.HoraNotificacion, "HH:mm").format("hh:mm a");
                    //debugger;
                    return a;
                });
                return this.alertaGrupoService.getAlertasByGrupo(this.grupoId, this.tipoAlerta, ConstantsConfig.ALERTA_FILTER_HISTORY);
            }).then(alertas => {
                this.historicoAlertas = alertas.map(a => {
                    a.Fecha = moment(a.Alerta.FechaNotificacion).format("DD/MM/YY");
                    return a;
                });
                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar el grupo");
            });
    }


    private registredEvents(): void {
        this.events.subscribe("alerta:saved", () => {
            this.getAlertasByGrupo(false);
        });
        this.events.subscribe("alerta:deleted", () => {
            this.getAlertasByGrupo(false);
        });
    }
}