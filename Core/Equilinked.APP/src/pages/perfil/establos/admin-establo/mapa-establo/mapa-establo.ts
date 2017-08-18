import {Component, OnInit, OnDestroy} from "@angular/core";
import {NavParams, ModalController, NavController} from "ionic-angular";
import {CommonService} from "../../../../../services/common.service";
import {LanguageService} from '../../../../../services/language.service';
import {BusquedaPosicionModal} from './busqueda-posiciones/busqueda-posiciones-modal';

declare var plugin: any;

@Component({
  templateUrl: "./mapa-establo.html",
  providers: [LanguageService, CommonService]
})
export class MapaEstabloPage implements OnDestroy, OnInit {
  private establo: any;
  private map: any;
  labels: any = {};
  mapaId: string;
  position: any;
  search: any;
  isSearch: boolean;

  constructor(private modalController: ModalController,
              private navController: NavController,
              public navParams: NavParams,
              private languageService: LanguageService) {
    this.isSearch = false;
    this.search = {value: ""};
    this.mapaId = "mapa" + new Date().getTime().toString();
  }

  ngOnInit(): void {
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.establo = this.navParams.get("establo");
      if (this.establo.Latitud && this.establo.Longitud) {
        this.position = {lat: this.establo.Latitud, lng: this.establo.Longitud};
      }
      this.loadMap();
    });
  }

  ngOnDestroy(): void {
    this.map.remove(); //Destruir el mapa
  }

  openModal(): void {
    this.isSearch = true;
    let modal = this.modalController.create(BusquedaPosicionModal, {search: this.search});
    modal.onDidDismiss(data => {
      this.isSearch = false;
      if (data) {
        this.position = data.geometry.location;
        this.addMarker(this.position);
      }
    });
    modal.present();
  }

  close(): void {
    this.navController.pop();
  }

  accept(): void {
    if (this.position) {
      this.establo.Latitud = this.position.lat;
      this.establo.Longitud = this.position.lng;
    }
    this.navController.pop();
  }

  private loadMap(): void {
    let mapElement: HTMLElement = document.getElementById(this.mapaId);
    let optionsMap: any = {
      "controls": {
        "myLocationButton": true,
      }
    };
    if (this.position) {
      optionsMap.camera = {
        "latLng": this.position,
        "zoom": 16
      }
    }
    this.map = plugin.google.maps.Map.getMap(mapElement, optionsMap);
    this.map.on(plugin.google.maps.event.MAP_READY, map => {
      if (this.position) { //tiene posicion?
        this.addMarker(this.position);
      }
    });
    this.map.on(plugin.google.maps.event.MAP_CLICK, position => {
      this.position = position;
      this.addMarker(position);
    });
  }

  private addMarker(position): void {
    this.map.clear();
    this.map.setZoom(16);
    this.map.addMarker({
      "position": position
    });
    this.map.setCenter(position);
  }
}
