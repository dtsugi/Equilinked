import {Component, OnInit} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {UserSessionEntity} from "../../../../../../model/userSession";
import {GruposCaballosService} from '../../../../../../services/grupos-caballos.service';
import {CommonService} from "../../../../../../services/common.service";
import {SecurityService} from "../../../../../../services/security.service";
import {LanguageService} from "../../../../../../services/language.service";
import {Camera} from '@ionic-native/camera';

@Component({
  templateUrl: "./foto-grupo.html",
  providers: [LanguageService, GruposCaballosService, CommonService, SecurityService]
})
export class FotoGrupoPage implements OnInit {
  private session: UserSessionEntity;
  private photoTemp: any;
  grupoId: number;
  photoBase64: string;
  photoChanged: boolean;
  photoLoading: boolean;
  labels: any = {};

  constructor(private navController: NavController,
              private gruposCaballosService: GruposCaballosService,
              private commonService: CommonService,
              private events: Events,
              private camera: Camera,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.photoChanged = false;
    this.photoLoading = true;
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupoId = this.navParams.get("grupoId");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.getFoto(this.session.PropietarioId, this.grupoId);
    });
  }

  private getFoto(idPropietario: number, idGrupo: number): void {
    this.photoLoading = true;
    this.gruposCaballosService.getPhoto(idPropietario, idGrupo)
      .then(foto => {
        this.photoBase64 = foto && foto.FotoPerfil ? "data:image/jpeg;base64," + foto.FotoPerfil : null;
        this.photoLoading = false;
      }).catch(err => {
      this.photoLoading = false;
      this.commonService.ShowErrorHttp(err, "Error al cargar la foto");
    });
  }

  public edit(): void {
    this.camera.getPicture({
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }).then(imageData => {
      if (imageData) {
        let base64: string = "data:image/jpeg;base64," + imageData;
        this.photoTemp = {
          name: new Date().getTime().toString() + ".jpeg",
          base64: base64,
          blob: this.base64toBlob(base64)
        };
        this.photoBase64 = base64;
        this.photoChanged = true;
      }
    }).catch(err => {
      console.error(JSON.stringify(err));
    });
  }

  public update(): void {
    this.gruposCaballosService.updatePhoto(this.session.PropietarioId, this.grupoId, this.photoTemp.blob, this.photoTemp.name)
      .then(() => {
        this.commonService.ShowInfo("La foto del grupo fue actualizada");
        this.events.publish("grupo:refresh");
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, "Error al actualizar foto del grupo");
    });
    this.navController.pop();
  }

  public cancel(): void {
    this.navController.pop();
  }

  private base64toBlob(base64: string) {
    var byteString = atob(base64.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab]);
  }
}
