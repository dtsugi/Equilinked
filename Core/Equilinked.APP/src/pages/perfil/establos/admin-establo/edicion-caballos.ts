import { Component, OnInit } from "@angular/core";
import { Events, NavController, NavParams, ToastController } from "ionic-angular";
import { InfoEstabloPage } from "./info-establo";
import { FichaCaballoPage } from "../../../home/ficha-caballo/ficha-caballo-home";
import { CaballoService } from "../../../../services/caballo.service";
import { CommonService } from "../../../../services/common.service";
import { EstablosService } from "../../../../services/establos.service";

@Component({
    templateUrl: "./edicion-caballos.html",
    providers: [CaballoService, CommonService, EstablosService]
})
export class EdicionEstabloCaballosPage implements OnInit {

    private establo: any;

    establoCabllos: Array<any>;
    private establoCaballosRespaldo: Array<any>;

    establoCaballosEdicion: Array<any>;
    private establoCaballosEdicionResp: Array<any>;

    modoEdicion: boolean;

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private establosService: EstablosService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams
    ) {
        this.modoEdicion = false;
        this.establoCabllos = new Array<any>();
    }

    ngOnInit(): void {
        this.establo = this.navParams.get("establo");

        this.listCaballosByEstabloId(true); //Listamos los caballos del establo
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
        this.establo.EstabloCaballo = this.establoCaballosEdicionResp
            .filter(ec => ec.seleccion)
            .map(ec => ec.establoCaballo);

        this.commonService.showLoading("Procesando...");
        this.establosService.updateEstablo(this.establo)
            .then(() => {
                this.events.publish("establo:refresh"); //Refresco el detalle del establo seleccioadno
                this.listCaballosByEstabloId(false); //Refresco la lista actual
                this.modoEdicion = false;
                this.commonService.hideLoading();
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, "Error al actualizar los caballos seleccionados para el establo");
            });
    }

    private listCaballosByPropietario(): void {
        let mapEstabloCaballos: Map<number, any> = new Map<number, any>();
        this.establo.EstabloCaballo.forEach(ec => {
            mapEstabloCaballos.set(ec.Caballo_ID, ec);
        });

        this.commonService.showLoading("Procesando...");
        this.caballoService //Me permite su Propietario_ID Sr. Establo? :D
            .getAllSerializedByPropietarioId(this.establo.Propietario_ID)
            .toPromise()
            .then(caballos => {
                this.commonService.hideLoading();
                this.establoCaballosEdicion = caballos.map(c => {
                    return {
                        seleccion: mapEstabloCaballos.has(c.ID),
                        establoCaballo: mapEstabloCaballos.has(c.ID) ?
                            mapEstabloCaballos.get(c.ID) : { Caballo_ID: c.ID },
                        caballo: c
                    };
                });
                this.establoCaballosEdicionResp = this.establoCaballosEdicion;
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error obteniendo los caballos del propietario");
                console.error(err);
            });
    }

    private listCaballosByEstabloId(showLoading: boolean): void {
        if (showLoading) {
            this.commonService.showLoading("Procesando...");
        }
        this.establosService.getAllEstabloCaballoByEstabloId(this.establo.ID)
            .then(establoCaballos => {
                this.establoCabllos = establoCaballos;
                this.establoCaballosRespaldo = establoCaballos;
                if (showLoading) {
                    this.commonService.hideLoading();
                }
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, "Error obteniendo los caballos del establo");
            });
    }
}