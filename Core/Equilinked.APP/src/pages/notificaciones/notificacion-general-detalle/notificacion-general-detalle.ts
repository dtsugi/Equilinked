import {Component, OnDestroy, OnInit} from "@angular/core";
import {NavController, NavParams, Events} from "ionic-angular";
import {CommonService} from "../../../services/common.service";
import {AlertaService} from "../../../services/alerta.service";
import {SecurityService} from "../../../services/security.service";
import {Alerta} from "../../../model/alerta";
import {UserSessionEntity} from "../../../model/userSession";
import {NotificacionesExtendedInsertPage} from "../notificaciones-extended-insert";
import moment from "moment";
import "moment/locale/es";
import {LanguageService} from '../../../services/language.service';
import {Utils} from '../../../app/utils';

@Component({
  templateUrl: "notificacion-general-detalle.html",
  providers: [LanguageService, AlertaService, CommonService, SecurityService]
})
export class NotificacionGeneralDetalle implements OnDestroy, OnInit {
  labels: any = {};
  private alertaId: number;
  private caballoId: number;
  private session: UserSessionEntity;
  alertaEntity: Alerta;

  constructor(private alertaService: AlertaService,
              private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private commonService: CommonService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.alertaEntity = new Alerta();
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.alertaId = this.navParams.get("alertaId");
    this.caballoId = this.navParams.get("caballoId");
    this.getInfoAlerta(true);
    this.addEvents(); //Registrar eventos
  }

  ngOnDestroy(): void {
    this.removeEvents(); //Dar de baja eventos!
  }

  goBack(): void {
    this.navCtrl.pop();
  }

  edit(): void {
    let params: any = {
      alertaEntity: JSON.parse(JSON.stringify(this.alertaEntity)),
      isUpdate: true,
      callbackController: this
    };
    this.navCtrl.push(NotificacionesExtendedInsertPage, params);
  }

  private getInfoAlerta(loading: boolean): void {
    if (loading)
      this.commonService.showLoading(this.labels["PANT009_ALT_CAR"]);
    this.alertaService.getAlertaById(this.session.PropietarioId, this.alertaId)
      .then(alerta => {
        if (alerta != null) {
          let d = Utils.getMomentFromAlertDate(alerta.FechaNotificacion);
          alerta.Fecha = d.format("dddd, D [de] MMMM [de] YYYY");
          alerta.Fecha = alerta.Fecha.charAt(0).toUpperCase() + alerta.Fecha.slice(1);
          alerta.Hora = d.format("hh:mm");
          alerta.Meridiano = d.format("a").toUpperCase();
        }
        this.alertaEntity = alerta;
        if (loading)
          this.commonService.hideLoading();
      }).catch(err => {
      console.error(err);
    });
  }

  private addEvents(): void {
    this.events.subscribe("notificacion:caballo:refresh", () => {
      this.getInfoAlerta(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("notificacion:caballo:refresh");
  }
}

