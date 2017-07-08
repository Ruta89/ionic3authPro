import { FormControl } from '@angular/forms';

export class EmailValidator {

    static isValid(control: FormControl) {

        //const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(control.value);
        const re = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/.test(control.value);

        //success
        if (re) {
            return null;
        }

        return { invalidEmail: true };
    }
}

