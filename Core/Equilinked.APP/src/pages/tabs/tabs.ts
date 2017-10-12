import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Platform, Tab, Tabs, Events} from "ionic-angular"
import {HomePage} from '../home/home';
import {NotificacionesPage} from '../notificaciones/notificaciones';
import {PerfilPage} from "../perfil/perfil";
import {CalendarioPage} from "../calendario/calendario";
import {CamaraPage} from "../camara/camara";
import {LocalNotifications} from '@ionic-native/local-notifications';
import {CommonService} from '../../services/common.service';
import {NotificacionLocalService} from '../../services/notificacion-local.service';
import {ConstantsConfig} from '../../app/utils';
import moment from "moment";
import {Badge} from '@ionic-native/badge';

@Component({
  templateUrl: 'tabs.html',
  providers: [CommonService]
})
export class TabsPage implements OnInit, OnDestroy {
  @ViewChild("tabAlertas") tabAlertas: Tab;
  @ViewChild(Tabs) tabs: Tabs;
  private indexSelecteds: Array<number>;
  private interval: any;
  homeRoot: any = HomePage;
  calendarRoot: any = CalendarioPage;
  cameraRoot: any = CamaraPage;
  eventsRoot: any = NotificacionesPage;
  ownerRoot: any = PerfilPage;
  lastIconIndex: number;
  private icons: Array<any>;

  constructor(private commonService: CommonService,
              private badge: Badge,
              private events: Events,
              private localNotifications: LocalNotifications,
              private notificacionLocalService: NotificacionLocalService,
              private platform: Platform) {
    this.listIcons();
    this.platform.ready().then(this.platformReady);
  }

  private platformReady = () => {
    this.localNotifications.on('click', this.processNotification);
  }

  private processNotification = (notification) => {
    this.commonService.ShowInfo(notification.data);
    this.selectTabAlerts();
    this.tabs.select(this.tabAlertas);
  }

  ngOnInit() {
    this.addEvents();
    this.indexSelecteds = new Array<number>();
    this.startIdentifyBadge();
  }

  ngOnDestroy() {
    this.removeEvents();
  }

  selectTabAlerts(): void {
    this.tabAlertas.tabBadge = "";
    let itemBadgeAlert = localStorage.getItem(ConstantsConfig.KEY_BADGE_ALERTS);
    if (itemBadgeAlert && itemBadgeAlert != "") {
      let jsonBadgeAlert = JSON.parse(itemBadgeAlert);
      jsonBadgeAlert.view = true;
      this.badge.clear();
      localStorage.setItem(ConstantsConfig.KEY_BADGE_ALERTS, JSON.stringify(jsonBadgeAlert));
    }
  }

  refreshTab(tab: Tab): void {
    if (tab != null) {
      this.setIconSelected(tab.index);
      if (this.indexSelecteds.indexOf(tab.index) > -1) {
        if (tab.length() > 0) {
          tab.setRoot(tab.getByIndex(0));
        }
      } else {
        this.indexSelecteds.push(tab.index);
      }
    }
  }

  private createImageElement(src: string) {
    let image = document.createElement("img");
    image.src = src;
    image.classList.add("equi-icon-bottom-bar");
    return image;
  }

  setIconSelected(index: number): void {
    let elements: HTMLCollection = document.getElementsByClassName("tab-button");
    let element: Element = null;
    let icons: any = null;
    if (elements) {
      if (!this.lastIconIndex) {
        for (let i = 0; i < elements.length; i++) { //ajustar todooos!
          element = elements.item(i);
          icons = this.icons[i];
          element.replaceChild(this.createImageElement(icons.unselected), element.childNodes[1]);
        }
      }

      //ajustamos el actual seleccionado
      element = elements.item(index);
      icons = this.icons[index];
      element.replaceChild(this.createImageElement(icons.selected), element.childNodes[1]);
      if (this.lastIconIndex) {
        element = elements.item(this.lastIconIndex);
        icons = this.icons[this.lastIconIndex];
        element.replaceChild(this.createImageElement(icons.unselected), element.childNodes[1]);
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

  private startIdentifyBadge(): void {
    this.interval = setInterval(() => {
      let showBadge = (badgeAlert) => {
        this.tabAlertas.tabBadge = badgeAlert.count;
        this.tabAlertas.tabBadgeStyle = "danger";
      };
      let now = moment();
      let itemBadgeAlert = localStorage.getItem(ConstantsConfig.KEY_BADGE_ALERTS);
      let jsonBadgeAlert: any = null;
      if (itemBadgeAlert && itemBadgeAlert != "") {
        jsonBadgeAlert = JSON.parse(itemBadgeAlert);
        if (jsonBadgeAlert.day != moment().format("YYYY-MM-DD")) {
          jsonBadgeAlert = null;
        }
      }

      if (!jsonBadgeAlert) {
        this.notificacionLocalService.getRegNotificacionDia(now.format("YYYY-MM-DD"))
          .then(reg => {
            if (reg) {
              jsonBadgeAlert = {
                day: now.format("YYYY-MM-DD"),
                count: reg.cantidadAlertas,
                view: false
              };
              localStorage.setItem(ConstantsConfig.KEY_BADGE_ALERTS, JSON.stringify(jsonBadgeAlert));
              showBadge(jsonBadgeAlert);
            }
          }).catch(err => {
          console.error("Error al consultar nofificacion dia para visualizar badge");
        });
      } else {
        if (!jsonBadgeAlert.view)
          showBadge(jsonBadgeAlert);
      }
    }, 10000);
  }

  private stopIdentifyBadge(): void {
    clearInterval(this.interval);
  }

  private addEvents(): void {
    this.events.subscribe("interval-badge:clear", () => {
      this.stopIdentifyBadge();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("interval-badge:clear");
  }
}
