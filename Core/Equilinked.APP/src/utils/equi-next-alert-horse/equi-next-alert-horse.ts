import { Component, EventEmitter, Output, Input } from "@angular/core";

@Component({
    selector: "equi-next-alert-horse",
    templateUrl: "equi-next-alert-horse.html"
})
export class EquiNextAlertHorse {

    @Input("alert")
    alert: any;
    @Input("labelDelete")
    labelDelete: string;

    @Output("actionClickItem")
    actionClick: EventEmitter<any>;
    @Output("actionDeleteItem")
    actionDelete: EventEmitter<any>;

    constructor() {
        this.actionClick = new EventEmitter();
        this.actionDelete = new EventEmitter();
    }

    executeClickAction(): void {
        if (this.actionClick.observers.length > 0) {
            this.actionClick.emit();
        }
    }

    executeDeleteAction(): void {
        if (this.actionDelete.observers.length > 0) {
            this.actionDelete.emit();
        }
    }
}