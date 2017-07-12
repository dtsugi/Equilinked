// An autoresize directive that works with ion-textarea
// Usage example: <ion-textarea autoresize></ion-textarea>
// Based on https://www.npmjs.com/package/angular2-autosize

import { Directive, HostListener, OnInit, ElementRef } from "@angular/core";

@Directive({
    selector: "ion-textarea[autoresize]" // Attribute selector
})
export class TextareaAutoresize implements OnInit {

    constructor(public element: ElementRef) { }

    @HostListener("input", ["$event.target"])
    onInput = (textArea: HTMLTextAreaElement): void => {
        this.adjust();
    }

    ngOnInit(): void {
        const waitThenAdjust = (trial: number): void => {
            if (trial > 10) {
                // Give up.
                return;
            }

            const ta = this.element.nativeElement.querySelector("textarea");
            if (ta !== undefined && ta !== null) {
                this.adjust();
            }
            else {
                setTimeout(() => {
                    waitThenAdjust(trial + 1);
                }, 0);
            }
        };

        // Wait for the textarea to properly exist in the DOM, then adjust it.
        waitThenAdjust(1)
    }

    adjust = (): void => {
        const ta = this.element.nativeElement.querySelector("textarea");
        if (ta !== undefined && ta !== null) {
            ta.style.overflow = "hidden";
            ta.style.height = "auto";
            ta.style.height = ta.scrollHeight + "px";
        }
    }

}