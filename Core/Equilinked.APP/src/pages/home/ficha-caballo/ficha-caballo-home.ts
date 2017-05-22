import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams} from 'ionic-angular';
import {Utils} from '../../../app/utils'
import { CommonService } from '../../../services/common.service';
import { Caballo } from '../../../model/caballo';
import {AlimentacionPage} from './alimentacion/alimentacion';
import {NotasPage} from './notas/notas';

@Component({
    templateUrl: 'ficha-caballo-home.html',
    providers: [CommonService]
})
export class FichaCaballoPage {
    showMenuInformation: boolean;
    showMenuFotos: boolean;
    caballo: Caballo;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.caballo = this.navParams.get("caballoSelected");
        console.log(this.caballo);
        if (this.caballo != undefined) {
            this.SetVisibleMenu(true);
        } else {
            this._commonService.ShowInfo("Error obteniendo el Identificador del caballo");
        }
    }

    SetVisibleMenu(showInformation) {
        this.showMenuInformation = showInformation;
        this.showMenuFotos = !showInformation;
    }

    GoTo(idOption) {
        console.log(idOption);
        switch (idOption) {
            // DATOS
            case 1:
                console.log("DATOS");
                break;
            // ALIMENTACION
            case 6:
                this.navCtrl.push(AlimentacionPage, {
                    idCaballoSelected: this.caballo.ID
                });
                break;
            case 8:
                this.navCtrl.push(NotasPage, {
                    idCaballoSelected: this.caballo.ID
                });
                break;
        }
    }
}