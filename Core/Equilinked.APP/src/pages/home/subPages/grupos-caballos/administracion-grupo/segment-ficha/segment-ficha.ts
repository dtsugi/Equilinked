import {Component, OnInit, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {SecurityService} from "../../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../../model/userSession";
import {AlertasFicha} from "../alertas-ficha/alertas-ficha";
import {NotasFichaPage} from "../notas-ficha/notas-ficha";
import {UbicacionesGrupoPage} from "../ubicaciones/ubicaciones";
import {ConstantsConfig} from "../../../../../../app/utils"
import {LanguageService} from '../../../../../../services/language.service';

@Component({
  selector: "segment-ficha-grupo",
  templateUrl: "./segment-ficha.html",
  providers: [LanguageService, SecurityService]
})
export class SegmentFichaGrupo implements OnInit {
  private session: UserSessionEntity;
  @Input("grupo")
  grupo: any;
  labels: any = {};
  options: Array<any>;

  constructor(private navController: NavController,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.options = new Array<any>();
    this.loadOptions();
    languageService.loadLabels().then(labels => {
      this.labels = labels;
    });
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
  }

  open(index: number): void {
    let option: any = this.options[index];
    if(option && option.page) {
      option.params.grupo = this.grupo;
      this.navController.push(option.page, option.params);
    }
  }

  private loadOptions(): void {
    this.options = [
      {
        page: UbicacionesGrupoPage,
        params: {}
      }, {
        page: AlertasFicha,
        params: {
          tipoAlerta: ConstantsConfig.ALERTA_TIPO_DENTISTA
        }
      }, {
        params: {}
      }, {
        page: AlertasFicha,
        params: {
          tipoAlerta: ConstantsConfig.ALERTA_TIPO_HERRAJE
        }
      }, {
        page: AlertasFicha,
        params: {
          tipoAlerta: ConstantsConfig.ALERTA_TIPO_DESPARACITACION
        }
      }, {
        page: NotasFichaPage,
        params: {
          tipoAlerta: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS
        }
      }
    ];
  }

  selectOption(option: any): void {
    option.params.grupo = this.grupo;
    console.info(option);
    if (option.page) {
      this.navController.push(option.page, option.params);
    }
  }
}
