import {Component, OnInit, ViewChild} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {UserSessionEntity} from "../../../../model/userSession";
import {CommonService} from "../../../../services/common.service";
import {SecurityService} from "../../../../services/security.service";
import {PropietarioService} from "../../../../services/propietario.service";
import {LanguageService} from "../../../../services/language.service";
import {EquiGallery} from '../../../../utils/equi-gallery/equi-gallery';

@Component({
  templateUrl: "./foto-perfil.html",
  providers: [LanguageService, CommonService, PropietarioService, SecurityService]
})
export class FotoPerfilPage implements OnInit {
  private session: UserSessionEntity;
  private photoTemp: any;
  @ViewChild(EquiGallery) equiGallery: EquiGallery;
  photoBase64: string;
  modeEdition: boolean;
  photoChanged: boolean;
  options: any;
  labels: any = {};

  constructor(private navController: NavController,
              private commonService: CommonService,
              private events: Events,
              private navParams: NavParams,
              private propietarioService: PropietarioService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.modeEdition = false;
    this.photoChanged = false;
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.photoBase64 = this.navParams.get("photoBase64");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
    });
    this.options = {};
  }

  protected selectPhoto(photo: any) {
    this.photoTemp = photo.image;
    this.photoBase64 = photo.image.base64;
    this.photoChanged = true;
    this.modeEdition = false;
  }

  public edit(): void {
    this.equiGallery.ngOnInit();
    this.modeEdition = true;
  }

  public update(): void {
    this.commonService.showLoading("Procesando...");
    this.propietarioService.updatePhoto(this.session.PropietarioId, this.photoTemp.blob, this.photoTemp.name)
      .then(() => {
        this.commonService.ShowInfo("La foto de perfil fue actualizada");
        this.navController.pop().then(() => {
          this.events.publish("perfil:refresh");
        })
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, "Error al actualizar foto de perfil");
    });
  }

  public cancel(): void {
    if (this.modeEdition) {
      this.modeEdition = false;
    } else {
      this.navController.pop();
    }
  }
}
