import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Events, NavController, NavParams, PopoverController, Slides } from 'ionic-angular';
import { Utils } from '../../../app/utils'
import { CaballoService } from '../../../services/caballo.service';
import { CommonService } from '../../../services/common.service';
import { Caballo } from '../../../model/caballo';
import { DatosViewPage } from './datos/datos-view';
import { AlimentacionPage } from './alimentacion/alimentacion';
import { NotasPage } from './notas/notas';
import { HerrajesPage } from './herrajes/herrajes';
import { DentistaPage } from './dentista/dentista';
import { DesparasitacionPage } from './desparasitacion/desparasitacion';
import { OpcionesCaballoPopover } from "./opciones-caballo/opciones-caballo";
import { UbicacionCaballoPage } from "./ubicacion/ubicacion";
import { AsignacionUbicacionCaballoPage } from "./ubicacion/asignacion-ubicacion/asignacion-ubicacion";
import { LanguageService } from '../../../services/language.service';

@Component({
    templateUrl: 'ficha-caballo-home.html',
    providers: [CaballoService, CommonService, LanguageService]
})
export class FichaCaballoPage implements OnDestroy, OnInit {

    private slidesMap: Map<string, number>;
    private indexSlidesMap: Map<number, string>;
    private lastSlide: string;

    @ViewChild(Slides) slides: Slides;

    labels: any = {};
    menu: string;
    caballo: Caballo;

    constructor(
        private caballoService: CaballoService,
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        public popoverController: PopoverController,
        private _commonService: CommonService,
        private formBuilder: FormBuilder,
        private languageService: LanguageService
    ) {
        this.slidesMap = new Map<string, number>();
        this.indexSlidesMap = new Map<number, string>();
        this.menu = "informacion";
    }

    ngOnInit(): void {
        this.slides.threshold = 120;
        this.caballo = this.navParams.get("caballoSelected");

        this.lastSlide = "informacion";
        this.slidesMap.set("informacion", 0);
        this.slidesMap.set("fotos", 1);
        this.indexSlidesMap.set(0, "informacion");
        this.indexSlidesMap.set(1, "fotos");

        this.languageService.loadLabels().then(labels => {
            this.labels = labels;
            this.getInfoCaballo(true);
        });
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    showSlide(slide: string) {
        if (slide != this.lastSlide) {
            this.slides.slideTo(this.slidesMap.get(slide), 500);
            this.lastSlide = slide;
        }
    }

    slideChanged(slide: any) {
        let tab: string = this.indexSlidesMap.get(slide.realIndex);
        if (this.lastSlide != tab) {
            this.menu = tab;
            this.lastSlide = tab;
        }
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
            //UBICACION
            case 2:
                let page;
                if (this.caballo.Establo_ID) {
                    page = UbicacionCaballoPage;
                } else {
                    page = AsignacionUbicacionCaballoPage;
                }
                this.navCtrl.push(page, { caballo: this.caballo });
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

    private getInfoCaballo(loading: boolean): void {
        if (loading)
            this._commonService.showLoading("Procesando...");
        this.caballoService.getSerializedById(this.caballo.ID).toPromise()
            .then(caballo => {
                this.caballo = caballo;

                if (loading)
                    this._commonService.hideLoading();
            }).catch(err => {
                this._commonService.ShowErrorHttp(err, "Error al cargar la información del caballo");
            });
    }

    private addEvents(): void { //Por este evento le haré llegar el nuevo nombre al caballo!
        this.events.subscribe("caballo-ficha:refresh", () => {
            this.getInfoCaballo(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("caballo-ficha:refresh");
    }
}