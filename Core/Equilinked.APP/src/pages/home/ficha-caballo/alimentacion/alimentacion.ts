import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { Utils } from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { AlimentacionService } from '../../../../services/alimentacion.service';
import { Alimentacion } from '../../../../model/alimentacion';
import { PopoverAlimentacionPage } from './pop-over/pop-over-alimentacion';
import { FichaCaballoPage } from '../ficha-caballo-home';
import { AlimentacionEditPage } from './alimentacion-edit';


@Component({
    templateUrl: 'alimentacion.html',
    providers: [CommonService, AlimentacionService]
})
export class AlimentacionPage {
    idCaballo: number;
    nombreCaballo: string = "";
    alimentacion: Alimentacion;
    edicion: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private _commonService: CommonService,
        private formBuilder: FormBuilder,
        private _alimentacionService: AlimentacionService) {
        this.edicion = true;
    }

    ngOnInit() {
        this.alimentacion = new Alimentacion();
        if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
            this.idCaballo = this.navParams.get("idCaballoSelected");
            this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
            console.log(this.idCaballo);
            this.getAlimentacionByIdCaballo(this.idCaballo);
        }
    }

    getAlimentacionByIdCaballo(idCaballo) {
        this.edicion = false;
        this._commonService.showLoading("Procesando..");
        this._alimentacionService.getByCaballoId(idCaballo)
            .subscribe(res => {
                this._commonService.hideLoading();
                console.log("RES:", res);
                if (res) {
                    this.alimentacion = res;
                } else {
                    this._commonService.ShowInfo("Sin datos de alimentacion");
                }
                this.alimentacion.Caballo_ID = this.idCaballo;
            }, error => {
                this._commonService.ShowErrorHttp(error, "Error obteniendo la alimentacion");
            });
    }

    presentPopover(ev) {
        let popover = this.popoverCtrl.create(PopoverAlimentacionPage, {
            alimentacionEntity: this.alimentacion,
            callbackController: this
        });
        popover.present({
            ev: ev
        });
    }

    edit() {
        this.navCtrl.push(AlimentacionEditPage, {
            alimentacionEntity: this.alimentacion,
            nombreCaballo: this.nombreCaballo,
            callbackController: this
        });

    }

    goBack() {
        this.navCtrl.pop();
    }

    reloadController() {
        this.getAlimentacionByIdCaballo(this.idCaballo);
    }

}