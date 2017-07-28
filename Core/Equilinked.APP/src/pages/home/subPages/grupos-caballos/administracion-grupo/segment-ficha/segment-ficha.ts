import { Component, OnInit, Input } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { SecurityService } from "../../../../../../services/security.service";
import { UserSessionEntity } from "../../../../../../model/userSession";
import { AlertasFicha } from "../alertas-ficha/alertas-ficha";
import { NotasFichaPage } from "../notas-ficha/notas-ficha";
import { UbicacionesGrupoPage } from "../ubicaciones/ubicaciones";
import { ConstantsConfig } from "../../../../../../app/utils"
import { LanguageService } from '../../../../../../services/language.service';

@Component({
    selector: "segment-ficha-grupo",
    templateUrl: "./segment-ficha.html",
    providers: [LanguageService, SecurityService]
})
export class SegmentFichaGrupo implements OnInit {

    private session: UserSessionEntity;

    @Input("grupo")
    grupo: any;
    labels: any = {};
    options: Array<any>;

    constructor(
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService,
        private languageService: LanguageService
    ) {
        this.options = new Array<any>();
        languageService.loadLabels().then(labels => {
            this.labels = labels;
            this.loadOptions();
        });
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
    }

    loadOptions(): void {
        this.options = [
            {
                label: this.labels["PANT013_BTN_UBI"],
                icon: "pin",
                page: UbicacionesGrupoPage,
                params: {}
            }, {
                label: this.labels["PANT013_BTN_DEN"],
                icon: "medical",
                page: AlertasFicha,
                params: {
                    tipoAlerta: ConstantsConfig.ALERTA_TIPO_DENTISTA
                }
            }, {
                label: this.labels["PANT013_BTN_VET"],
                icon: "medkit",
                params: {}
            }, {
                label: this.labels["PANT013_BTN_HERR"],
                icon: "paw",
                page: AlertasFicha,
                params: {
                    tipoAlerta: ConstantsConfig.ALERTA_TIPO_HERRAJE
                }
            }, {
                label: this.labels["PANT013_BTN_DESP"],
                icon: "nuclear",
                page: AlertasFicha,
                params: {
                    tipoAlerta: ConstantsConfig.ALERTA_TIPO_DESPARACITACION
                }
            }, {
                label: this.labels["PANT013_BTN_NOTS"],
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