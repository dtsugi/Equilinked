import {Component, OnInit, OnDestroy} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {CommonService} from "../../../services/common.service";
import {SecurityService} from "../../../services/security.service";
import {PropietarioService} from "../../../services/propietario.service";
import {UserSessionEntity} from "../../../model/userSession";
import {Propietario} from "../../../model/propietario";

@Component({
  selector: "segment-datos",
  templateUrl: "segment-datos.html",
  providers: [CommonService, SecurityService, PropietarioService]
})
export class SegmentDatos implements OnInit, OnDestroy {
  session: UserSessionEntity;
  propietarioEntity: Propietario;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private commonService: CommonService,
              private securityService: SecurityService,
              private propietarioService: PropietarioService) {
  }

  ngOnInit() {
    this.propietarioEntity = new Propietario();
    this.session = this.securityService.getInitialConfigSession();
    this.getPerfilPropietarioId(this.session.PropietarioId, true);
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  getPerfilPropietarioId(idPropietario: number, showLoading: boolean) {
    if (showLoading)
      this.commonService.showLoading("Procesando..");
    this.propietarioService.getSerializedById(idPropietario)
      .subscribe(res => {
        this.propietarioEntity = res;
        if (showLoading)
          this.commonService.hideLoading();
      }, error => {
        this.commonService.ShowErrorHttp(error, "Error obteniendo el perfil del usuario");
      });
  }

  private addEvents(): void {
    this.events.subscribe("perfil:refresh", () => {
      this.getPerfilPropietarioId(this.session.PropietarioId, false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("perfil:refresh");
  }
}
