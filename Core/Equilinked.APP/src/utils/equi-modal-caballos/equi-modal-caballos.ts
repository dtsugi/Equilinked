import {Component, OnInit} from "@angular/core";
import {NavParams, ToastController, ViewController} from "ionic-angular";
import {CommonService} from "../../services/common.service";
import {LanguageService} from '../../services/language.service';

@Component({
  templateUrl: "./equi-modal-caballos.html",
  providers: [LanguageService, CommonService]
})
export class EquiModalCaballos implements OnInit {
  labels: any = {};
  caballos: Array<any>;
  caballosRespaldo: Array<any>;
  private caballosInput: any;
  private funcionCaballos: Promise<any>; //Esta la ejecutamos
  private caballosRestantes: Array<any>;
  showSpinner: boolean;

  constructor(private commonService: CommonService,
              public navParams: NavParams,
              public viewController: ViewController,
              private languageService: LanguageService) {
    this.caballos = [];
    this.showSpinner = true;
  }

  ngOnInit(): void {
    this.caballosInput = this.navParams.get("caballosInput");
    this.funcionCaballos = this.navParams.get("funcionCaballos");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.loadCaballos(); //Sacar los caballos
    });
  }

  cancel(): void {
    this.viewController.dismiss(null);
  }

  accept(): void {
    //con esto salvo a los caballos que se hayan seleccionado de la lista visualizada
    let caballosOutput: Array<any> = this.caballosRespaldo
      .filter(c => c.seleccion)
      .map(c => c.caballo);
    //Ahora tengo recuperar caballos que estaban seleccionados pero ni siquiera estaban visualizando (esto sucede cuando hay caballos de otros grupos)
    let caballosVisualizadosIds: Array<number> = this.caballosRespaldo.map(c => c.caballo.ID);
    this.caballosInput.forEach(ci => {
      if (caballosVisualizadosIds.indexOf(ci.ID) == -1) {
        caballosOutput.push(ci);
      }
    });
    this.viewController.dismiss(caballosOutput);
  }

  filter(evt: any) {
    let value: string = evt.target.value;
    this.caballos = this.caballosRespaldo.filter(c => {
      return c.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1;
    });
  }

  selectAll(): void {
    let countSeleted = this.caballosRespaldo.filter(c => c.seleccion).length;
    let selectAll: boolean = countSeleted !== this.caballosRespaldo.length;
    this.caballosRespaldo.forEach(c => {
      c.seleccion = selectAll;
    });
  }

  private loadCaballos(): void {
    this.funcionCaballos
      .then(caballos => {
        let mapCaballos: Map<number, any> = new Map<number, any>();
        this.caballosInput.forEach(c => {
          mapCaballos.set(c.ID, c);
        });
        this.caballosRespaldo = caballos.map(caballo => {
          return {
            seleccion: mapCaballos.has(caballo.ID),
            caballo: caballo
          }
        });
        this.caballos = this.caballosRespaldo;
        this.showSpinner = false;
      }).catch(err => {
      this.showSpinner = false;
      this.commonService.ShowInfo(this.labels["PANT024_MSG_ERR"]);
    });
  }
}
