import {Component, OnInit} from '@angular/core';
import {Tab} from "ionic-angular"
import {HomePage} from '../home/home';
import {NotificacionesPage} from '../notificaciones/notificaciones';
import {PerfilPage} from "../perfil/perfil";
import {CalendarioPage} from "../calendario/calendario";
import {CamaraPage} from "../camara/camara";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {
  private indexSelecteds: Array<number>;
  homeRoot: any = HomePage;
  calendarRoot: any = CalendarioPage;
  cameraRoot: any = CamaraPage;
  eventsRoot: any = NotificacionesPage;
  ownerRoot: any = PerfilPage;
  private icons: Array<any>;

  constructor() {
  }

  ngOnInit() {
    this.indexSelecteds = new Array<number>();
    this.listIcons();
  }

  refreshTab(tab: Tab): void {
    if (tab != null) {
      this.setIconsInit(tab.index);
      if (this.indexSelecteds.indexOf(tab.index) > -1) {
        if (tab.length() > 0) {
          tab.setRoot(tab.getByIndex(0));
        }
      } else {
        this.indexSelecteds.push(tab.index);
      }
    }
  }

  setIconsInit(index: number): void {
    let elements: HTMLCollection = document.getElementsByClassName("tab-button");
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        let element: Element = elements.item(i);
        let icons: any = this.icons[i];
        let icon: string = i == index ? icons.selected : icons.unselected;
        element.innerHTML = '<img class="equi-icon-bottom-bar" src="' + icon + '" />';
      }
    }
  }

  private listIcons(): void {
    this.icons = [
      {selected: "assets/img/barra/inicio2.png", unselected: "assets/img/barra/inicio1.png"},
      {selected: "assets/img/barra/calendario2.png", unselected: "assets/img/barra/calendario1.png"},
      {selected: "assets/img/barra/camara2.png", unselected: "assets/img/barra/camara1.png"},
      {selected: "assets/img/barra/alertas2.png", unselected: "assets/img/barra/alertas1.png"},
      {selected: "assets/img/barra/perfil2.png", unselected: "assets/img/barra/perfil1.png"}
    ]
  }
}
