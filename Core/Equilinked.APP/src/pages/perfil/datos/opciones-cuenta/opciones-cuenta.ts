import { Component, OnInit } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { CambioContrasenaPage } from "./cambio-contrasena/cambio-contrasena";
import { TerminosPrivacidadPage } from "./terminos-privacidad/terminos-privacidad";
import { ContactoPage } from "./contacto/contacto";
import { RecomendacionPage } from "./recomendacion/recomendacion";
import { PreguntasFrecuentesPage } from "./preguntas-frecuentes/preguntas-frecuentes";
import { EliminacionCuentaPage } from "./eliminacion-cuenta/eliminacion-cuenta";

@Component({
    templateUrl: "./opciones-cuenta.html",
    providers: []
})
export class OpcionesCuentaPage implements OnInit {

    private navCtrlMenu: NavController;
    opciones: Array<any>;

    constructor(
        private navController: NavController,
        private navParams: NavParams
    ) {
        this.opciones = new Array<any>();
    }

    ngOnInit(): void {
        this.navCtrlMenu = this.navParams.get("navCtrlMenu");

        this.opciones.push({
            texto: "Cambiar contraseña",
            page: CambioContrasenaPage
        });
        this.opciones.push({
            texto: "Recomendar a un amigo",
            page: RecomendacionPage
        });
        this.opciones.push({
            texto: "Términos y privacidad",
            page: TerminosPrivacidadPage
        });
        this.opciones.push({
            texto: "Preguntas frecuentes",
            page: PreguntasFrecuentesPage
        });
        this.opciones.push({
            texto: "Contáctanos",
            page: ContactoPage
        });
        this.opciones.push({
            texto: "Eliminar cuenta",
            page: EliminacionCuentaPage
        });
    }

    goBack(): void {
        this.navController.pop();
    }

    showPageOptionSelected(opcion: any): void {
        if (opcion.page) {
            this.navController.push(opcion.page, { navCtrlMenu: this.navCtrlMenu });
        }
    }
}