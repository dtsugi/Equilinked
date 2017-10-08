import {Component, OnInit} from "@angular/core";
import {ModalController, NavParams, ViewController} from "ionic-angular";
import {CommonService} from "../../services/common.service";
import {LanguageService} from '../../services/language.service';
import {EquiModalFiltroCaballos} from '../../utils/equi-modal-filtro-caballos/filtro-caballos-modal';

@Component({
  templateUrl: "./equi-modal-caballos.html",
  providers: [LanguageService, CommonService]
})
export class EquiModalCaballos implements OnInit {
  private caballosInput: any;
  private functionFilter: Function;
  private parametersFilter: Map<string, string>;
  private caballosIds: Array<number>;
  showSpinner: boolean;
  isFilter: boolean;
  loadCaballosPromise: Promise<any>;
  caballos: Array<any>;
  caballosRespaldo: Array<any>;
  labels: any = {};

  constructor(private commonService: CommonService,
              private modalController: ModalController,
              public navParams: NavParams,
              public viewController: ViewController,
              private languageService: LanguageService) {
    this.caballos = [];
    this.caballosIds = [];
    this.isFilter = false;
    this.showSpinner = true;
  }

  ngOnInit(): void {
    this.caballosInput = this.navParams.get("caballosInput");
    this.functionFilter = this.navParams.get("functionFilter");
    this.caballosInput.forEach(c => {
      this.caballosIds.push(c.ID);
    });
    this.loadCaballosPromise = this.functionFilter(this.parametersFilter);
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.loadCaballos(); //Sacar los caballos
    });
  }

  cancel(): void {
    this.viewController.dismiss(null);
  }

  accept(): void {
    /*
    con esto salvo a los caballos que se hayan seleccionado de la lista visualizada
    let caballosOutput: Array<any> = this.caballosRespaldo
      .filter(c => c.seleccion)
      .map(c => c.caballo);
    Ahora tengo recuperar caballos que estaban seleccionados pero ni siquiera estaban visualizando (esto sucede cuando hay caballos de otros grupos)
    let caballosVisualizadosIds: Array<number> = this.caballosRespaldo.map(c => c.caballo.ID);
    this.caballosInput.forEach(ci => {
      if (caballosVisualizadosIds.indexOf(ci.ID) == -1) {
        caballosOutput.push(ci);
      }
    });*/
    let caballosOutput = this.caballosIds.map(id => {
      return {
        ID: id
      };
    });
    this.viewController.dismiss(caballosOutput);
  }

  filter(evt: any) {
    this.isFilter = false;
    this.caballosRespaldo.forEach(cab => {
      cab.caballo.NombreFilter = cab.caballo.Nombre;
      cab.caballo.EstabloFilter = cab.caballo.Establo ? cab.caballo.Establo.Nombre : null;
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      this.caballos = this.caballosRespaldo.filter(cab => {
        let indexMatchCaballo = cab.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase());
        let indexMatchEstablo = cab.caballo.Establo ? (cab.caballo.Establo.Nombre.toUpperCase().indexOf(value.toUpperCase())) : -1;
        if (indexMatchCaballo > -1) {
          let textReplace = cab.caballo.Nombre.substring(indexMatchCaballo, indexMatchCaballo + value.length);
          cab.caballo.NombreFilter = cab.caballo.Nombre.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (cab.caballo.Establo && indexMatchEstablo > -1) {
          let textReplace = cab.caballo.Establo.Nombre.substring(indexMatchEstablo, indexMatchEstablo + value.length);
          cab.caballo.EstabloFilter = cab.caballo.Establo.Nombre.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        this.isFilter = true;
        return indexMatchCaballo > -1 || indexMatchEstablo > -1;
      });
    } else {
      this.caballos = this.caballosRespaldo;
    }
  }

  openAvancedFilter(): void {
    let modal = this.modalController.create(EquiModalFiltroCaballos, {parameters: this.parametersFilter});
    modal.onDidDismiss(result => {
      if (result && result.parameters) {
        console.info(result.parameters.size);
        if (result.parameters.size > 0) {
          this.parametersFilter = result.parameters;
        } else {
          this.parametersFilter = null;
        }
        this.loadCaballosPromise = this.functionFilter(this.parametersFilter);
        this.loadCaballos();
      }
    });
    modal.present();
  }

  selectAll(): void {
    let countSeleted = this.caballosRespaldo.filter(c => c.seleccion).length;
    let selectAll: boolean = countSeleted !== this.caballosRespaldo.length;
    this.caballosRespaldo.forEach(c => {
      c.seleccion = selectAll;
      if (c.seleccion) {
        if (this.caballosIds.indexOf(c.caballo.ID) == -1)
          this.caballosIds.push(c.caballo.ID);
      } else {
        this.caballosIds.splice(this.caballosIds.indexOf(c.caballo.ID), 1);
      }
    });
  }

  selectCaballo(caballo: any): void {
    let caballoId = caballo.caballo.ID;
    caballo.seleccion = !caballo.seleccion;
    if (caballo.seleccion) {
      this.caballosIds.push(caballoId);
    } else {
      this.caballosIds.splice(this.caballosIds.indexOf(caballoId), 1);
    }
  }

  private loadCaballos(): void {
    this.loadCaballosPromise
      .then(caballos => {
        this.caballosRespaldo = caballos.map(caballo => {
          return {
            seleccion: this.caballosIds.indexOf(caballo.ID) > -1,
            caballo: caballo
          }
        });
        this.filter(null);
        this.showSpinner = false;
      }).catch(err => {
      this.showSpinner = false;
      this.commonService.ShowInfo(this.labels["PANT024_MSG_ERR"]);
    });
  }
}
