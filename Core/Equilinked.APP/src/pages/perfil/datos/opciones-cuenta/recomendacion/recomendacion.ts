import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserSessionEntity } from "../../../../../model/userSession";
import { CommonService } from "../../../../../services/common.service";
import { RecomendacionService } from "../../../../../services/recomendacion.service";
import { SecurityService } from "../../../../../services/security.service";
import { LanguageService } from '../../../../../services/language.service';

@Component({
    templateUrl: "./recomendacion.html",
    providers: [LanguageService, CommonService, RecomendacionService, SecurityService]
})
export class RecomendacionPage implements OnInit {

    private session: UserSessionEntity;
    invitacionForm: FormGroup;
    labels: any = {};
    constructor(
        private commonService: CommonService,
        private navController: NavController,
        private recomendacionService: RecomendacionService,
        private securityService: SecurityService,
        private languageService: LanguageService
    ) {
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.languageService.loadLabels().then(labels => {
            this.labels = labels;
            this.initForm();
        });
    }

    sendInvitation(): void {
        let invitacion: any = this.invitacionForm.value;
        invitacion.Propietario_ID = this.session.PropietarioId;

        this.commonService.showLoading(this.labels["PANT030_ALT_PRO"]);
        setTimeout(() => {
            this.recomendacionService.sendInvitacionAmigo(invitacion)
                .catch(err => {
                    console.error(err);
                });
            this.commonService.hideLoading();
            this.navController.pop().then(() => {
                this.commonService.ShowInfo(this.labels["PANT030_MSG_REOK"]);
            });
        }, 2000);
    }

    private initForm(): void {
        this.invitacionForm = new FormGroup({
            CorreoDestinatario: new FormControl("", [Validators.required]),
            Mensaje: new FormControl(this.labels["PANT030_TXT_DES"], [Validators.required])
        });
    }
}

