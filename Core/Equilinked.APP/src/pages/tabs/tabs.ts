import {Component} from '@angular/core';
import {Tab} from "ionic-angular"
import {HomePage} from '../home/home';
import {NotificacionesPage} from '../notificaciones/notificaciones';
import {PerfilPage} from "../perfil/perfil";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  private indexSelecteds: Array<number>;
  homeRoot: any = HomePage;
  // calendarRoot: any = CalendarioPage;
  // cameraRoot: any = CamaraPage;
  eventsRoot: any = NotificacionesPage;
  ownerRoot: any = PerfilPage;

  constructor() {
  }

  ngOnInit() {
    this.indexSelecteds = new Array<number>();
  }

  refreshTab(tab: Tab): void {
    if (tab != null) {
      if (this.indexSelecteds.indexOf(tab.index) > -1) {
        if (tab.length() > 0) {
          tab.setRoot(tab.getByIndex(0));
        }
      } else {
        this.indexSelecteds.push(tab.index);
      }
    }
  }
}
