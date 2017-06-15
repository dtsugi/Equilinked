import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { CommonService } from "../../../../../services/common.service";
import { PreguntaFrecuenteService } from "../../../../../services/pregunta-frecuente.service";

@Component({
    templateUrl: "./preguntas-frecuentes.html",
    providers: [CommonService, PreguntaFrecuenteService],
    styles: [`
    p {
        text-align: justify;
    }
    .col {
        padding: 0px;
    }
    `]
})
export class PreguntasFrecuentesPage implements OnInit {

    preguntas: Array<any>;

    constructor(
        private commonService: CommonService,
        private navController: NavController,
        private reguntaFrecuenteService: PreguntaFrecuenteService
    ) {
        this.preguntas = new Array<any>();
    }

    ngOnInit(): void {
        this.listPreguntas();
    }

    private listPreguntas(): void {
        this.commonService.showLoading("Procesando..");
        this.reguntaFrecuenteService.getAll()
            .then(preguntas => {
                this.preguntas = preguntas.map(p => {
                    p.RespuestaVisible = false;
                    return p;
                });
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al consultar las preguntas frecuentes");
            });
    }


}

