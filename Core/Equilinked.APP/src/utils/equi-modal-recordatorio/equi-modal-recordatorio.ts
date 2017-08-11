import { Component, OnInit } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";
import { CommonService } from "../../services/common.service";

@Component({
    templateUrl: "./equi-modal-recordatorio.html",
    providers: [CommonService]
})
export class EquiModalRecordatorio implements OnInit {

    private funcionUnidadesTiempo: Promise<any>; //Esta la ejecutamos

    recordatorio: any;
    unidadesTiempo: Array<any>;

    constructor(
        private commonService: CommonService,
        public navParams: NavParams,
        public viewController: ViewController
    ) {
        this.recordatorio = {};
        this.unidadesTiempo = new Array<any>();
    }

    ngOnInit(): void {
        this.funcionUnidadesTiempo = this.navParams.get("funcionUnidadesTiempo");
        this.loadRecordatorios();
    }

    isValid(): boolean {
        return this.recordatorio.ValorTiempo != null && this.recordatorio.UnidadTiempo != null;
    }

    cancel(): void {
        this.viewController.dismiss(null);
    }

    accept(): void {
        this.recordatorio.UnidadTiempo_ID = this.recordatorio.UnidadTiempo.ID;
        this.viewController.dismiss(this.recordatorio);
    }

    private loadRecordatorios(): void {
        this.funcionUnidadesTiempo.then(unidadesTiempo => {
            this.unidadesTiempo = unidadesTiempo;
        }).catch(err => {
            this.commonService.ShowInfo("Error al cargar las unidades de tiempo");
        });
    }
}
