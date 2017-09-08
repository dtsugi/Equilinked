import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Events, NavController, NavParams, PopoverController, Slides} from "ionic-angular";
import {CommonService} from "../../../../../services/common.service";
import {GruposCaballosService} from "../../../../../services/grupos-caballos.service";
import {SecurityService} from "../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../model/userSession";
import {OpcionesFichaGrupo} from "./opciones-ficha/opciones-ficha";
import {GrupoAlertasEditPage} from "./segment-calendario/alertas-edit/grupo-alertas-edit";
import {LanguageService} from '../../../../../services/language.service';
import {SegmentCaballosGrupo} from "./segment-caballos/segment-caballos";
import {SegmentCalendarioGrupo} from './segment-calendario/calendario-grupo';
import {EquiPopoverFiltroCalendario} from "../../../../../utils/equi-popover-filtro-calendario/equi-popover-filtro-calendario";
import {ConstantsConfig} from "../../../../../app/utils";

@Component({
  templateUrl: "./administracion-grupo.html",
  providers: [LanguageService, CommonService, GruposCaballosService, SecurityService]
})
export class AdministracionGrupoPage implements OnInit, OnDestroy {
  public CALENDAR_STEP_MONTH: number = ConstantsConfig.CALENDAR_STEP_MONTH;
  public CALENDAR_STEP_WEEK: number = ConstantsConfig.CALENDAR_STEP_WEEK;
  public CALENDAR_STEP_ALERT: number = ConstantsConfig.CALENDAR_STEP_ALERT;
  private grupoId: number;
  private session: UserSessionEntity;
  private slidesMap: Map<string, number>;
  private indexSlidesMap: Map<number, string>;
  private lastSlide: string;
  @ViewChild(Slides) slides: Slides;
  @ViewChild(SegmentCaballosGrupo) caballosGrupo: SegmentCaballosGrupo;
  @ViewChild(SegmentCalendarioGrupo) segmentCalendar: SegmentCalendarioGrupo;
  labels: any = {};
  grupo: any;
  segmentSelection: string;
  parametrosCaballos: any;
  calendarOptions: any;
  optionsTypeAlerts: any;

  constructor(private commonService: CommonService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private popoverController: PopoverController,
              private gruposCaballosService: GruposCaballosService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.slidesMap = new Map<string, number>();
    this.indexSlidesMap = new Map<number, string>();
    this.segmentSelection = "ficha";
    this.grupo = {};
    this.calendarOptions = {step: 1}; //este objeto se le pasa al calendar
    this.parametrosCaballos = {modoEdicion: false, getCountSelected: null, grupoDefault: false};
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupoId = this.navParams.get("grupoId");
    this.lastSlide = "ficha";
    this.slidesMap.set("ficha", 0);
    this.slidesMap.set("calendario", 1);
    this.slidesMap.set("caballos", 2);
    this.indexSlidesMap.set(0, "ficha");
    this.indexSlidesMap.set(1, "calendario");
    this.indexSlidesMap.set(2, "caballos");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      let alertTypes: Array<any> = this.getAlertTypes();
      alertTypes.unshift({name: this.labels["PANT013_LBL_TODS"], checked: true});
      this.optionsTypeAlerts = {modified: false, alertTypes: alertTypes};
      this.getInfoGrupo(true);
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  showSlide(slide: string) {
    if (slide != this.lastSlide) {
      this.slides.slideTo(this.slidesMap.get(slide), 500);
      this.lastSlide = slide;
      this.loadInfoSegment();
    }
  }

  slideChanged(slide: any) {
    let tab: string = this.indexSlidesMap.get(slide.realIndex);
    if (this.lastSlide != tab) {
      this.segmentSelection = tab;
      this.lastSlide = tab;
      this.loadInfoSegment();
    }
  }

  goBack(): void {
    this.navController.pop();
  }

  backCalendar(): void {
    this.segmentCalendar.backCalendar();//que el componente le diga al otro componente que regrese a la vista anterior
  }

  newAlert(): void {
    let params: any = {grupo: this.grupo};
    this.navController.push(GrupoAlertasEditPage, params);
  }

  editAlert(): void {
    console.info("Editar alerta!");
    let alert: any = this.segmentCalendar.getAlert();
    let params: any = {grupo: this.grupo, alerta: JSON.parse(JSON.stringify(alert))};
    this.navController.push(GrupoAlertasEditPage, params);
  }

  /*Muestra las opciones cuando se encuentra activa "FICHA"*/
  showOptionsFicha(ev: any): void {
    let popover = this.popoverController.create(OpcionesFichaGrupo, {
      navCtrlGrupo: this.navController,
      grupo: JSON.parse(JSON.stringify(this.grupo))
    });
    popover.present({
      ev: ev
    });
  }

  /*Activa la seleccion de cabalos para eliminacion en "CABALLOS" */
  enabledDeleteCaballos(): void {
    this.parametrosCaballos.modoEdicion = true;
    this.events.publish("caballos-grupo:eliminacion:enabled");
  }

  /*Desactiva la seleccion de cabalos para eliminacion en "CABALLOS" */
  disabledDeleteCaballos(): void {
    this.parametrosCaballos.modoEdicion = false;
  }

  /*Solicitar confirmacion de eliminacion en "CABALLOS"*/
  delete(): void {
    this.events.publish("caballos-grupo:eliminacion:confirmed");
  }

  /*Popover de filtro de notificaciones calendario*/
  showFilterAlertTypes(ev: any): void {
    let popover = this.popoverController.create(EquiPopoverFiltroCalendario, {
      options: this.optionsTypeAlerts
    });
    popover.onDidDismiss(() => {
      console.info("Refrescar las notificaciones del mes de los tipos seleccionados");
      this.segmentCalendar.reloadAlerts();//refrescar
    });
    popover.present({
      ev: ev
    });
  }

  private loadInfoSegment(): void {
    if (this.segmentSelection == "caballos") {
      this.caballosGrupo.getAllCaballosGrupo();
    } else if (this.segmentSelection == "calendario") {
      this.segmentCalendar.reloadAlerts();//mandamos a refrescar las alertas
    }
  }

  private getInfoGrupo(showLoading: boolean): void {
    if (showLoading)
      this.commonService.showLoading(this.labels["PANT013_ALT_PRO"]);
    this.gruposCaballosService.getGrupoById(this.grupoId)
      .then(grupo => {
        this.grupo = grupo;
        this.parametrosCaballos.grupoDefault = grupo.GrupoDefault;
        if (showLoading)
          this.commonService.hideLoading();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT013_MSG_ERRCG"]);
    });
  }

  private addEvents(): void {
    this.events.subscribe("grupo:refresh", () => {
      this.getInfoGrupo(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("grupo:refresh");
  }

  private getAlertTypes(): Array<any> {
    return [
      {id: ConstantsConfig.ALERTA_TIPO_EVENTOS, name: this.labels["PANT013_LBL_EVTS"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_HERRAJE, name: this.labels["PANT013_LBL_HERR"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_DESPARACITACION, name: this.labels["PANT013_LBL_DESP"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_DENTISTA, name: this.labels["PANT013_LBL_DENT"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS, name: this.labels["PANT013_LBL_NOTS"], checked: true}
    ];
  }
}
