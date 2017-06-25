import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams} from 'ionic-angular';
import {Utils} from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { AlimentacionService } from '../../../../services/alimentacion.service';
import { Alimentacion } from '../../../../model/alimentacion';
import {AlimentacionPage} from './alimentacion';


@Component({
    templateUrl: 'alimentacion-edit.html',
    providers: [CommonService, AlimentacionService]
})
export class AlimentacionEditPage {
    form: any;
    alimentacion: Alimentacion;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private _alimentacionService: AlimentacionService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.alimentacion = new Alimentacion();
        if (this._commonService.IsValidParams(this.navParams, ["alimentacionEntity", "callbackController"])) {
            this.alimentacion = this.navParams.get("alimentacionEntity");
        }
        this.initForm();
    }

    initForm() {
        console.log(this.alimentacion);
        this.form = this.formBuilder.group({
            ID: [this.alimentacion.ID],
            Solido: [this.alimentacion.Solido],
            SuplementosDietarios: [this.alimentacion.SuplementosDietarios],
            Pasto: [this.alimentacion.Pasto],
            Caballo_ID: [this.alimentacion.Caballo_ID]
        });
    }

    save() {
        this._commonService.showLoading("Guardando..");
        console.log("SAVE:", this.form.value);
        this._alimentacionService.save(this.form.value)
            .subscribe(res => {
                console.log(res);
                this._commonService.hideLoading();
                this._commonService.ShowInfo("El registro se modifico exitosamente");
                this.goBack();
            }, error => {
                console.log(error);
                this._commonService.hideLoading();
                this._commonService.ShowInfo("Error al modificar el registro");
            });
    }

    goBack() {
        let callbackController = this.navParams.get("callbackController");
        callbackController.reloadController();
        this.navCtrl.pop();
    }    
}