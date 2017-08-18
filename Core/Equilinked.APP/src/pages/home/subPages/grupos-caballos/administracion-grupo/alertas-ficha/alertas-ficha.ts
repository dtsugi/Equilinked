import {Component, OnInit, OnDestroy} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {AlertaService} from "../../../../../../services/alerta.service";
import {AlertaGrupoService} from "../../../../../../services/alerta-grupo.service";
import {CommonService} from "../../../../../../services/common.service";
import {SecurityService} from "../../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../../model/userSession";
import {EdicionAlertaPage} from "./edicion-alerta/edicion-alerta";
import {DetalleAlertaPage} from "./detalle-alerta/detalle-alerta";
import {ConstantsConfig} from "../../../../../../app/utils"
import moment from "moment";
import "moment/locale/es";
import {LanguageService} from '../../../../../../services/language.service';

@Component({
  templateUrl: "./alertas-ficha.html",
  providers: [LanguageService, AlertaService, AlertaGrupoService, CommonService, SecurityService],
  styles: [`
    * .title-form {
      font-weight: bold;
    }

    hr {
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
  labelsX: any = {};
  labels: any;
  proximasAlertas: Array<any>;
  historicoAlertas: Array<any>;
  loadingNext: boolean;
  loadingHistory: boolean;

  constructor(private alertaService: AlertaService,
              private alertaGrupoService: AlertaGrupoService,
              private commonService: CommonService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.loadingNext = true;
    this.loadingHistory = false;
    this.labels = {};
    this.grupo = {};
  }

  ngOnInit(): void {
    moment.locale("es"); //Espaniol!!!!
    this.session = this.securityService.getInitialConfigSession();
    this.grupo = this.navParams.get("grupo");
    this.tipoAlerta = this.navParams.get("tipoAlerta");
    this.languageService.loadLabels().then(labels => {
      this.labelsX = labels;
      this.applyLabels(); //Ajustar las leyendas según el tipo de alerta
      this.getAlertasByGrupo();
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  create(): void {
    let titulo: string;
    switch (this.tipoAlerta) {
      case ConstantsConfig.ALERTA_TIPO_DENTISTA:
        titulo = this.labelsX["PANT018_LBL_VIDEN"];
        break;
      case ConstantsConfig.ALERTA_TIPO_HERRAJE:
        titulo = this.labelsX["PANT018_LBL_VIHER"];
        break;
      case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
        titulo = this.labelsX["PANT018_LBL_VIDESP"];
        break;
    }
    let alerta: any = { //Ya cremos la alerta!
      AlertaGrupo: [{Grupo_ID: this.grupo.ID}],
      Titulo: titulo,
      Tipo: this.tipoAlerta,
      AlertaCaballo: [],
      AlertaRecordatorio: [],
      Propietario_ID: this.session.PropietarioId
    };
    let params: any = {
      grupoId: this.grupo.ID,
      tipoAlerta: this.tipoAlerta,
      alerta: alerta
    };
    this.navController.push(EdicionAlertaPage, params);
  }

  viewNextAlert(alertaGrupo: any): void {
    console.info(alertaGrupo);
    let params: any = {grupoId: this.grupo.ID, alertaId: alertaGrupo.ID};
    this.navController.push(DetalleAlertaPage, params);
  }

  editAlert(alertaGrupo: any): void {
    let params: any = {
      grupoId: this.grupo.ID,
      tipoAlerta: alertaGrupo.Tipo,
      alerta: JSON.parse(JSON.stringify(alertaGrupo))
    };
    this.navController.push(EdicionAlertaPage, params);
  }

  viewDetailHistoryAlert(alertaGrupo: any): void {
    this.commonService.showLoading(this.labelsX["PANT018_ALT_PRO"]);
    this.alertaService.getAlertaById(this.session.PropietarioId, alertaGrupo.ID)
      .then(ag => {
        this.commonService.hideLoading();
        alertaGrupo.AllCaballos = ag.AllCaballos;
        alertaGrupo.AlertaGrupo = ag.AlertaGrupo;
        alertaGrupo.AlertaCaballo = ag.AlertaCaballo;
        alertaGrupo.AlertaRecordatorio = ag.AlertaRecordatorio;
        alertaGrupo.ShowDetail = true;
        console.info(alertaGrupo);
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labelsX["PANT018_MSG_ERRCAR"]);
    });
  }

  closeDetailtHistoryAlert(alertaGrupo: any): void {
    alertaGrupo.ShowDetail = false;
  }

  delete(notificacion: any): void {
    this.commonService.showLoading(this.labelsX["PANT018_ALT_PRO"]);
    this.alertaGrupoService.deleteAlertasGrupoByIds(this.session.PropietarioId, this.grupo.ID, [notificacion.ID])
      .then(() => {
        this.getAlertasByGrupo();
        this.events.publish("notificaciones:refresh");//Actualimamos area de ontificaciones
        this.commonService.hideLoading();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labelsX["PANT018_MSG_ERRELI"]);
    });
  }

  private applyLabels(): void {
    switch (this.tipoAlerta) {
      case ConstantsConfig.ALERTA_TIPO_DENTISTA:
        this.labels.title = this.labelsX["PANT018_LBL_DE"];
        this.labels.titleNextAlertas = this.labelsX["PANT018_LBL_DENPRO"];
        this.labels.tablePerson = this.labelsX["PANT018_LBL_DE"];
        this.labels.tableDescription = this.labelsX["PANT018_LBL_NOT"];
        break;
      case ConstantsConfig.ALERTA_TIPO_HERRAJE:
        this.labels.title = this.labelsX["PANT018_LBL_HESUBT"];
        this.labels.titleNextAlertas = this.labelsX["PANT018_LBL_HEPROX"];
        this.labels.tablePerson = this.labelsX["PANT018_LBL_HE"];
        this.labels.tableDescription = this.labelsX["PANT018_LBL_HEINFO"];
        break;
      case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
        this.labels.title = this.labelsX["PANT018_LBL_DESSUBT"];
        this.labels.titleNextAlertas = this.labelsX["PANT018_LBL_DESPRO"];
        this.labels.tablePerson = this.labelsX["PANT018_LBL_APLI"];
        this.labels.tableDescription = this.labelsX["PANT018_LBL_NOT"];
        break;
    }
  }

  private getAlertasByGrupo(): void {
    let fecha: string = moment().format("YYYY-MM-DD");
    this.loadingNext = true;
    this.loadingHistory = true;
    this.alertaGrupoService.getAlertasByGrupoId(this.session.PropietarioId, this.grupo.ID, fecha, this.tipoAlerta,
      ConstantsConfig.ALERTA_FILTER_NEXT, 3, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE)
      .then(alertas => { //Primero las proximas!
        this.proximasAlertas = alertas.map(a => {
          let d = new Date(a.FechaNotificacion);
          a.Fecha = moment(d).format("D [de] MMMM [de] YYYY");
          a.Hora = moment(d).format("hh:mm a");
          return a;
        });
        this.loadingNext = false;
        return this.alertaGrupoService.getAlertasByGrupoId(this.session.PropietarioId, this.grupo.ID, fecha, this.tipoAlerta,
          ConstantsConfig.ALERTA_FILTER_HISTORY, null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE);
      }).then(alertas => {
      this.historicoAlertas = alertas.map(a => {
        a.Fecha = moment(new Date(a.FechaNotificacion)).format("DD/MM/YY");
        return a;
      });
      this.loadingHistory = false;
    }).catch(err => {
      console.error(err);
      this.commonService.ShowInfo(this.labelsX["PANT018_MSG_ERRCAR"]);
      this.loadingNext = false;
      this.loadingHistory = false;
    });
  }

  private addEvents(): void {
    this.events.subscribe("alertas:refresh", () => {
      this.getAlertasByGrupo();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("alertas:refresh");
  }
}
