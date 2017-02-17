import { ValidatorFn, AbstractControl, FormGroup, FormControl } from '@angular/forms'

import { Messages } from './messages'

export class BaseFormValidator {

    formErrors = {};
    messages: Messages = new Messages();
    form: FormGroup;

    constructor(form: FormGroup) {
        this.form = form;
    }

    addError(control: AbstractControl, errorKey: String) {
        const key: string = <string> errorKey;
        if (!control.hasError(key)) {
            if (control.errors == null) {
                const errors = {}
                errors[key] = true;
                control.setErrors(errors);
            } else {
                control.errors[key] = true;
            }
        }
    }

    clearErrors(): void {
        for (const field in this.formErrors) {
            this.formErrors[field] = [];
        }
    }

    showErrors(): void {
        if (!this.form) { return; }
        const form = this.form;
        for (const field in this.form.controls) {
            this.formErrors[field] = [];
            const control = form.get(field);
            for (const key in control.errors) {
                console.log(key);
                this.formErrors[field].push(this.messages.get(key));
            }
        }
        console.log(this.formErrors);
    }

    getErrorsFor(field: string): string[] {
        return this.formErrors[field] || [];
    }

    hasErrorsFor(field: string): boolean {
        return this.getErrorsFor(field).length > 0;
    }

}