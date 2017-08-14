import {Component, OnInit} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {FormBuilder, Validators} from "@angular/forms";
import {CommonService} from "../../../../../services/common.service";
import {SecurityService} from "../../../../../services/security.service";
import {GruposCaballosService} from "../../../../../services/grupos-caballos.service";
import {CaballoService} from "../../../../../services/caballo.service";
import {Grupo} from "../../../../../model/grupo";
import {UserSessionEntity} from "../../../../../model/userSession";
import {LanguageService} from '../../../../../services/language.service';

@Component({
  templateUrl: "./creacion-grupo.html",
  providers: [LanguageService, CaballoService, CommonService, GruposCaballosService, SecurityService]
})
export class CreacionGrupoPage implements OnInit {
  labels: any = {};
  caballos: Array<any>;
  caballosRespaldo: Array<any>;
  grupo: Grupo;
  grupoCaballosForm: any;
  session: UserSessionEntity;

  constructor(private caballoService: CaballoService,
              private commonService: CommonService,
              private events: Events,
              private formBuilder: FormBuilder,
              private gruposCaballosService: GruposCaballosService,
              public navController: NavController,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.grupo = new Grupo();
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupoCaballosForm = this.formBuilder.group({
      Descripcion: [this.grupo.Descripcion, Validators.required]
    });
    this.getAllCaballosByPropietario();
  }

  selectAll(): void {
    let selectAll: boolean = this.countCaballos() !== this.caballosRespaldo.length;
    this.caballosRespaldo.forEach(c => {
      c.seleccion = selectAll;
    });
  }

  filter(evt: any): void {
    this.caballos = this.gruposCaballosService.filterCaballo(evt.target.value, this.caballosRespaldo);
  }

  save(): void {
    let grupo = {
      GrupoCaballo: this.caballos.filter(c => c.seleccion).map(c => {
        return {Caballo_ID: c.caballo.ID};
      }),
      Descripcion: this.grupoCaballosForm.value.Descripcion,
      Propietario_ID: this.session.PropietarioId,
      GrupoDefault: false
    };
    this.commonService.showLoading(this.labels["PANT012_ALT_PRO"]);
    this.gruposCaballosService.saveGrupo(grupo).then(resp => {
      this.events.publish("grupos:refresh");
      this.commonService.hideLoading();
      this.navController.pop();
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT012_MSG_ERRGU"]);
    });
  }

  private countCaballos(): number {
    return this.caballosRespaldo.filter(c => c.seleccion).length;
  }

  private getAllCaballosByPropietario(): void {
    this.commonService.showLoading(this.labels["PANT012_ALT_PRO"]);
    this.caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId)
      .subscribe(caballos => {
        this.commonService.hideLoading();
        this.caballosRespaldo = caballos.map(c => {
          return {caballo: c, seleccion: false};
        });
        this.caballos = this.caballosRespaldo;
      }, error => {
        console.error(error);
      });
  }
}
