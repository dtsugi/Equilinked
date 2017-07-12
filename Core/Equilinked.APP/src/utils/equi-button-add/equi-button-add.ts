import { Component, EventEmitter, Output, Input } from "@angular/core";

@Component({
    selector: "equi-button-add",
    templateUrl: "equi-button-add.html"
})
export class EquiButtonAdd {

    @Input("label")
    label: string;

    @Output("action")
    action: EventEmitter<any>;

    constructor() {
        this.action = new EventEmitter();
    }

    executeAction(): void {
        this.action.emit();
    }
}