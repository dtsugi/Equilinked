import { Component, OnInit, Input } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { SecurityService } from "../../../../../../services/security.service";
import { UserSessionEntity } from "../../../../../../model/userSession";
import { AlertasFicha } from "../alertas-ficha/alertas-ficha";
import { NotasFichaPage } from "../notas-ficha/notas-ficha";
import { ConstantsConfig } from "../../../../../../app/utils"

@Component({
    selector: "segment-ficha-grupo",
    templateUrl: "./segment-ficha.html",
    providers: [SecurityService]
})
export class SegmentFichaGrupo implements OnInit {

    private session: UserSessionEntity;

    @Input("grupo")
    grupo: any;

    options: Array<any>;

    constructor(
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService
    ) {
        this.options = new Array<any>();
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.loadOptions();
    }

    loadOptions(): void {
        this.options = [
            {
                label: "Ubicación",
                icon: "pin",
                params: {}
            }, {
                label: "Dentista",
                icon: "medical",
                page: AlertasFicha,
                params: {
                    tipoAlerta: ConstantsConfig.ALERTA_TIPO_DENTISTA
                }
            }, {
                label: "Veterinario",
                icon: "medkit",
                params: {}
            }, {
                label: "Herraje",
                icon: "paw",
                page: AlertasFicha,
                params: {
                    tipoAlerta: ConstantsConfig.ALERTA_TIPO_HERRAJE
                }
            }, {
                label: "Desparasitación",
                icon: "nuclear",
                page: AlertasFicha,
                params: {
                    tipoAlerta: ConstantsConfig.ALERTA_TIPO_DESPARACITACION
                }
            }, {
                label: "Notas",
                icon: "paper",
                page: NotasFichaPage,
                params: {
                    tipoAlerta: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS
                }
            }
        ];
    }

    selectOption(option: any): void {
        option.params.grupo = this.grupo;
        console.info(option);
        if (option.page) {
            this.navController.push(option.page, option.params);
        }
    }
}