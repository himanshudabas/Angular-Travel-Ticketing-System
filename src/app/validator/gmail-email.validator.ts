import {AbstractControl} from '@angular/forms';


export function GmailEmailValidator(control: AbstractControl): {[key: string]: any} | null {
  return control.value.toLowerCase().endsWith('@gmail.com') ? null : { gmailEmail : control.value };
}
