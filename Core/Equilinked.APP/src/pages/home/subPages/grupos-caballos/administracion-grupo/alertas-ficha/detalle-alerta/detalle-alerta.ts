import {Component, OnInit, OnDestroy} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {AlertaService} from "../../../../../../../services/alerta.service";
import {AlertaGrupoService} from "../../../../../../../services/alerta-grupo.service";
import {CommonService} from "../../../../../../../services/common.service";
import {SecurityService} from "../../../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../../../model/userSession";
import {EdicionAlertaPage} from "../edicion-alerta/edicion-alerta";
import moment from "moment";
import "moment/locale/es";
import {LanguageService} from '../../../../../../../services/language.service';
import {Utils} from '../../../../../../../app/utils';

@Component({
  templateUrl: "detalle-alerta.html",
  providers: [LanguageService, AlertaService, AlertaGrupoService, CommonService, SecurityService],
  styles: [`
    .col {
      font-size: 1.5rem;
    }
  `]
})
export class DetalleAlertaPage implements OnInit, OnDestroy {
  private grupoId: number;
  private alertaId: number;
  private session: UserSessionEntity;
  labels: any = {};
  alertaGrupo: any;

  constructor(private alertaService: AlertaService,
              private commonService: CommonService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    moment.locale("es"); //Espaniol!!!!
    this.session = this.securityService.getInitialConfigSession();
    this.grupoId = this.navParams.get("grupoId");
    this.alertaId = this.navParams.get("alertaId");
    this.getAlerta(true); //consulta la informacion de la alerta
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  getAlerta(showLoading: boolean): void {
    if (showLoading)
      this.commonService.showLoading(this.labels["PANT019_ALT_PRO"]);
    this.alertaService.getAlertaById(this.session.PropietarioId, this.alertaId)
      .then(alerta => {
        if (alerta != null) {
          let d = Utils.getMomentFromAlertDate(alerta.FechaNotificacion);
          alerta.Fecha = d.format("dddd, D [de] MMMM [de] YYYY");
          alerta.Fecha = alerta.Fecha.charAt(0).toUpperCase() + alerta.Fecha.slice(1);
          alerta.Hora = d.format("hh:mm");
          alerta.Meridiano = d.format("a").toUpperCase();
          this.alertaGrupo = alerta;
          console.info(alerta);
        }
        if (showLoading)
          this.commonService.hideLoading();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT019_MSG_ERR"]);
    });
  }

  edit(alertaGrupo: any): void {
    let params: any = {
      grupoId: this.grupoId,
      tipoAlerta: alertaGrupo.Tipo,
      alerta: JSON.parse(JSON.stringify(alertaGrupo))
    };
    this.navController.push(EdicionAlertaPage, params);
  }

  private addEvents(): void {
    this.events.subscribe("alerta:refresh", () => {
      this.getAlerta(false); //Refrescamo la info de la alarta!
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("alerta:refresh");
  }
}
