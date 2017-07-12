import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Events, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Utils } from '../../../app/utils'
import { CommonService } from '../../../services/common.service';
import { Caballo } from '../../../model/caballo';
import { DatosViewPage } from './datos/datos-view';
import { AlimentacionPage } from './alimentacion/alimentacion';
import { NotasPage } from './notas/notas';
import { HerrajesPage } from './herrajes/herrajes';
import { DentistaPage } from './dentista/dentista';
import { DesparasitacionPage } from './desparasitacion/desparasitacion';
import { OpcionesCaballoPopover } from "./opciones-caballo/opciones-caballo";

@Component({
    templateUrl: 'ficha-caballo-home.html',
    providers: [CommonService]
})
export class FichaCaballoPage implements OnDestroy, OnInit {
    showMenuInformation: boolean;
    showMenuFotos: boolean;
    caballo: Caballo;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverController: PopoverController,
        private _commonService: CommonService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.caballo = this.navParams.get("caballoSelected");
        console.log(this.caballo);
        if (this.caballo != undefined) {
            this.SetVisibleMenu(true);
        } else {
            this._commonService.ShowInfo("Error obteniendo el Identificador del caballo");
        }
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    openMenu(ev: any): void {
        let params: any = {
            navCtrlCaballo: this.navCtrl,
            caballo: this.caballo
        };
        this.popoverController.create(OpcionesCaballoPopover, params).present({
            ev: ev
        });
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
                this.navCtrl.push(DatosViewPage, {
                    idCaballoSelected: this.caballo.ID,
                    nombreCaballoSelected: this.caballo.Nombre
                });
                break;
            // HERRAJES
            case 5:
                this.navCtrl.push(HerrajesPage, {
                    idCaballoSelected: this.caballo.ID,
                    nombreCaballoSelected: this.caballo.Nombre
                });
                break;
            // ALIMENTACION
            case 6:
                this.navCtrl.push(AlimentacionPage, {
                    idCaballoSelected: this.caballo.ID,
                    nombreCaballoSelected: this.caballo.Nombre
                });
                break;
            // DENTISTA
            case 7:
                this.navCtrl.push(DentistaPage, {
                    idCaballoSelected: this.caballo.ID,
                    nombreCaballoSelected: this.caballo.Nombre
                });
                break;
            // DESPARASITACION
            case 8:
                this.navCtrl.push(DesparasitacionPage, {
                    idCaballoSelected: this.caballo.ID,
                    nombreCaballoSelected: this.caballo.Nombre
                });
                break;
            // NOTAS VARIAS
            case 9:
                this.navCtrl.push(NotasPage, {
                    idCaballoSelected: this.caballo.ID,
                    nombreCaballoSelected: this.caballo.Nombre
                });
                break;
        }
    }

    private addEvents(): void { //Por este evento le haré llegar el nuevo nombre al caballo!
        this.events.subscribe("caballo:change", caballo => {
            this.caballo = caballo;
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("caballo:change");
    }
}