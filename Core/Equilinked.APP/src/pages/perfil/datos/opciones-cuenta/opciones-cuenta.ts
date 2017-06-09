import { Component, OnInit } from "@angular/core";
import { NavController } from "ionic-angular";
import { CambioContrasenaPage } from "./cambio-contrasena/cambio-contrasena";

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
            texto: "Cambiar contraseña"
            //,
            //page: CambioContrasenaPage
        });
        this.opciones.push({
            texto: "Recomendar a un amigo"
        });
        this.opciones.push({
            texto: "Términos y privacidad"
        });
        this.opciones.push({
            texto: "Preguntas frecuentes"
        });
        this.opciones.push({
            texto: "Contáctanos"
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