import { Component, OnInit, OnDestroy } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { AlertaService } from "../../../../../../../services/alerta.service";
import { AlertaGrupoService } from "../../../../../../../services/alerta-grupo.service";
import { SecurityService } from "../../../../../../../services/security.service";
import { CommonService } from "../../../../../../../services/common.service";
import { UserSessionEntity } from "../../../../../../../model/userSession";
import { EdicionNotaPage } from "../edicion-nota/edicion-nota";
import moment from "moment";
import "moment/locale/es";
import { LanguageService } from '../../../../../../../services/language.service';

@Component({
    templateUrl: "detalle-nota.html",
    providers: [LanguageService, AlertaService, AlertaGrupoService, CommonService, SecurityService],
    styles: [`
    .col {
        font-size: 1.5rem;
    }
    `]
})
export class DetalleNotaPage implements OnInit, OnDestroy {

    private grupoId: number;
    private alertaId: number;
    private session: UserSessionEntity;
    labels: any = {};

    alertaGrupo: any;

    constructor(
        private alertaService: AlertaService,
        private alertaGrupoService: AlertaGrupoService,
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit(): void {
        moment.locale("es");
        this.session = this.securityService.getInitialConfigSession();
        this.grupoId = this.navParams.get("grupoId");
        this.alertaId = this.navParams.get("alertaId");

        this.getNota(true); //consulta la informacion de la alerta
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    getNota(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading(this.labels["PANT019_ALT_PRO"]);
        this.alertaService.getAlertaById(this.session.PropietarioId, this.alertaId)
            .then(alerta => {
                console.info("Alerta consultada");
                if (alerta != null) {
                    let d = new Date(alerta.FechaNotificacion);
                    alerta.Fecha = moment(d).format("dddd, D [de] MMMM [de] YYYY");
                    alerta.Fecha = alerta.Fecha.charAt(0).toUpperCase() + alerta.Fecha.slice(1);
                    alerta.Hora = moment(d).format("hh:mm");
                    alerta.Meridiano = moment(d).format("a").toUpperCase();
                    this.alertaGrupo = alerta;
                    console.info(alerta);
                }
                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, this.labels["PANT019_MSG_ERR"]);
            });
    }

    edit(): void {
        let params: any = {
            grupoId: this.grupoId,
            alerta: JSON.parse(JSON.stringify(this.alertaGrupo))
        };
        this.navController.push(EdicionNotaPage, params);
    }

    private addEvents(): void {
        this.events.subscribe("nota:refresh", () => {
            this.getNota(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("nota:refresh");
    }
}