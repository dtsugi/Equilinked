import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, NavController, NavParams, PopoverController, Slides} from 'ionic-angular';
import {CaballoService} from '../../../services/caballo.service';
import {CommonService} from '../../../services/common.service';
import {LanguageService} from '../../../services/language.service';
import {Caballo} from '../../../model/caballo';
import {DatosViewPage} from './datos/datos-view';
import {AlimentacionPage} from './alimentacion/alimentacion';
import {NotasPage} from './notas/notas';
import {HerrajesPage} from './herrajes/herrajes';
import {DentistaPage} from './dentista/dentista';
import {DesparasitacionPage} from './desparasitacion/desparasitacion';
import {EventosCaballoPage} from './eventos/eventos';
import {OpcionesCaballoPopover} from "./opciones-caballo/opciones-caballo";
import {UbicacionCaballoPage} from "./ubicacion/ubicacion";
import {AsignacionUbicacionCaballoPage} from "./ubicacion/asignacion-ubicacion/asignacion-ubicacion";
import {SegmentCalendarioCaballo} from './calendario/calendario-caballo';
import {EquiPopoverFiltroCalendario} from '../../../utils/equi-popover-filtro-calendario/equi-popover-filtro-calendario';
import {CaballoAlertasEditPage} from './calendario/alertas-edit/caballo-alertas-edit';
import {ConstantsConfig} from '../../../app/utils';

@Component({
  templateUrl: 'ficha-caballo-home.html',
  providers: [CaballoService, CommonService, LanguageService]
})
export class FichaCaballoPage implements OnDestroy, OnInit {
  public CALENDAR_STEP_MONTH: number = ConstantsConfig.CALENDAR_STEP_MONTH;
  public CALENDAR_STEP_WEEK: number = ConstantsConfig.CALENDAR_STEP_WEEK;
  public CALENDAR_STEP_ALERT: number = ConstantsConfig.CALENDAR_STEP_ALERT;
  private slidesMap: Map<string, number>;
  private indexSlidesMap: Map<number, string>;
  private lastSlide: string;
  @ViewChild(Slides) slides: Slides;
  @ViewChild(SegmentCalendarioCaballo) calendarioCaballo: SegmentCalendarioCaballo;
  labels: any = {};
  menu: string;
  caballo: Caballo;
  calendarOptions: any;
  optionsTypeAlerts: any;

  constructor(private caballoService: CaballoService,
              private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              public popoverController: PopoverController,
              private _commonService: CommonService,
              private languageService: LanguageService) {
    this.caballo = new Caballo();
    this.slidesMap = new Map<string, number>();
    this.indexSlidesMap = new Map<number, string>();
    this.menu = "informacion";
    this.calendarOptions = {step: 1, isAlertGroup: false};
  }

  ngOnInit(): void {
    this.caballo = this.navParams.get("caballoSelected");
    this.lastSlide = "informacion";
    this.slidesMap.set("informacion", 0);
    this.slidesMap.set("fotos", 1);
    this.slidesMap.set("calendario", 2);
    this.indexSlidesMap.set(0, "informacion");
    this.indexSlidesMap.set(1, "fotos");
    this.indexSlidesMap.set(2, "calendario");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      let alertTypes: Array<any> = this.getAlertTypes();
      alertTypes.unshift({name: this.labels["PANT003_LBL_TODS"], checked: true});
      this.optionsTypeAlerts = {modified: false, alertTypes: alertTypes};
      this.getInfoCaballo(true);
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  back(): void {
    this.navCtrl.pop();
  }

  backCalendar(): void {
    this.calendarioCaballo.backCalendar();//que el componente le diga al otro componente que regrese a la vista anterior
  }

  showSlide(slide: string) {
    if (slide != this.lastSlide) {
      this.slides.slideTo(this.slidesMap.get(slide), 500);
      this.lastSlide = slide;
      this.loadInfoSegment();
    }
  }

  newAlert(): void {
    let params: any = {caballo: this.caballo};
    this.navCtrl.push(CaballoAlertasEditPage, params);
  }

  editAlert(): void {
    let alert: any = this.calendarioCaballo.getAlert();
    let params: any = {caballo: this.caballo, alerta: JSON.parse(JSON.stringify(alert))};
    this.navCtrl.push(CaballoAlertasEditPage, params);
  }

  slideChanged(slide: any) {
    let tab: string = this.indexSlidesMap.get(slide.realIndex);
    if (this.lastSlide != tab) {
      this.menu = tab;
      this.lastSlide = tab;
      this.loadInfoSegment();
    }
  }

  openMenu(ev: any): void {
    let params: any = {
      navCtrlCaballo: this.navCtrl,
      caballo: this.caballo
    };
    this.popoverController.create(OpcionesCaballoPopover, params).present({
      ev: ev
    });
  }

  showFilterAlertTypes(ev: any): void {
    let popover = this.popoverController.create(EquiPopoverFiltroCalendario, {
      options: this.optionsTypeAlerts
    });
    popover.onDidDismiss(() => {
      this.calendarioCaballo.reloadAlerts();//refrescar
    });
    popover.present({
      ev: ev
    });
  }

  GoTo(idOption) {
    console.log(idOption);
    switch (idOption) {
      // DATOS
      case 1:
        this.navCtrl.push(DatosViewPage, {
          idCaballoSelected: this.caballo.ID,
          nombreCaballoSelected: this.caballo.Nombre
        });
        break;
      //UBICACION
      case 2:
        let page;
        if (this.caballo.Establo_ID) {
          page = UbicacionCaballoPage;
        } else {
          page = AsignacionUbicacionCaballoPage;
        }
        this.navCtrl.push(page, {caballo: this.caballo});
        break;
      //EVENTOS
      case 4:
        this.navCtrl.push(EventosCaballoPage, {
          caballo: this.caballo
        });
        break;
      // HERRAJES
      case 5:
        this.navCtrl.push(HerrajesPage, {
          idCaballoSelected: this.caballo.ID,
          nombreCaballoSelected: this.caballo.Nombre
        });
        break;
      // ALIMENTACION
      case 6:
        this.navCtrl.push(AlimentacionPage, {
          idCaballoSelected: this.caballo.ID,
          nombreCaballoSelected: this.caballo.Nombre
        });
        break;
      // DENTISTA
      case 7:
        this.navCtrl.push(DentistaPage, {
          idCaballoSelected: this.caballo.ID,
          nombreCaballoSelected: this.caballo.Nombre
        });
        break;
      // DESPARASITACION
      case 8:
        this.navCtrl.push(DesparasitacionPage, {
          idCaballoSelected: this.caballo.ID,
          nombreCaballoSelected: this.caballo.Nombre
        });
        break;
      // NOTAS VARIAS
      case 9:
        this.navCtrl.push(NotasPage, {
          idCaballoSelected: this.caballo.ID,
          nombreCaballoSelected: this.caballo.Nombre
        });
        break;
    }
  }

  private loadInfoSegment(): void {
    if (this.menu == "calendario") {
      this.calendarioCaballo.reloadAlerts();//refrecar alertas del caballo
    }
  }

  private getInfoCaballo(loading: boolean): void {
    if (loading)
      this._commonService.showLoading("Procesando...");
    this.caballoService.getSerializedById(this.caballo.ID).toPromise()
      .then(caballo => {
        this.caballo = caballo;
        if (loading)
          this._commonService.hideLoading();
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, "Error al cargar la información del caballo");
    });
  }

  private addEvents(): void { //Por este evento le haré llegar el nuevo nombre al caballo!
    this.events.subscribe("caballo-ficha:refresh", () => {
      this.getInfoCaballo(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("caballo-ficha:refresh");
  }

  private getAlertTypes(): Array<any> {
    return [
      {id: ConstantsConfig.ALERTA_TIPO_EVENTOS, name: this.labels["PANT003_LBL_EVTS"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_HERRAJE, name: this.labels["PANT003_LBL_HERR"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_DESPARACITACION, name: this.labels["PANT003_LBL_DESP"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_DENTISTA, name: this.labels["PANT003_LBL_DENT"], checked: true},
      {id: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS, name: this.labels["PANT003_LBL_NOTS"], checked: true},
    ];
  }
}
