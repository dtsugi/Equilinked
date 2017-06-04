import { Component, OnInit } from "@angular/core";
import { NavParams, ToastController, ViewController } from "ionic-angular";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonService } from "../../../../../services/common.service";
import { CaballoService } from '../../../../../services/caballo.service';
import { EstablosService } from "../../../../../services/establos.service";
import { UserSessionEntity } from "../../../../../model/userSession";

@Component({
    templateUrl: "./caballos-establo-modal.html",
    providers: [CaballoService, CommonService, EstablosService]
})
export class CaballosEstabloModal implements OnInit {

    private session: UserSessionEntity;

    //Lista de caballos que se pasaron por parametro (los que ya se habian seleccionado)
    private caballosSeleccionados: any[];

    //Caballos que se listan en esta pantalla...
    private caballosRespaldo: any[];
    caballos: any[];

    showSpinner: boolean;

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private establosService: EstablosService,
        public navParams: NavParams,
        public viewController: ViewController
    ) {
        this.caballos = [];
        this.showSpinner = true;
    }

    ngOnInit(): void {
        this.session = this.navParams.get("session");
        this.caballosSeleccionados = this.navParams.get("caballos");
        this.listCaballosByPropietarioId();//Listar caballos del propietario!
    }

    close(): void {
        this.viewController.dismiss(
            {
                caballos: this.caballos.filter(c => c.seleccion).map(c => c.establoCaballo)
            }
        );
    }

    filter(evt: any) {
        this.caballos = this.establosService.filterCaballosByNombre(evt.target.value, this.caballosRespaldo);
    }

    selectAll(): void {
        let countSeleted = this.caballos.filter(c => c.seleccion).length;
        let selectAll: boolean = countSeleted !== this.caballosRespaldo.length;
        this.caballosRespaldo.forEach(c => {
            c.seleccion = selectAll;
        });
    }

    private listCaballosByPropietarioId(): void {
        this.caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId)
            .toPromise()
            .then(caballos => {

                let mapCaballosSeleccionados: Map<number, any> = new Map<number, any>();
                this.caballosSeleccionados.forEach(cs => {
                    mapCaballosSeleccionados.set(cs.Caballo_ID, cs);
                });

                this.caballos = caballos.map(c => {
                    let cs: any = {};
                    cs.seleccion = mapCaballosSeleccionados.has(c.ID);
                    cs.caballo = c;
                    cs.establoCaballo = mapCaballosSeleccionados.has(c.ID) ?
                        mapCaballosSeleccionados.get(c.ID) :
                        {
                            ID: null,
                            Establo_ID: null,
                            Caballo_ID: c.ID
                        }
                    return cs;
                });
                this.caballosRespaldo = this.caballos;

                this.showSpinner = false;
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al guardar el establo");
            });
    }
}