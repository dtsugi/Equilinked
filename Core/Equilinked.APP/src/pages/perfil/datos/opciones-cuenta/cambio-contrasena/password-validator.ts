import { AbstractControl } from "@angular/forms";

export const passwordMatcher = (control: AbstractControl): { [key: string]: boolean } => {
    const pass1 = control.get("NuevaContrasena");
    const pass2 = control.get("ConfirmacionNuevaContrasena");
    if (pass1.value !== pass2.value) {
        pass1.setErrors({ nomatch: true });
        pass2.setErrors({ nomatch: true });
        return { nomatch: true };
    } else {
        pass1.setErrors(null);
        pass2.setErrors(null);
        return null;
    }
};