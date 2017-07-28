import { Component, OnInit } from "@angular/core";
import { NavParams, ToastController, ViewController } from "ionic-angular";
import { CommonService } from "../../services/common.service";
import { LanguageService } from '../../services/language.service';

@Component({
    templateUrl: "./equi-modal-grupos.html",
    providers: [LanguageService, CommonService]
})
export class EquiModalGrupos implements OnInit {

    labels: any = {};
    grupos: Array<any>;
    gruposRespaldo: Array<any>;

    private gruposInput: any;
    private funcionGrupos: Promise<any>; //Esta la ejecutamos 

    showSpinner: boolean;

    constructor(
        private commonService: CommonService,
        public navParams: NavParams,
        public viewController: ViewController,
        private languageService: LanguageService
    ) {
        this.grupos = [];
        this.showSpinner = true;
    }

    ngOnInit(): void {
        this.gruposInput = this.navParams.get("gruposInput");
        this.funcionGrupos = this.navParams.get("funcionGrupos");
        this.languageService.loadLabels().then(labels => {
            this.loadGrupos(); //Sacar los caballos
        });
    }

    cancel(): void {
        this.viewController.dismiss(null);
    }

    accept(): void {
        let gruposOutput: Array<any> = this.gruposRespaldo
            .filter(g => g.seleccion)
            .map(g => g.grupo);
        this.viewController.dismiss(gruposOutput);
    }

    filter(evt: any) {
        let value: string = evt.target.value;
        if (value) {
            this.grupos = this.gruposRespaldo.filter(g => {
                return g.grupo.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1;
            });
        } else {
            this.grupos = this.gruposRespaldo;
        }
    }

    selectAll(): void {
        let countSeleted = this.gruposRespaldo.filter(g => g.seleccion).length;
        let selectAll: boolean = countSeleted !== this.gruposRespaldo.length;
        this.gruposRespaldo.forEach(c => {
            c.seleccion = selectAll;
        });
    }

    private loadGrupos(): void {
        this.funcionGrupos
            .then(grupos => {
                let mapGrupos: Map<number, any> = new Map<number, any>();
                this.gruposInput.forEach(g => {
                    mapGrupos.set(g.ID, g);
                });

                this.gruposRespaldo = grupos.map(grupo => {
                    return {
                        seleccion: mapGrupos.has(grupo.ID),
                        grupo: grupo
                    }
                });
                this.grupos = this.gruposRespaldo;

                this.showSpinner = false;
            }).catch(err => {
                this.showSpinner = false;
                this.commonService.ShowInfo(this.labels["PANT025_MSG_ERR"]);
            });
    }
}