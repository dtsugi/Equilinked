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
  private MAX_INDEX_FOR_CUT: number = 30;
  private SIZE_WORDS_BEFORE_CUT: number = 0;
  private grupo: any;
  private tipoAlerta: number;
  private session: UserSessionEntity;
  private notasRespaldo: Array<any>;
  labels: any = {};
  notas: Array<any>;
  modoEdicion: boolean;
  loading: boolean;
  isFilter: boolean;

  constructor(private alertController: AlertController,
              private alertaGrupoService: AlertaGrupoService,
              private commonService: CommonService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.loading = true;
    this.isFilter = false;
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
      this.getNotasByGrupo(); //listar las notas!
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
    this.isFilter = false;
    this.notasRespaldo.forEach(n => {
      n.nota.TituloFilter = n.nota.Titulo;
      n.nota.DescripcionFilter = n.nota.Descripcion;
      n.nota.FechaFilter = n.nota.Fecha;
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      this.notas = this.notasRespaldo.filter(n => {
        let indexTitutlo = n.nota.Titulo.toUpperCase().indexOf(value.toUpperCase());
        let indexDescripcion = n.nota.Descripcion.toUpperCase().indexOf(value.toUpperCase());
        let indexFecha = n.nota.Fecha.toUpperCase().indexOf(value.toUpperCase());
        if (indexTitutlo > -1) {
          if (indexTitutlo > this.MAX_INDEX_FOR_CUT) {
            let indices = this.getIndicesOf(" ", n.nota.Titulo, true, indexTitutlo);
            if (indices.length > this.SIZE_WORDS_BEFORE_CUT) {
              n.nota.TituloFilter = "... " + n.nota.TituloFilter.substring(indices[indices.length - (this.SIZE_WORDS_BEFORE_CUT + 1)]);
              indexTitutlo = n.nota.TituloFilter.toUpperCase().indexOf(value.toUpperCase());
            }
          }
          let textReplace = n.nota.TituloFilter.substring(indexTitutlo, indexTitutlo + value.length);
          n.nota.TituloFilter = n.nota.TituloFilter.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (indexDescripcion > -1) {
          if (indexDescripcion > this.MAX_INDEX_FOR_CUT) {
            let indices = this.getIndicesOf(" ", n.nota.Descripcion, true, indexDescripcion);
            if (indices.length > this.SIZE_WORDS_BEFORE_CUT) {
              n.nota.DescripcionFilter = "... " + n.nota.DescripcionFilter.substring(indices[indices.length - (this.SIZE_WORDS_BEFORE_CUT + 1)]);
              indexDescripcion = n.nota.DescripcionFilter.toUpperCase().indexOf(value.toUpperCase());
            }
          }
          let textReplace = n.nota.DescripcionFilter.substring(indexDescripcion, indexDescripcion + value.length);
          n.nota.DescripcionFilter = n.nota.DescripcionFilter.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (indexFecha > -1) {
          let textReplace = n.nota.Fecha.substring(indexFecha, indexFecha + value.length);
          n.nota.FechaFilter = n.nota.Fecha.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        this.isFilter = true;
        return indexTitutlo > -1 || indexDescripcion > -1 || indexFecha > -1;
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
              this.getNotasByGrupo();//
              this.events.publish("notificaciones:refresh");//Actualimamos area de ontificacionesario
              this.events.publish("calendario:refresh");//refrescar alertas calendario
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

  private view(nota: any): void {
    let params: any = {grupoId: this.grupo.ID, alertaId: nota.ID};
    this.navController.push(DetalleNotaPage, params);
  }

  private getNotasByGrupo(): void {
    let fecha: string = moment().format("YYYY-MM-DD");
    this.loading = true;
    this.alertaGrupoService.getAlertasByGrupoId(this.session.PropietarioId, this.grupo.ID, null, null,
      [this.tipoAlerta], null, ConstantsConfig.ALERTA_ORDEN_DESCENDENTE)
      .then(notas => {
        this.loading = false;
        this.notasRespaldo = notas.map(nota => {
          nota.Fecha = moment(new Date(nota.FechaNotificacion)).format("DD/MM/YYYY");
          return {seleccion: false, nota: nota};
        });
        this.filter(null);
      }).catch(err => {
      console.error(err);
      this.loading = false;
      this.commonService.ShowInfo(this.labels["PANT018_MSG_ERRCAR"]);
    });
  }

  private addEvents(): void {
    this.events.subscribe("notas:refresh", () => {
      this.getNotasByGrupo();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("notas:refresh");
  }
}
