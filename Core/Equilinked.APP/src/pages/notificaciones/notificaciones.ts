import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, NavController, AlertController, Slides} from 'ionic-angular';
import {CommonService} from '../../services/common.service';
import {NotificacionesViewPage} from './notificaciones-view';
import {AlertaService} from '../../services/alerta.service';
import {SecurityService} from '../../services/security.service';
import {UserSessionEntity} from '../../model/userSession';
import {ConstantsConfig} from "../../app/utils";
import {EdicionNotificacionGeneralPage} from "./edicion-notificacion/edicion-notificacion";
import moment from "moment";
import "moment/locale/es";
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'page-notificaciones',
  templateUrl: 'notificaciones.html',
  providers: [LanguageService, CommonService, AlertaService, SecurityService]
})
export class NotificacionesPage implements OnInit, OnDestroy {
  private HEIGHT_FOR_REMOVE: number = 98 + 64;//98barra 64superior barra inferior
  private session: UserSessionEntity;
  private notificacionesProximasResp: Array<any>;
  private slidesMap: Map<string, number>;
  private indexSlidesMap: Map<number, string>;
  private lastSlide: string;
  @ViewChild(Slides) slides: Slides;
  dateMillis: number;
  selectedTab: string;
  today: string;
  notificacionesHoy: Array<any>;
  notificacionesProximas: Array<any>;
  labels: any = {};
  loadingToday: boolean;
  loadingNext: boolean;
  isFilter: boolean;

  constructor(private events: Events,
              public navCtrl: NavController,
              public alertController: AlertController,
              private _commonService: CommonService,
              private _alertaService: AlertaService,
              private _securityService: SecurityService,
              private languageService: LanguageService) {
    this.isFilter = false;
    this.loadingToday = true;
    this.loadingNext = true;
    this.slidesMap = new Map<string, number>();
    this.indexSlidesMap = new Map<number, string>();
    this.selectedTab = "hoy";
    this.notificacionesHoy = new Array<any>();
    this.notificacionesProximas = new Array<any>();
  }

  ngOnInit(): void {
    this.adjustHeightSlides();
    this.session = this._securityService.getInitialConfigSession();
    this.lastSlide = "hoy";
    this.slidesMap.set("hoy", 0);
    this.slidesMap.set("proximas", 1);
    this.indexSlidesMap.set(0, "hoy");
    this.indexSlidesMap.set(1, "proximas");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.loadNotificaciones();
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
      this.loadNotificaciones();//Refrescar notificaciones!
    }
  }

  slideChanged(slide: any) {
    let tab = this.indexSlidesMap.get(slide.realIndex);
    if (this.lastSlide != tab) {
      this.selectedTab = tab;
      this.lastSlide = tab;
      this.loadNotificaciones();
    }
  }

  loadNotificaciones(): void {
    this.dateMillis = new Date().getTime();
    if (this.selectedTab === "hoy") {
      this.loadNotificacionesToday();
    } else {
      this.loadNextNotificaciones();
    }
  }

  filter(evt: any): void {
    this.isFilter = false;
    this.notificacionesProximasResp.forEach(pn => {
      pn.FechaCortaFilter = pn.FechaCorta;
      pn.DiaFilter = pn.Dia;
      pn.Notificaciones.forEach(n => {
        n.TituloFilter = n.Titulo;
        n.UbicacionFilter = n.Ubicacion;
        n.HoraFilter = n.Hora;
      });
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      let mapDates: Map<string, any> = new Map<string, any>();
      this.notificacionesProximasResp.forEach(pn => {
        let notificacionDia: any;
        pn.Notificaciones.forEach(n => {
          let indexTitulo = n.Titulo.toUpperCase().indexOf(value.toUpperCase());
          let indexUbicacion = n.Ubicacion ? n.Ubicacion.toUpperCase().indexOf(value.toUpperCase()) : -1;
          let indexHora = n.Hora.toUpperCase().indexOf(value.toUpperCase());
          if (indexTitulo > -1 || indexUbicacion > -1 || indexHora > -1) { //Alguna parte dela notificacion corresponde al texto buscado?
            if (!mapDates.has(pn.Fecha)) {
              notificacionDia = {
                Fecha: pn.Fecha,
                Dia: pn.Dia,
                DiaFilter: pn.Dia,
                FechaCorta: pn.FechaCorta,
                FechaCortaFilter: pn.FechaCorta,
                Notificaciones: []
              };
              mapDates.set(pn.Fecha, notificacionDia);
            }
            mapDates.get(pn.Fecha).Notificaciones.push(n);
            if (indexTitulo > -1) {
              let textReplace = n.Titulo.substring(indexTitulo, indexTitulo + value.length);
              n.TituloFilter = n.Titulo.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
            }
            if (n.Ubicacion && indexUbicacion > -1) {
              let textReplace = n.Ubicacion.substring(indexUbicacion, indexUbicacion + value.length);
              n.UbicacionFilter = n.Ubicacion.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
            }
            if (indexHora > -1) {
              let textReplace = n.Hora.substring(indexHora, indexHora + value.length);
              n.HoraFilter = n.Hora.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
            }
          }
        });
        let notificacionDiaTemp = !notificacionDia ? pn : notificacionDia;
        let indexFechaCorta = notificacionDiaTemp.FechaCorta.toUpperCase().indexOf(value.toUpperCase());
        let indexDia = notificacionDiaTemp.Dia.toUpperCase().indexOf(value.toUpperCase());
        if (indexFechaCorta > -1) {
          let textReplace = notificacionDiaTemp.FechaCorta.substring(indexFechaCorta, indexFechaCorta + value.length);
          notificacionDiaTemp.FechaCortaFilter = notificacionDiaTemp.FechaCorta.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (indexDia > -1) {
          let textReplace = notificacionDiaTemp.Dia.substring(indexDia, indexDia + value.length);
          notificacionDiaTemp.DiaFilter = notificacionDiaTemp.Dia.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (!notificacionDia && (indexFechaCorta > -1 || indexDia > -1)) {
          mapDates.set(pn.Fecha, notificacionDiaTemp);
        }
      });
      this.notificacionesProximas = Array.from(mapDates.values());
      this.isFilter = true;
    } else {
      this.notificacionesProximas = this.notificacionesProximasResp;
    }
  }

  newNotification(): void {
    this.navCtrl.push(EdicionNotificacionGeneralPage);
  }

  viewNotification(notificacion: any): void {
    console.log(notificacion);
    this.navCtrl.push(NotificacionesViewPage, {alertaId: notificacion.ID});
  }

  delete(notificacion: any): void {
    this._commonService.showLoading(this.labels["PANT021_ALT_PRO"]);
    this._alertaService.deleteAlertasByIds(this.session.PropietarioId, [notificacion.ID])
      .then(() => {
        this._commonService.hideLoading();
        this.loadNotificaciones();
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, this.labels["PANT021_MSG_ERRELI"]);
    });
    console.info(notificacion);
  }

  private adjustHeightSlides(): void {
    let slides = document.querySelectorAll(".alertas.equi-content-slide-scroll");
    for (let i = 0; i < slides.length; i++) {
      let element: any = slides[i];
      element.style.height = (window.innerHeight - this.HEIGHT_FOR_REMOVE) + "px";
    }
  }

  private loadNotificacionesToday(): void {
    let inicio: string = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    let fin: string = moment(new Date()).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    this.today = moment(new Date()).format("dddd, D [de] MMMM [de] YYYY");
    this.today = this.today.charAt(0).toUpperCase() + this.today.slice(1);
    this.loadingToday = true;
    this._alertaService.getAlertasByPropietario(this.session.PropietarioId, inicio, fin,
      null, null, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE, true
    ).then(alertas => {
      this.notificacionesHoy = alertas.map(a => {
        let d = new Date(a.FechaNotificacion);
        a.Expired = d.getTime() <= this.dateMillis;
        a.Hora = moment(d).format("hh:mm A").toUpperCase();
        return a;
      });
      this.loadingToday = false;
    }).catch(err => {
      console.error(err);
      this._commonService.ShowInfo(this.labels["PANT021_MSG_ERRCO"]);
      this.loadingToday = false;
    });
  }

  private loadNextNotificaciones(): void {
    let fecha: string = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    this.loadingNext = true;
    this._alertaService.getAlertasByPropietario(this.session.PropietarioId, fecha, null,
      null, null, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE, true
    ).then(alertas => {
      let mapDates: Map<string, any> = new Map<string, any>();
      let day: any;
      alertas.forEach(nn => {
        let d = new Date(nn.FechaNotificacion);
        nn.Hora = moment(d).format("hh:mm A").toUpperCase();
        let date: string = moment(d).format("dddd-DD MMMM");
        if (!mapDates.has(date)) {
          let partsDate: any = date.split("-");
          day = {
            Fecha: date,
            Dia: partsDate[0].charAt(0).toUpperCase() + partsDate[0].slice(1),
            FechaCorta: partsDate[1].toUpperCase().substring(0, 6),
            Notificaciones: []
          };
          mapDates.set(date, day);
        }
        day = mapDates.get(date);
        day.Notificaciones.push(nn);
      });
      this.notificacionesProximasResp = Array.from<any>(mapDates.values());
      this.filter(null);
      this.loadingNext = false;
    }).catch(err => {
      this._commonService.ShowInfo(this.labels["PANT021_MSG_ERRCO"]);
      this.loadingNext = false;
    });
  }

  private addEvents(): void {
    this.events.subscribe("notificaciones:refresh", () => {
      this.loadNotificaciones();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("notificaciones:refresh");
  }
}
