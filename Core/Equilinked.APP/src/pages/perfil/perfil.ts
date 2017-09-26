import {Component, OnInit, ViewChild} from "@angular/core";
import {Events, NavController, PopoverController, Slides} from "ionic-angular";
import {PopoverDatosPage} from "./datos/pop-over/pop-over-datos";
import {SegmentDatos} from './datos/segment-datos';
@Component({
  templateUrl: "perfil.html"
})
export class PerfilPage implements OnInit {
  private HEIGHT_FOR_REMOVE: number = 98 + 64; //98barra superior 64 barra inferior
  private slidesMap: Map<string, number>;
  private indexSlidesMap: Map<number, string>;
  private lastSlide: string;
  @ViewChild(Slides) slides: Slides;
  @ViewChild(SegmentDatos) segmenDatos: SegmentDatos;
  currentSlide: string; //el tab seleleccionado
  parametrosEstablos: any;

  constructor(private events: Events,
              public navCtrl: NavController,
              public popoverCtrl: PopoverController) {
    this.slidesMap = new Map<string, number>();
    this.indexSlidesMap = new Map<number, string>();
    this.currentSlide = "datos";
    this.parametrosEstablos = {modoEdicion: false, getCountSelected: null};
  }

  ngOnInit() {
    this.adjustHeightSlides();
    this.lastSlide = "datos";
    this.slidesMap.set("datos", 0);
    this.slidesMap.set("establos", 1);
    this.indexSlidesMap.set(0, "datos");
    this.indexSlidesMap.set(1, "establos");
  }

  showSlide(slide: string) {
    if (slide != this.lastSlide) {
      this.slides.slideTo(this.slidesMap.get(slide), 500);
      this.lastSlide = slide;
    }
  }

  slideChanged(slide: any) {
    let tab: string = this.indexSlidesMap.get(slide.realIndex);
    if (this.lastSlide != tab) {
      this.currentSlide = tab;
      this.lastSlide = tab;
    }
  }

  /*Se visualiza el popover de opciones en "DATOS" */
  presentPopover(ev) {
    let popover = this.popoverCtrl.create(PopoverDatosPage, {
      navController: this.navCtrl,
      perfilPage: this,
      segmenDatos: this.segmenDatos
    });
    popover.present({
      ev: ev
    });
  }

  /*Activa la seleccion de establos para eliminacion en "ESTABLOS" */
  enabledDeleteEstablos(): void {
    this.parametrosEstablos.modoEdicion = true;
    this.events.publish("establos:eliminacion:enabled");
  }

  /*Desactiva la seleccion de establos para eliminacion en "ESTABLOS" */
  disabledDeleteCaballos(): void {
    this.parametrosEstablos.modoEdicion = false;
  }

  /*Solicitar confirmacion de eliminacion en "ESTABLOS"*/
  deleteEstablos(): void {
    this.events.publish("establos:eliminacion:confirmed");
  }

  private adjustHeightSlides(): void {
    let slides = document.querySelectorAll(".perfil.equi-content-slide-scroll");
    for (let i = 0; i < slides.length; i++) {
      let element: any = slides[i];
      element.style.height = (window.innerHeight - this.HEIGHT_FOR_REMOVE) + "px";
    }
  }
}
