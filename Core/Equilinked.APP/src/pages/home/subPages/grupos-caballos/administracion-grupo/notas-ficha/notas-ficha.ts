import {Component, OnInit, OnDestroy} from "@angular/core";
import {AlertController, Events, NavController, NavParams} from "ionic-angular";
import {AlertaService} from "../../../../../../services/alerta.service";
import {AlertaGrupoService} from "../../../../../../services/alerta-grupo.service";
import {CommonService} from "../../../../../../services/common.service";
import {SecurityService} from "../../../../../../services/security.service";
import {EdicionNotaPage} from "./edicion-nota/edicion-nota";
import {DetalleNotaPage} from "./detalle-nota/detalle-nota";
import {UserSessionEntity} from "../../../../../../model/userSession";
import {ConstantsConfig} from "../../../../../../app/utils"
import moment from "moment";
import {LanguageService} from '../../../../../../services/language.service';

@Component({
  templateUrl: "./notas-ficha.html",
  providers: [LanguageService, AlertaService, AlertaGrupoService, CommonService, SecurityService]
})
export class NotasFichaPage implements OnInit, OnDestroy {
  private grupo: any;
  private tipoAlerta: number;
  private session: UserSessionEntity;
  private notasRespaldo: Array<any>;
  labels: any = {};
  notas: Array<any>;
  modoEdicion: boolean;

  constructor(private alertController: AlertController,
              private alertaGrupoService: AlertaGrupoService,
              private commonService: CommonService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.grupo = {};
    this.notas;
    this.notasRespaldo = new Array<any>();
    this.modoEdicion = false; //para activar la eliminacion
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupo = this.navParams.get("grupo");
    this.tipoAlerta = this.navParams.get("tipoAlerta");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.getNotasByGrupo(true); //listar las notas!
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  goBack(): void {
    this.navController.pop();
  }

  filter(evt: any): void {
    let value: string = evt.target.value;
    if (value && value !== null) {
      this.notas = this.notasRespaldo.filter(n => {
        return n.nota.Titulo.toUpperCase().indexOf(value.toUpperCase()) > -1
          || n.nota.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1
      });
    } else {
      this.notas = this.notasRespaldo;
    }
  }

  create(): void {
    let alerta: any = { //Ya cremos la alerta!
      AlertaGrupo: [{Grupo_ID: this.grupo.ID}],
      Tipo: this.tipoAlerta,
      AlertaCaballo: [],
      AlertaRecordatorio: [],
      Propietario_ID: this.session.PropietarioId
    };
    let params: any = {
      grupoId: this.grupo.ID,
      alerta: alerta
    };
    this.navController.push(EdicionNotaPage, params);
  }

  select(n: any): void {
    if (this.modoEdicion) {
      n.seleccion = !n.seleccion;
    } else {
      this.view(n.nota);
    }
  }

  activeDelete(): void {
    this.notasRespaldo.forEach(n => {
      n.seleccion = false;
    });
    this.modoEdicion = true;
  }

  selectAll(): void {
    let selectAll: boolean = this.getCountSelected() !== this.notasRespaldo.length;
    this.notasRespaldo.forEach(n => {
      n.seleccion = selectAll;
    });
  }

  getCountSelected(): number {
    return this.notasRespaldo.filter(n => n.seleccion).length;
  }

  confirmDelete(): void {
    this.alertController.create({
      message: this.labels['PANT018_ALT_MSGEL'],
      buttons: [
        {
          text: this.labels['PANT018_BTN_CAN'],
          role: "cancel"
        },
        {
          text: this.labels['PANT018_BTN_ACE'],
          handler: () => {
            this.commonService.showLoading(this.labels['PANT018_ALT_PRO']);
            this.alertaGrupoService.deleteAlertasGrupoByIds(this.session.PropietarioId,
              this.grupo.ID, this.notasRespaldo.filter(e => e.seleccion).map(e => e.nota.ID)
            ).then(() => {
              this.getNotasByGrupo(false);//
              this.events.publish("notificaciones:refresh");//Actualimamos area de ontificaciones
              this.commonService.hideLoading();
              this.modoEdicion = false;
            }).catch(err => {
              this.commonService.ShowErrorHttp(err, this.labels["PANT018_MSG_ERRELI"]);
            });
          }
        }
      ]
    }).present();
  }

  private view(nota: any): void {
    let params: any = {grupoId: this.grupo.ID, alertaId: nota.ID};
    this.navController.push(DetalleNotaPage, params);
  }

  private getNotasByGrupo(showLoading: boolean): void {
    let fecha: string = moment().format("YYYY-MM-DD");
    if (showLoading)
      this.commonService.showLoading(this.labels['PANT018_ALT_PRO']);
    this.alertaGrupoService.getAlertasByGrupoId(this.session.PropietarioId, this.grupo.ID, fecha, this.tipoAlerta,
      ConstantsConfig.ALERTA_FILTER_NEXT, null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE)
      .then(notas => {
        if (showLoading)
          this.commonService.hideLoading();
        this.notasRespaldo = notas.map(nota => {
          nota.Fecha = moment(new Date(nota.FechaNotificacion)).format("DD/MM/YYYY");
          return {seleccion: false, nota: nota};
        });
        this.notas = this.notasRespaldo;
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT018_MSG_ERRCAR"]);
    });
  }

  private addEvents(): void {
    this.events.subscribe("notas:refresh", () => {
      this.getNotasByGrupo(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("notas:refresh");
  }
}
