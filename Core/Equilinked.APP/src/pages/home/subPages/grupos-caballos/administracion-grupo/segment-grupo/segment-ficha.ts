import { Component, OnInit, Input } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { SecurityService } from "../../../../../../services/security.service";
import { UserSessionEntity } from "../../../../../../model/userSession";

@Component({
    selector: "segment-ficha-grupo",
    templateUrl: "./segment-ficha.html",
    providers: [SecurityService]
})
export class SegmentFichaGrupo implements OnInit {

    private session: UserSessionEntity;

    @Input("grupo-id")
    grupoId: number;

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
                icon: "pin"
            }, {
                label: "Dentista",
                icon: "medical"
            }, {
                label: "Veterinario",
                icon: "medkit"
            }, {
                label: "Herraje",
                icon: "paw"
            }, {
                label: "Desparasitación",
                icon: "nuclear"
            }, {
                label: "Notas",
                icon: "paper"
            }
        ];
    }

    selectOption(option: any): void {
    }
}