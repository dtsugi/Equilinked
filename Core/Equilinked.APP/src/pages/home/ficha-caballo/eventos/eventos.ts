import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Events, NavController, NavParams, Slides} from 'ionic-angular';
import {SegmentEventosProximos} from "./segment-proximos/segment-proximos";
import {SegmentEventosHistorial} from "./segment-historial/segment-historial";
import {EdicionEventoCaballoPage} from './edicion-evento/edicion-evento';
import {SegmentCalendarioEventos} from "./segment-calendario/segment-calendario";

@Component({
  templateUrl: 'eventos.html'
})
export class EventosCaballoPage implements OnInit, OnDestroy {
  private today: string;
  private slidesMap: Map<string, number>;
  private indexSlidesMap: Map<number, string>;
  private lastSlide: string;
  @ViewChild(Slides) slides: Slides;
  @ViewChild(SegmentEventosProximos) segmentProximos: SegmentEventosProximos;
  @ViewChild(SegmentCalendarioEventos) segmentCalendario: SegmentCalendarioEventos;
  @ViewChild(SegmentEventosHistorial) segmentHistorial: SegmentEventosHistorial;
  caballo: any = {};
  selectedTab: string;

  constructor(private events: Events,
              public navController: NavController,
              private navParams: NavParams) {
    this.slidesMap = new Map<string, number>();
    this.indexSlidesMap = new Map<number, string>();
    this.selectedTab = "proximos";
  }

  ngOnInit(): void {
    this.slides.threshold = 120;
    this.lastSlide = "proximos";
    this.slidesMap.set("proximos", 0);
    this.slidesMap.set("calendario", 1);
    this.slidesMap.set("historial", 2);
    this.indexSlidesMap.set(0, "proximos");
    this.indexSlidesMap.set(1, "calendario");
    this.indexSlidesMap.set(2, "historial");
    this.caballo = this.navParams.get("caballo");//Sacamos el caballo!
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  showSlide(slide: string) {
    if (slide != this.lastSlide) {
      this.slides.slideTo(this.slidesMap.get(slide), 500);
      this.lastSlide = slide;
      this.loadNotificaciones();
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
    if (this.selectedTab === "proximos") {
      this.segmentProximos.loadEventos();
    } else if (this.selectedTab == "calendario") {
      this.segmentCalendario.loadEventos();
    } else if (this.selectedTab == "historial") {
      this.segmentHistorial.loadEventos();
    }
  }

  new(): void {
    let params: any = {caballo: this.caballo};
    this.navController.push(EdicionEventoCaballoPage, params);
  }

  private addEvents(): void {
    this.events.subscribe("notificaciones:caballo:refresh", () => {
      this.loadNotificaciones();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("notificaciones:caballo:refresh");
  }
}
