import { Component, OnInit } from "@angular/core";
import { NavParams, ToastController, ViewController } from "ionic-angular";
import { CommonService } from "../../services/common.service";

@Component({
    templateUrl: "./equi-modal-caballos.html",
    providers: [CommonService]
})
export class EquiModalCaballos implements OnInit {

    caballos: Array<any>;
    caballosRespaldo: Array<any>;

    private caballosInput: any;
    private funcionCaballos: Promise<any>; //Esta la ejecutamos 

    showSpinner: boolean;

    constructor(
        private commonService: CommonService,
        public navParams: NavParams,
        public viewController: ViewController
    ) {
        this.caballos = [];
        this.showSpinner = true;
    }

    ngOnInit(): void {
        this.caballosInput = this.navParams.get("caballosInput");
        this.funcionCaballos = this.navParams.get("funcionCaballos");

        this.loadCaballos(); //Sacar los caballos
    }

    cancel(): void {
        this.viewController.dismiss(null);
    }

    accept(): void {
        let caballosOutput: Array<any> = this.caballosRespaldo
            .filter(c => c.seleccion)
            .map(c => c.caballo);
        this.viewController.dismiss(caballosOutput);
    }


    filter(evt: any) {
        let value: string = evt.target.value;

        this.caballos = this.caballosRespaldo.filter(c => {
            return c.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1;
        });
    }

    selectAll(): void {
        let countSeleted = this.caballosRespaldo.filter(c => c.seleccion).length;
        let selectAll: boolean = countSeleted !== this.caballosRespaldo.length;
        this.caballosRespaldo.forEach(c => {
            c.seleccion = selectAll;
        });
    }

    private loadCaballos(): void {
        this.funcionCaballos
            .then(caballos => {
                let mapCaballos: Map<number, any> = new Map<number, any>();
                this.caballosInput.forEach(c => {
                    mapCaballos.set(c.ID, c);
                });

                this.caballosRespaldo = caballos.map(caballo => {
                    return {
                        seleccion: mapCaballos.has(caballo.ID),
                        caballo: caballo
                    }
                });
                this.caballos = this.caballosRespaldo;

                this.showSpinner = false;
            }).catch(err => {
                this.showSpinner = false;
                this.commonService.ShowInfo("Error al cargar los caballos");
            });
    }
}