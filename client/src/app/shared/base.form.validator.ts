import { ValidatorFn, AbstractControl, FormGroup, FormControl } from '@angular/forms'

import { Messages } from './messages'

export class BaseFormValidator {

    formErrors = {};
    messages: Messages = new Messages();
    form: FormGroup;
    modelKey: string;

    constructor(form: FormGroup, modelKey: string) {
        this.form = form;
        this.modelKey = modelKey;
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
                this.formErrors[field].push(this.messages.getModelAttrMessage(this.modelKey, field, key));
            }
        }
    }

    getErrorsFor(field: string): string[] {
        return this.formErrors[field] || [];
    }

    hasErrorsFor(field: string): boolean {
        return this.getErrorsFor(field).length > 0;
    }

}