import {Component, OnInit, ViewChild} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {CommonService} from '../../services/common.service';
import {ExtendedCaballoService} from '../../services/extended.caballo.service';
import {LanguageService} from '../../services/language.service';
import {AppConfig} from '../../app/app.config';

@Component({
  templateUrl: "./filtro-caballos-modal.html",
  providers: [CommonService, ExtendedCaballoService, LanguageService]
})
export class EquiModalFiltroCaballos implements OnInit {
  private generos: Array<any>;
  private pelajes: Array<any>;
  private protectores: Array<any>;
  private paises: Array<any>;
  private parametersForm: any;
  private labels: any = {};
  @ViewChild("formFilter") formGroup: NgForm;

  constructor(private commonService: CommonService,
              private extendedCaballoService: ExtendedCaballoService,
              private languageService: LanguageService,
              public navParams: NavParams,
              public viewController: ViewController) {
    this.parametersForm = {};
    this.generos = new Array<any>();
    this.pelajes = new Array<any>();
    this.protectores = new Array<any>();
    this.paises = new Array<any>();
  }

  ngOnInit(): void {
    let mapParameters: Map<string, string> = this.navParams.get("parameters");
    if (mapParameters) {
      mapParameters.forEach((value, key) => {
        this.parametersForm[key] = value;
      });
    }
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.getGenerosCaballos();
      this.getPelajesCaballos();
      this.getProtectoresCaballos();
      this.getPaises();
    });
  }

  cancel(): void {
    this.viewController.dismiss(null);
  }

  clear(): void {
    for (const field in this.formGroup.form.controls) { // 'field' is a string
      const control = this.formGroup.form.get(field); // 'control' is a FormControl
      control.setValue(null);
    }
    this.parametersForm = {};
  }

  search(): void {
    let mapParameters: Map<string, string> = new Map();
    for (let key in this.parametersForm) {
      let value: any = this.parametersForm[key];
      if (value && value.toString() != "") {
        mapParameters.set(key, this.parametersForm[key].toString());
      }
    }
    let countParameters = mapParameters.size;
    if (countParameters > AppConfig.MAX_ATTRIBUTES_ADVANCED_FILTER) {
      this.commonService.ShowInfo("Ha utilizado " + countParameters + " atributos de los " + AppConfig.MAX_ATTRIBUTES_ADVANCED_FILTER + " permitidos para filtrar");
      return;
    }
    this.viewController.dismiss({parameters: mapParameters});
  }

  private getGenerosCaballos() {
    this.extendedCaballoService.getAllGeneroComboBox()
      .toPromise()
      .then(generos => {
        this.generos = this.generos.concat(generos);
      }).catch(err => {
      console.error(JSON.stringify(err));
    })
  }

  private getPelajesCaballos() {
    this.extendedCaballoService.getAllPelajeComboBox()
      .toPromise()
      .then(pelajes => {
        this.pelajes = this.pelajes.concat(pelajes);
      }).catch(err => {
      console.error(JSON.stringify(err));
    });
  }

  private getProtectoresCaballos(): void {
    this.extendedCaballoService.getAllProtector()
      .then(protectores => {
        this.protectores = this.protectores.concat(protectores);
      }).catch(err => {
      console.error(JSON.stringify(err));
    });
  }

  private getPaises(): void {
    this.extendedCaballoService.getAllPaises()
      .then(paises => {
        this.paises = this.paises.concat(paises);
      }).catch(err => {
      console.error(JSON.stringify(err));
    });
  }
}
