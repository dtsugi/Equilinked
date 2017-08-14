import {Component, OnInit} from "@angular/core";
import {AlertController, Events, NavController, NavParams} from "ionic-angular";
import {CommonService} from "../../../../../services/common.service";
import {EstablosService} from "../../../../../services/establos.service";
import {SecurityService} from "../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../model/userSession";
import {LanguageService} from '../../../../../services/language.service';

@Component({
  templateUrl: "./asignacion-ubicacion.html",
  providers: [LanguageService, CommonService, EstablosService, SecurityService],
})
export class AsignacionUbicacionCaballoPage implements OnInit {
  private session: UserSessionEntity;
  private caballo: any;
  labels: any = {};
  establos: Array<any>;
  establosRespaldo: Array<any>;

  constructor(private alertController: AlertController,
              private commonService: CommonService,
              private establosService: EstablosService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.caballo = this.navParams.get("caballo");
    this.listEstablosByPropietarioId(true); //Listar establos del propietario
  }

  listEstablosByPropietarioId(showLoading: boolean): void {
    if (showLoading)
      this.commonService.showLoading(this.labels["PANT006_ALT_CAR"]);
    this.establosService.getEstablosByPropietarioId(this.session.PropietarioId)
      .then(establos => {
        this.establosRespaldo = establos;
        this.establos = establos;
        if (showLoading)
          this.commonService.hideLoading();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT006_MSG_ERREST"]);
    });
  }

  filter(evt: any): void {
    let value: string = evt.target.value;
    if (value && value != "") {
      this.establos = this.establosRespaldo.filter(establo => {
        return establo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1
          || (establo.Direccion && establo.Direccion.toUpperCase().indexOf(value.toUpperCase()) > -1);
      });
    } else {
      this.establos = this.establosRespaldo;
    }
  }

  selectEstablo(establo: any): void {
    this.alertController.create({
      title: this.labels["PANT006_ALT_ASTI"],
      message: this.labels["PANT006_ALT_ASMSG"],
      buttons: [
        {text: this.labels["PANT006_BTN_CAN"], role: "cancel"},
        {
          text: this.labels["PANT006_BTN_ACE"], handler: () => {
          this.callbackSelectEstablo(establo);
        }
        }
      ]
    }).present();
  }

  callbackSelectEstablo = (establo) => {
    this.commonService.showLoading(this.labels["PANT006_ALT_CAR"]);
    this.establosService.getEstabloById(establo.ID)
      .then(establo => {
        if (!establo.Caballo) {
          establo.Caballo = new Array<any>();
        }
        establo.Caballo.push(this.caballo);
        return this.establosService.updateEstablo(establo);
      }).then(() => {
      this.commonService.hideLoading();
      //Cuando viene de grupo de la pantalla sin ubicacion
      this.events.publish("grupo-ubicaciones:refresh");
      this.events.publish("grupo-caballos-sin-ubicacion:refresh");
      //Cuando viene de caballos
      this.events.publish("caballo-ficha:refresh"); //Ficha de caballo
      this.events.publish("caballos:refresh"); //Lista de caballos
      this.navController.pop().then(() => {
        this.commonService.ShowInfo(this.labels["PANT006_MSG_ASOK"]);
      });
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT006_MSG_ERRASI"]);
    });
  }
}
