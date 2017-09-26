import {Component, OnInit} from "@angular/core";
import {ModalController, NavController} from "ionic-angular";
import {UserSessionEntity} from "../../../../../model/userSession";
import {CommonService} from "../../../../../services/common.service";
import {ContactoService} from "../../../../../services/contacto.service";
import {SecurityService} from "../../../../../services/security.service";
import {LanguageService} from '../../../../../services/language.service';
import {EquiSelectImageModal} from '../../../../../utils/equi-modal-select-image/select-image-modal';

@Component({
  templateUrl: "./contacto.html",
  providers: [LanguageService, CommonService, ContactoService, SecurityService]
})
export class ContactoPage implements OnInit {
  private session: UserSessionEntity;
  motivos: Array<any>;
  mensaje: any;
  labels: any = {};
  images: any[];

  constructor(private commonService: CommonService,
              private contactoService: ContactoService,
              private modalController: ModalController,
              private navController: NavController,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
    this.motivos = new Array<any>();
    this.mensaje = {};
    this.images = [{}, {}];
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.listAllMotivoContactos();
  }

  selectPhoto(photo: any): void {
    this.modalController
      .create(EquiSelectImageModal, {photo: photo})
      .present();
  }

  private listAllMotivoContactos(): void {
    this.commonService.showLoading(this.labels["PANT031_ALT_PRO"]);
    this.contactoService.getAllMotivoContacto()
      .then(motivos => {
        this.commonService.hideLoading();
        this.motivos = motivos;
        this.mensaje.MotivoContacto = motivos[0].ID;
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT031_MSG_ERRMO"]);
    });
  }

  sendMessage(): void {
    let mensajeContacto: any = {
      Propietario_ID: this.session.PropietarioId,
      Mensaje: this.mensaje.Descripcion,
      MotivoContacto_ID: this.mensaje.MotivoContacto
    };
    this.commonService.showLoading(this.labels["PANT031_ALT_PRO"]);
    this.contactoService.saveMensajeContacto(mensajeContacto,
      this.images[0].blob ? this.images[0] : null,
      this.images[1].blob ? this.images[1] : null)
      .then(() => {
        this.commonService.hideLoading();
        this.navController.pop().then(() => {
          this.commonService.ShowInfo(this.labels["PANT031_MSG_ENOK"]);
        });
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT031_MSG_ERENV"]);
    });
  }
}

