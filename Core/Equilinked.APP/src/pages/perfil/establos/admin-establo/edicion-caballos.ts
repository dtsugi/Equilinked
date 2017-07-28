import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, NavController, NavParams, ToastController } from "ionic-angular";
import { FichaCaballoPage } from "../../../home/ficha-caballo/ficha-caballo-home";
import { CaballoService } from "../../../../services/caballo.service";
import { CommonService } from "../../../../services/common.service";
import { EstablosService } from "../../../../services/establos.service";
import { LanguageService } from '../../../../services/language.service';

@Component({
    templateUrl: "./edicion-caballos.html",
    providers: [LanguageService, CaballoService, CommonService, EstablosService]
})
export class EdicionEstabloCaballosPage implements OnInit, OnDestroy {

    private establoCaballosRespaldo: Array<any>;
    private establoCaballosEdicionResp: Array<any>;
    private eventList: string;
    private eventItem: string;

    establoCabllos: Array<any>;
    establoCaballosEdicion: Array<any>;
    labels: any = {};
    establo: any;
    grupo: any;
    modoEdicion: boolean;

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private establosService: EstablosService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
        this.modoEdicion = false;
        this.establoCabllos = new Array<any>();
    }

    ngOnInit(): void {
        this.establo = this.navParams.get("establo");
        this.grupo = this.navParams.get("grupo");
        this.eventList = this.navParams.get("eventRefreshList");
        this.eventItem = this.navParams.get("eventRefreshItem");

        this.listCaballosByEstabloId(true); //Listamos los caballos del establo
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    goBack(): void {
        this.navController.pop();
    }

    edit(): void {
        this.modoEdicion = true;
        this.listCaballosByPropietario(); //Listamos los caballos disponibles
    }

    viewDetail(caballo: any): void {
        this.navController.push(FichaCaballoPage, {
            caballoSelected: caballo
        });
    }

    selectAll(): void {
        let countSeleted = this.establoCaballosEdicion.filter(ec => ec.seleccion).length;
        let selectAll: boolean = countSeleted !== this.establoCaballosEdicionResp.length;
        this.establoCaballosEdicionResp.forEach(ec => {
            ec.seleccion = selectAll
        })
    }

    filterCaballos(evt: any): void {
        this.establoCabllos = this.establosService.filterEstabloCaballosByNombre(
            evt.target.value, this.establoCaballosRespaldo
        );
    }

    filterCaballosForEdition(evt: any): void {
        this.establoCaballosEdicion = this.establosService.filterEstabloCaballosForEdition(
            evt.target.value, this.establoCaballosEdicionResp
        );
    }

    save(): void {
        this.establo.Caballo = this.establoCaballosEdicionResp
            .filter(ec => ec.seleccion)
            .map(ec => ec.caballo);

        this.commonService.showLoading(this.labels["PANT035_ALT_PRO"]);
        this.establosService.updateEstablo(this.establo)
            .then(() => {
                this.events.publish("caballo-ubicacion:refresh");//Detalle establo de ubicacion de caballo
                this.events.publish("caballo-ficha:refresh");//Ficha de opciones de caballo
                this.events.publish("caballos:refresh");//Lista de caballos

                //establos
                this.events.publish("establos:refresh"); //Pantalla de establos
                this.events.publish("establo:refresh");//Detalle de establo

                //grupos
                this.events.publish("grupo-ubicacion:refresh");//pantalla de detalle de establo en ubicaciones grupo
                this.events.publish("grupo-ubicaciones:refresh");//Lista de establos en ubicaciones de grupo

                this.listCaballosByEstabloId(false); //Refresco la lista actual
                this.modoEdicion = false;
                this.commonService.hideLoading();
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, this.labels["PANT035_MSG_ERRACT"]);
            });
    }

    private listCaballosByPropietario(): void {
        let mapEstabloCaballos: Map<number, any> = new Map<number, any>();
        this.establoCaballosRespaldo.forEach(ec => {
            mapEstabloCaballos.set(ec.ID, ec);
        });

        this.commonService.showLoading(this.labels["PANT035_ALT_PRO"]);
        this.establosService.getCaballosByEstablo(this.establo.ID, 1)
            .then(caballos => {
                this.commonService.hideLoading();
                this.establoCaballosEdicion = caballos.map(c => {
                    return {
                        seleccion: mapEstabloCaballos.has(c.ID),
                        caballo: mapEstabloCaballos.has(c.ID) ?
                            mapEstabloCaballos.get(c.ID) : c
                    };
                });
                this.establoCaballosEdicionResp = this.establoCaballosEdicion;
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, this.labels["PANT035_MSG_ERRCA"]);
                console.error(err);
            });
    }

    private listCaballosByEstabloId(showLoading: boolean): void {
        if (showLoading)
            this.commonService.showLoading(this.labels["PANT035_ALT_PRO"]);
        this.establosService.getCaballosByEstablo(this.establo.ID, 2)
            .then(establoCaballos => {
                this.establoCabllos = establoCaballos;
                this.establoCaballosRespaldo = establoCaballos;

                if (showLoading)
                    this.commonService.hideLoading();
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, this.labels["PANT035_MSG_ERRCA"]);
            });
    }

    private addEvents(): void {
        this.events.subscribe("establo-caballos:refresh", () => {
            this.listCaballosByEstabloId(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("establo-caballos:refresh")
    }
}