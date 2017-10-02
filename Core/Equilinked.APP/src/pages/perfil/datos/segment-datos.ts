import {Component, OnInit, OnDestroy} from "@angular/core";
import {Events, NavController, NavParams, PopoverController} from "ionic-angular";
import {CommonService} from "../../../services/common.service";
import {SecurityService} from "../../../services/security.service";
import {PropietarioService} from "../../../services/propietario.service";
import {UserSessionEntity} from "../../../model/userSession";
import {Propietario} from "../../../model/propietario";
import {EquiOpcionesTelefonoPopover} from "../../../utils/equi-opciones-telefono/equi-opciones-telefono-popover";

@Component({
  selector: "segment-datos",
  templateUrl: "segment-datos.html",
  providers: [CommonService, SecurityService, PropietarioService]
})
export class SegmentDatos implements OnInit, OnDestroy {
  session: UserSessionEntity;
  propietarioEntity: Propietario;
  photoBase64: string;
  photoLoading: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              private popoverController: PopoverController,
              private commonService: CommonService,
              private securityService: SecurityService,
              private propietarioService: PropietarioService) {
    this.photoLoading = true;
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

  openOptionsTelephone(ev, number: string): void {
    this.popoverController.create(EquiOpcionesTelefonoPopover, {telephone: number})
      .present({
        ev: ev
      });
  }

  getPerfilPropietarioId(idPropietario: number, showLoading: boolean) {
    if (showLoading)
      this.commonService.showLoading("Procesando..");
    this.propietarioService.getSerializedById(idPropietario)
      .subscribe(res => {
        if (res.Image) { //si tiene imagen vamos por ella
          this.getFotoPerfil(idPropietario);//vamos por la foto!
        } else {
          this.photoLoading = false;
        }
        this.propietarioEntity = res;
        if (showLoading)
          this.commonService.hideLoading();
      }, error => {
        this.commonService.ShowErrorHttp(error, "Error obteniendo el perfil del usuario");
      });
  }

  public getPhotoBase64(): string {
    return this.photoBase64;
  }

  private getFotoPerfil(idPropietario: number): void {
    this.photoLoading = true;
    this.propietarioService.getPhoto(idPropietario)
      .then(foto => {
        this.photoBase64 = "data:image/jpeg;base64," + foto.FotoPerfil;
        this.photoLoading = false;
      }).catch(err => {
      this.photoLoading = false;
      console.error(JSON.stringify(err));
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
