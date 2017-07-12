import { Component, OnInit, ViewChild } from "@angular/core";
import { Events, NavController, PopoverController, Slides } from "ionic-angular";
import { PopoverDatosPage } from "./datos/pop-over/pop-over-datos";

@Component({
    templateUrl: "perfil.html"
})
export class PerfilPage implements OnInit {

    @ViewChild(Slides) slides: Slides;

    selectedTab: string; //el tab seleleccionado
    parametrosEstablos: any;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public popoverCtrl: PopoverController
    ) {
        this.selectedTab = "datos";
        this.parametrosEstablos = { modoEdicion: false, getCountSelected: null };
    }

    ngOnInit() {
    }

    slideChanged() {
        let currentIndex = this.slides.getActiveIndex();
        console.log('Current index is', currentIndex);
    }

    /*Se visualiza el popover de opciones en "DATOS" */
    presentPopover(ev) {
        let popover = this.popoverCtrl.create(PopoverDatosPage, {
            navController: this.navCtrl,
            perfilPage: this
        });
        popover.present({
            ev: ev
        });
    }

    /*Activa la seleccion de establos para eliminacion en "ESTABLOS" */
    enabledDeleteEstablos(): void {
        this.parametrosEstablos.modoEdicion = true;
        this.events.publish("establos:eliminacion:enabled");
    }

    /*Desactiva la seleccion de establos para eliminacion en "ESTABLOS" */
    disabledDeleteCaballos(): void {
        this.parametrosEstablos.modoEdicion = false;
    }

    /*Solicitar confirmacion de eliminacion en "ESTABLOS"*/
    deleteEstablos(): void {
        this.events.publish("establos:eliminacion:confirmed");
    }
}