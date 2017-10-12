import {Component, OnDestroy, OnInit} from "@angular/core";
import {NavController, NavParams, Events} from "ionic-angular";
import {AlertaService} from "../../../../../services/alerta.service";
import {CommonService} from "../../../../../services/common.service";
import {LanguageService} from '../../../../../services/language.service';
import {SecurityService} from "../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../model/userSession";
import {EdicionEventoCaballoPage} from '../edicion-evento/edicion-evento';
import moment from "moment";
import "moment/locale/es";
import {Utils} from '../../../../../app/utils';

@Component({
  templateUrl: "detalle-evento.html",
  providers: [AlertaService, CommonService, LanguageService, SecurityService]
})
export class DetalleEventoCaballoPage implements OnDestroy, OnInit {
  private alertaId: number;
  private session: UserSessionEntity;
  labels: any = {};
  evento: any;

  constructor(private alertaService: AlertaService,
              private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private commonService: CommonService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.evento = {};
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.alertaId = this.navParams.get("alertaId");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.getInfoAlerta(true);
    });
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
      alerta: JSON.parse(JSON.stringify(this.evento))
    };
    this.navCtrl.push(EdicionEventoCaballoPage, params);
  }

  private getInfoAlerta(loading: boolean): void {
    if (loading)
      this.commonService.showLoading("Procesando...");
    this.alertaService.getAlertaById(this.session.PropietarioId, this.alertaId)
      .then(alerta => {
        if (alerta != null) {
          alerta.FechaInicio = Utils.getMomentFromAlertDate(alerta.FechaNotificacion).format("D MMMM YYYY hh:mm a");
          alerta.FechaFin = Utils.getMomentFromAlertDate(alerta.FechaFinal).format("D MMMM YYYY hh:mm a");
        }
        this.evento = alerta;
        if (loading)
          this.commonService.hideLoading();
      }).catch(err => {
      console.error(err);
    });
  }

  private addEvents(): void {
    this.events.subscribe("notificacion:evento:caballo:refresh", () => {
      this.getInfoAlerta(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("notificacion:evento:caballo:refresh");
  }
}

