import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { CommonService } from "../../../../../services/common.service";
import { LanguageService } from '../../../../../services/language.service';

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
    constructor(
        private commonService: CommonService,
        private navController: NavController,
        public navParams: NavParams,
        private languageService: LanguageService
    ) {
        this.mapaId = "mapa" + new Date().getTime().toString();
    }

    ngOnInit(): void {
        this.languageService.loadLabels().then(labels => {
            this.labels = labels;
            this.establo = this.navParams.get("establo");
            if (this.establo.Latitud && this.establo.Longitud) {
                this.position = { lat: this.establo.Latitud, lng: this.establo.Longitud };
            }
            this.loadMap();
        });
    }

    ngOnDestroy(): void {
        this.map.remove(); //Destruir el mapa
    }

    close(): void {
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
            console.log('Map is ready!!!!!');
            if (this.position) { //tiene posicion?
                this.addMarker(this.position);
            }
        });

        this.map.on(plugin.google.maps.event.MAP_CLICK, position => {
            console.info("Nueva posicion");
            console.info(JSON.stringify(position));
            this.addMarker(position);
        });
    }

    private addMarker(position): void {
        this.position = position;
        this.map.clear();
        this.map.addMarker({
            "position": position
        });
    }
}