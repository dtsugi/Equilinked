import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {CambioContrasenaPage} from "./cambio-contrasena/cambio-contrasena";
import {TerminosPrivacidadPage} from "./terminos-privacidad/terminos-privacidad";
import {ContactoPage} from "./contacto/contacto";
import {RecomendacionPage} from "./recomendacion/recomendacion";
import {PreguntasFrecuentesPage} from "./preguntas-frecuentes/preguntas-frecuentes";
import {EliminacionCuentaPage} from "./eliminacion-cuenta/eliminacion-cuenta";
import {LanguageService} from '../../../../services/language.service';

@Component({
  templateUrl: "./opciones-cuenta.html",
  providers: [LanguageService]
})
export class OpcionesCuentaPage implements OnInit {
  private navCtrlMenu: NavController;
  opciones: Array<any>;
  labels: any = {};

  constructor(private navController: NavController,
              private navParams: NavParams,
              private languageService: LanguageService) {
    this.opciones = new Array<any>();
  }

  ngOnInit(): void {
    this.navCtrlMenu = this.navParams.get("navCtrlMenu");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.opciones.push({
        texto: this.labels["PANT028_BTN_CAMPA"],
        page: CambioContrasenaPage
      });
      this.opciones.push({
        texto: this.labels["PANT028_BTN_REAM"],
        page: RecomendacionPage
      });
      this.opciones.push({
        texto: this.labels["PANT028_BTN_TEPRI"],
        page: TerminosPrivacidadPage
      });
      this.opciones.push({
        texto: this.labels["PANT028_BTN_PREFR"],
        page: PreguntasFrecuentesPage
      });
      this.opciones.push({
        texto: this.labels["PANT028_BTN_CONT"],
        page: ContactoPage
      });
      this.opciones.push({
        texto: this.labels["PANT028_BTN_ELICU"],
        page: EliminacionCuentaPage
      });
    });
  }

  goBack(): void {
    this.navController.pop();
  }

  showPageOptionSelected(opcion: any): void {
    if (opcion.page) {
      this.navController.push(opcion.page, {navCtrlMenu: this.navCtrlMenu});
    }
  }
}
