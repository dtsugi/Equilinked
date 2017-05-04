import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams} from 'ionic-angular';
import {Utils} from '../app/utils'
import { CommonService } from '../services/common.service';


@Component({
    templateUrl: 'template.html',
    providers: [CommonService]
})
export class TemplatePage {
    form: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
    }
}