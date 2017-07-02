import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { NotificacionesPage } from '../notificaciones/notificaciones';
import { PerfilPage } from "../perfil/perfil";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  homeRoot: any = HomePage;
  // calendarRoot: any = CalendarioPage;
  // cameraRoot: any = CamaraPage;
  eventsRoot: any = NotificacionesPage;
  ownerRoot: any = PerfilPage;

  constructor() {
  }

  ngOnInit() {
    console.log("ENTRO");
  }
}
