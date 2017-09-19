import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import {MenuSuperior} from "./subPages/menuSuperior/menuSuperior";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private HEIGHT_FOR_REMOVE: number = 84 + 64; //84barra superior 64 barra inferior
  private mapSlides: Map<string, number>;
  private lastSlide: string;
  @ViewChild("menuSuperior") menuSuperior: MenuSuperior;
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController) {
    this.lastSlide = "caballos_ind";
  }

  ngOnInit(): void {
    this.adjustHeightSlides();
    this.mapSlides = new Map<string, number>();
    this.mapSlides.set("caballos_ind", 0);
    this.mapSlides.set("caballos_gru", 1);
    this.mapSlides.set("veterinarios_ind", 2);
    this.mapSlides.set("fotos_todas", 3);
    this.mapSlides.set("fotos_albums", 4);
  }

  slideChanged(slide: any) {
    if (slide) {
      this.menuSuperior.changeSubmenuByIndex(slide.realIndex);
    }
  }

  menuChange(submenu: any) {
    let index: number = this.mapSlides.get(submenu.value);
    this.slides.slideTo(index, 500);
  }

  private adjustHeightSlides(): void {
    let slides = document.querySelectorAll(".home.equi-content-slide-scroll");
    for (let i = 0; i < slides.length; i++) {
      let element: any = slides[i];
      element.style.height = (window.innerHeight - this.HEIGHT_FOR_REMOVE) + "px";
    }
  }
}
