import {Component, OnInit, OnDestroy} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {ConstantsConfig, Utils} from '../../../../app/utils'
import {CommonService} from '../../../../services/common.service';
import {AlertaService} from '../../../../services/alerta.service';
import {AlertaCaballoService} from '../../../../services/alerta.caballo.service';
import {NotificacionLocalService} from '../../../../services/notificacion-local.service';
import {Alerta} from '../../../../model/alerta';
import {UserSessionEntity} from '../../../../model/userSession';
import {SecurityService} from '../../../../services/security.service';
import {NotificacionNotaDetalle} from "../../../notificaciones/notificacion-nota-detalle/notificacion-nota-detalle";
import {NotificacionesInsertPage} from '../../../notificaciones/notificaciones-insert';
import "moment/locale/es";
import {LanguageService} from '../../../../services/language.service';

@Component({
  templateUrl: 'notas.html',
  providers: [LanguageService, CommonService, AlertaService, AlertaCaballoService, SecurityService]
})
export class NotasPage implements OnInit, OnDestroy {
  private MAX_INDEX_FOR_CUT: number = 30;
  private SIZE_WORDS_BEFORE_CUT: number = 0;
  private tipoAlerta: number = ConstantsConfig.ALERTA_TIPO_NOTASVARIAS;
  private session: UserSessionEntity;
  private notasCaballoResp: Array<any>;
  private notasGruposResp: Array<any>;
  notasCaballo: Array<any>;
  notasGrupos: Array<any>;
  labels: any = {};
  idCaballo: number;
  nombreCaballo: string;
  isDeleting: boolean = false;
  loading: boolean;
  isFilter: boolean;

  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _commonService: CommonService,
              private notificacionLocalService: NotificacionLocalService,
              private alertaCaballoService: AlertaCaballoService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.loading = true;
    this.isFilter = false;
    this.notasCaballo = new Array<any>();
    this.notasGrupos = new Array<any>();
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit() {
    this.session = this.securityService.getInitialConfigSession();
    if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
      this.idCaballo = this.navParams.get("idCaballoSelected");
      this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
      this.getAllNotificacionesByCaballoId();
    }
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  filter(evt: any): void {
    this.notasCaballo = new Array<any>();
    this.notasGrupos = new Array<any>();
    this.filterNotas(evt, this.notasCaballo, this.notasCaballoResp);
    this.filterNotas(evt, this.notasGrupos, this.notasGruposResp);
  }

  private filterNotas(evt: any, notas: Array<any>, notasResp: Array<any>): void {
    this.isFilter = false;
    notasResp.forEach(nota => {
      nota.TituloFilter = nota.Titulo;
      nota.DescripcionFilter = nota.Descripcion;
      nota.FechaFilter = nota.Fecha;
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      notasResp.forEach(nota => {
        let indexTitutlo = nota.Titulo.toUpperCase().indexOf(value.toUpperCase());
        let indexDescripcion = nota.Descripcion.toUpperCase().indexOf(value.toUpperCase());
        let indexFecha = nota.Fecha.toUpperCase().indexOf(value.toUpperCase());
        if (indexTitutlo > -1) {
          if (indexTitutlo > this.MAX_INDEX_FOR_CUT) {
            let indices = this.getIndicesOf(" ", nota.Titulo, true, indexTitutlo);
            if (indices.length > this.SIZE_WORDS_BEFORE_CUT) {
              nota.TituloFilter = "... " + nota.TituloFilter.substring(indices[indices.length - (this.SIZE_WORDS_BEFORE_CUT + 1)]);
              indexTitutlo = nota.TituloFilter.toUpperCase().indexOf(value.toUpperCase());
            }
          }
          let textReplace = nota.TituloFilter.substring(indexTitutlo, indexTitutlo + value.length);
          nota.TituloFilter = nota.TituloFilter.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (indexDescripcion > -1) {
          if (indexDescripcion > this.MAX_INDEX_FOR_CUT) {
            let indices = this.getIndicesOf(" ", nota.Descripcion, true, indexDescripcion);
            if (indices.length > this.SIZE_WORDS_BEFORE_CUT) {
              nota.DescripcionFilter = "... " + nota.DescripcionFilter.substring(indices[indices.length - (this.SIZE_WORDS_BEFORE_CUT + 1)]);
              indexDescripcion = nota.DescripcionFilter.toUpperCase().indexOf(value.toUpperCase());
            }
          }
          let textReplace = nota.DescripcionFilter.substring(indexDescripcion, indexDescripcion + value.length);
          nota.DescripcionFilter = nota.DescripcionFilter.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (indexFecha > -1) {
          let textReplace = nota.Fecha.substring(indexFecha, indexFecha + value.length);
          nota.FechaFilter = nota.Fecha.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (indexTitutlo > -1 || indexDescripcion > -1 || indexFecha > -1) {
          notas.push(nota);
        }
        this.isFilter = true;
      });
    } else {
      notasResp.forEach(nota => notas.push(nota));
    }
  }

  getAllNotificacionesByCaballoId() {
    this.loading = true;
    this.alertaCaballoService.getAlertasByCaballoId(
      this.session.PropietarioId, this.idCaballo, null, null, [this.tipoAlerta],
      null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE
    ).then(res => {
      this.notasCaballoResp = new Array<any>();
      this.notasGruposResp = new Array<any>();
      res.forEach(alerta => {
        alerta.Fecha = Utils.getMomentFromAlertDate(alerta.FechaNotificacion).format("DD/MM/YY");
        if (!alerta.AlertaGrupal) {
          this.notasCaballoResp.push(alerta);
        }
      });
      res.forEach(alerta => {
        if (alerta.AlertaGrupal) {
          this.notasGruposResp.push(alerta);
        }
      });
      this.filter(null);
      this.loading = false;
    }).catch(error => {
      console.error(error);
      this._commonService.ShowInfo(this.labels["PANT007_MSG_ERRALT"]);
      this.loading = false;
    });
  }

  goViewNotificacion(notificacion) {
    /* Flag para determinar que no se este eliminando al mismo tiempo */
    if (!this.isDeleting) {
      this.navCtrl.push(NotificacionNotaDetalle, {alertaId: notificacion.ID});
    }
  }

  goInsertNotificacion() {
    let notificacion: Alerta = new Alerta();
    notificacion.Tipo = this.tipoAlerta;
    notificacion.Propietario_ID = this.session.PropietarioId;
    notificacion.AlertaCaballo = [{Caballo_ID: this.idCaballo}];
    this.navCtrl.push(NotificacionesInsertPage, {alertaEntity: notificacion});
  }

  deleteNotification(notificacion: Alerta) {
    this._commonService.showLoading(this.labels["PANT007_ALT_CARG"]);
    this.alertaCaballoService.deleteAlertasCaballosByIds(this.session.PropietarioId, this.idCaballo, [notificacion.ID])
      .then(() => {
        this._commonService.hideLoading();
        this.events.publish("notificaciones:refresh");//Actualimamos area de ontificaciones
        this.events.publish("calendario:refresh");//refrescar alertas calendario
        this.getAllNotificacionesByCaballoId();
        try {
          this.notificacionLocalService.deleteLocalNotificationAlert([notificacion.ID]);
        } catch (err) {
          console.log("Error al eliminar not local");
          console.log(JSON.stringify(err));
        }
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, this.labels["PANT007_MSG_ERRELI"]);
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  /*
  Permite obtener los indices de las palabras que coincidian en el texto
   */
  private getIndicesOf(searchStr: string, str: string, caseSensitive: boolean, limitIndex: number): Array<number> {
    let indices: Array<number> = new Array<number>();
    let startIndex: number = 0;
    let index: number;
    let searchStrLen: number = searchStr.length;
    searchStr = caseSensitive ? searchStr.toLowerCase() : searchStr;
    str = caseSensitive ? str.toLowerCase() : str;
    if (searchStrLen > 0) {
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        if (index > limitIndex) {
          break;
        }
        indices.push(index);
        startIndex = index + searchStrLen;
      }
    }
    return indices;
  }

  private addEvents(): void {
    this.events.subscribe("notificaciones:notas:caballo:refresh", () => {
      this.getAllNotificacionesByCaballoId();
    });
  }

  private removeEvents(): void {
    this.events.subscribe("notificaciones:notas:caballo:refresh");
  }
}
