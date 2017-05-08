import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { CommonService } from '../../../services/common.service';
import { SecurityService } from '../../../services/security.service';
import { LoginPage} from '../../login/login';

@Component({
    selector: 'pop-over-datos',
    templateUrl: 'pop-over-datos.html',
    providers: [CommonService, SecurityService]
})
export class PopoverDatosPage {

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private _securityService: SecurityService) {
    }

    ngOnInit() {
    }

    logout() {
        console.log("LOGOUT");
        this._securityService.logout();
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.push(LoginPage);        
    }    
}