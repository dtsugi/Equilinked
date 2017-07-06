import { Component, OnInit, OnDestroy } from "@angular/core";
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
    .col {
        padding-left: 0px;
        font-size: 1.6rem;
    }
    `]
})
export class AlertasFicha implements OnInit, OnDestroy {

    private grupo: any;
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
        this.grupo = {};
    }

    ngOnInit(): void {
        moment.locale("es"); //Espaniol!!!!

        this.session = this.securityService.getInitialConfigSession();
        this.grupo = this.navParams.get("grupo");
        this.tipoAlerta = this.navParams.get("tipoAlerta");

        this.applyLabels(); //Ajustar las leyendas según el tipo de alerta
        this.getAlertasByGrupo(true);
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    create(): void {
        let alertaGrupo: any = { //Ya cremos la alerta!
            Grupo_ID: this.grupo.ID,
            Alerta: {
                Tipo: this.tipoAlerta,
                AlertaCaballo: []
            }
        };

        let params: any = {
            grupoId: this.grupo.ID,
            tipoAlerta: this.tipoAlerta,
            alertaGrupo: alertaGrupo
        };
        this.navController.push(EdicionAlertaPage, params);
    }

    viewNextAlert(alertaGrupo: any): void {
        console.info(alertaGrupo);
        let params: any = { grupoId: this.grupo.ID, alertaGrupoId: alertaGrupo.ID };
        this.navController.push(DetalleAlertaPage, params);
    }

    editAlert(alertaGrupo: any): void {
        let params: any = {
            grupoId: this.grupo.ID,
            tipoAlerta: alertaGrupo.Alerta.Tipo,
            alertaGrupo: JSON.parse(JSON.stringify(alertaGrupo))
        };
        this.navController.push(EdicionAlertaPage, params);
    }

    viewDetailHistoryAlert(alertaGrupo: any): void {
        this.commonService.showLoading("Procesando...");
        this.alertaGrupoService.getAlertaById(this.grupo.ID, alertaGrupo.ID)
            .then(ag => {
                this.commonService.hideLoading();

                alertaGrupo.Allcabalos = alertaGrupo.AllCaballos;
                alertaGrupo.Alerta.AlertaCaballo = ag.Alerta.AlertaCaballo;
                alertaGrupo.ShowDetail = true;
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar");
            });
    }

    closeDetailtHistoryAlert(alertaGrupo: any): void {
        alertaGrupo.ShowDetail = false;
    }

    delete(alertaGrupo: any): void {
        console.info(alertaGrupo);
        this.commonService.showLoading("Procesando...");
        this.alertaGrupoService.deleteAlerta(alertaGrupo)
            .then(() => {
                this.getAlertasByGrupo(false);
                this.commonService.ShowInfo("Eliminada con éxito");
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al eliminar");
            });
    }

    private applyLabels(): void {
        switch (this.tipoAlerta) {
            case ConstantsConfig.ALERTA_TIPO_DENTISTA:
                this.labels.title = "Dentista";
                this.labels.titleNextAlertas = "PRÓXIMA CITA CON DENTISTA";
                this.labels.tablePerson = "Dentista";
                this.labels.tableDescription = "Nota";
                break;
            case ConstantsConfig.ALERTA_TIPO_HERRAJE:
                this.labels.title = "Herraje / Desvasado";
                this.labels.titleNextAlertas = "PRÓXIMO HERRAJE / DESVASADO";
                this.labels.tablePerson = "Herrero";
                this.labels.tableDescription = "Informes";
                break;
            case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
                this.labels.title = "Desparasitación";
                this.labels.titleNextAlertas = "PRÓXIMA DESPARASITACIÓN";
                this.labels.tablePerson = "Aplicante";
                this.labels.tableDescription = "Nota";
                break;
        }
    }

    private getAlertasByGrupo(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading("Procesando...");

        this.alertaGrupoService.getAlertasByGrupo(this.grupo.ID, this.tipoAlerta, ConstantsConfig.ALERTA_FILTER_NEXT)
            .then(alertas => { //Primero las proximas!
                this.proximasAlertas = alertas.map(a => {
                    a.Fecha = moment(a.Alerta.FechaNotificacion).format("D [de] MMMM [de] YYYY");
                    a.Hora = moment(a.Alerta.HoraNotificacion, "HH:mm").format("hh:mm a");
                    //debugger;
                    return a;
                });
                return this.alertaGrupoService.getAlertasByGrupo(this.grupo.ID, this.tipoAlerta, ConstantsConfig.ALERTA_FILTER_HISTORY);
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


    private addEvents(): void {
        this.events.subscribe("alertas:refresh", () => {
            this.getAlertasByGrupo(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("alertas:refresh");
    }
}