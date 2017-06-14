import { Component, OnInit } from "@angular/core";
import { NavController } from "ionic-angular";
import { CambioContrasenaPage } from "./cambio-contrasena/cambio-contrasena";
import { TerminosPrivacidadPage } from "./terminos-privacidad/terminos-privacidad";
import { ContactoPage } from "./contacto/contacto";
import { RecomendacionPage } from "./recomendacion/recomendacion";

@Component({
    templateUrl: "./opciones-cuenta.html",
    providers: []
})
export class OpcionesCuentaPage implements OnInit {

    opciones: Array<any>;

    constructor(
        private navController: NavController
    ) {
        this.opciones = new Array<any>();
    }

    ngOnInit(): void {
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
            texto: "Preguntas frecuentes"
        });
        this.opciones.push({
            texto: "Contáctanos",
            page: ContactoPage
        });
        this.opciones.push({
            texto: "Eliminar cuenta"
        });
    }

    goBack(): void {
        this.navController.pop();
    }

    showPageOptionSelected(opcion: any): void {
        if (opcion.page) {
            this.navController.push(opcion.page);
        }
    }
}